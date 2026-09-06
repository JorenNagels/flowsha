import {
  DELIVERY_OPTIONS,
  findDelivery,
  findJoint,
  findProduct,
  findSize,
  findTape,
  findTubing,
  isCollapsibleAvailable,
} from './pricing';
import type { CartItem, HoopConfig, OrderLine, ReadyMadeHoop } from './types';

// THE single pricing implementation.
//
// The browser calls this to show a running total; the Lambda calls the SAME
// function to produce the number it actually charges. A Stripe session is never
// created from a client-supplied price — the client's figure is display-only.
// Because both sides import this module, the two cannot drift.

/** Hard cap per line. A configurator has no business ordering 500 hoops. */
export const MAX_QUANTITY = 10;

export type QuoteLine = { label: string; pence: number };

export type Quote = {
  totalPence: number;
  /** Itemised breakdown, for the configurator's "how this adds up" panel. */
  lines: QuoteLine[];
  /** Human-readable config, snapshotted onto the order and shown in emails. */
  summary: string[];
};

export type QuoteResult = { ok: true; quote: Quote } | { ok: false; error: string };

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/** Price one configured custom hoop, validating the configuration as it goes. */
export function quoteHoop(config: HoopConfig): QuoteResult {
  const product = findProduct(config.productId);
  if (!product) return fail('Unknown product.');

  const size = findSize(config.sizeInches);
  if (!size) return fail('Please choose a hoop size.');

  const tubing = findTubing(config.tubingId);
  if (!tubing) return fail('Please choose a tubing size.');

  const joint = findJoint(config.jointId);
  if (!joint) return fail('Please choose fixed or collapsible.');

  if (joint.id === 'collapsible' && !isCollapsibleAvailable(size.inches)) {
    return fail(
      `Collapsible hoops are only possible at larger sizes — ${size.label} is too small.`,
    );
  }

  if (config.tapeIds.length !== product.tapeSlots.length) {
    return fail('Please choose your tapes.');
  }

  const lines: QuoteLine[] = [{ label: `${product.name}, ${size.label}`, pence: size.basePence }];
  const summary: string[] = [
    `Size: ${size.label}`,
    `Tubing: ${tubing.label}`,
    `Joint: ${joint.label}`,
  ];

  if (tubing.surchargePence) lines.push({ label: tubing.label, pence: tubing.surchargePence });
  if (joint.surchargePence) lines.push({ label: joint.label, pence: joint.surchargePence });

  for (const [i, slot] of product.tapeSlots.entries()) {
    const tapeId = config.tapeIds[i] ?? '';

    if (!tapeId) {
      if (slot.required) return fail(`Please choose a ${slot.label.toLowerCase()}.`);
      summary.push(`${slot.label}: none`);
      continue;
    }

    const tape = findTape(tapeId);
    // Guard the kind too, or a crafted payload could smuggle a cheaper tape into
    // a slot it doesn't belong in.
    if (!tape || tape.kind !== slot.kind) return fail(`Unknown ${slot.label.toLowerCase()}.`);

    summary.push(`${slot.label}: ${tape.name}`);
    if (tape.surchargePence) {
      lines.push({ label: `${slot.label}: ${tape.name}`, pence: tape.surchargePence });
    }
  }

  const totalPence = lines.reduce((sum, l) => sum + l.pence, 0);
  return { ok: true, quote: { totalPence, lines, summary } };
}

/**
 * Can this ready-made hoop be bought right now?
 *
 * An expired-but-not-yet-released reservation still counts as buyable — the
 * authoritative check is the DynamoDB conditional write at checkout, which uses
 * the same rule. Never rely on a sweeper having run.
 */
export function isBuyable(hoop: ReadyMadeHoop, nowIso: string): boolean {
  if (hoop.status === 'available') return true;
  if (hoop.status === 'reserved') return !hoop.reservedUntil || hoop.reservedUntil < nowIso;
  return false;
}

export type CartQuote = {
  lines: OrderLine[];
  subtotalPence: number;
  deliveryPence: number;
  totalPence: number;
  /** Ready-made hoops this cart needs to hold, for the reservation transaction. */
  reservedHoopIds: string[];
};

export type CartQuoteResult = { ok: true; quote: CartQuote } | { ok: false; error: string };

/**
 * Price a whole cart. `readyMade` resolves a hoop id — the browser passes a
 * lookup over its fetched list, the Lambda passes one backed by DynamoDB.
 */
export function quoteCart(
  items: CartItem[],
  deliveryId: string,
  readyMade: (id: string) => ReadyMadeHoop | undefined,
  nowIso: string,
): CartQuoteResult {
  if (items.length === 0) return fail('Your basket is empty.');

  const delivery = findDelivery(deliveryId);
  if (!delivery) {
    const names = DELIVERY_OPTIONS.map((d) => d.label).join(' or ');
    return fail(`Please choose a delivery option (${names}).`);
  }

  const lines: OrderLine[] = [];
  const reservedHoopIds: string[] = [];

  for (const item of items) {
    if (item.kind === 'custom') {
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY) {
        return fail(`Quantity must be between 1 and ${MAX_QUANTITY}.`);
      }
      const result = quoteHoop(item.config);
      if (!result.ok) return result;

      const product = findProduct(item.config.productId)!;
      lines.push({
        description: product.name,
        detail: result.quote.summary,
        quantity: item.quantity,
        unitPence: result.quote.totalPence,
        linePence: result.quote.totalPence * item.quantity,
      });
      continue;
    }

    // Ready-made: one-offs, so quantity is always 1 and the price comes from the
    // stored record, never from the client.
    const hoop = readyMade(item.hoopId);
    if (!hoop) return fail('One of the hoops in your basket is no longer listed.');
    if (!isBuyable(hoop, nowIso)) {
      return fail(
        `Sorry — “${hoop.title}” has just been taken. Please remove it from your basket.`,
      );
    }

    reservedHoopIds.push(hoop.id);
    lines.push({
      description: hoop.title,
      detail: [`One-off ready-made hoop`, `Size: ${hoop.sizeInches}″`],
      quantity: 1,
      unitPence: hoop.pricePence,
      linePence: hoop.pricePence,
    });
  }

  const subtotalPence = lines.reduce((sum, l) => sum + l.linePence, 0);
  const totalPence = subtotalPence + delivery.pricePence;

  return {
    ok: true,
    quote: {
      lines,
      subtotalPence,
      deliveryPence: delivery.pricePence,
      totalPence,
      reservedHoopIds,
    },
  };
}
