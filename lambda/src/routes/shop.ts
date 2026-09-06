import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { findDelivery, quoteCart, type Order, type ReadyMadeHoop } from '@flowsha/shared';
import { botCheck, header, jsonResponse, parseBody, rawBody } from '../lib/http.js';
import { checkoutSchema } from '../lib/validation.js';
import {
  getOrder,
  getProduct,
  HoopUnavailableError,
  listPublicProducts,
  markOrderPaid,
  releaseReservation,
  reserveAndCreateOrder,
  setOrderSession,
} from '../lib/shopDb.js';
import { createCheckoutSession, isStripeEnabled, verifyWebhook } from '../lib/stripe.js';
import { sendOrderEmails } from '../lib/ses.js';

const SITE_URL = process.env.SITE_URL || 'https://flowsha.co.uk';

/** How long a checkout holds a one-off hoop before it goes back on sale. */
const RESERVATION_MINUTES = 30;

// --- GET /products -----------------------------------------------------------

export async function getProducts(): Promise<APIGatewayProxyResultV2> {
  const items = await listPublicProducts();
  // Short cache: long enough to absorb a burst, short enough that a sold hoop
  // stops showing as available quickly. Checkout re-checks server-side anyway.
  return jsonResponse(200, { items }, { 'Cache-Control': 'public, max-age=30' });
}

// --- POST /checkout ----------------------------------------------------------

export async function postCheckout(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const parsed = parseBody(event, checkoutSchema);
  if (!parsed.ok) return parsed.response;

  const bots = await botCheck(event, parsed.data);
  if (!bots.ok) return bots.response;

  if (!isStripeEnabled()) {
    return jsonResponse(503, {
      error: 'The shop isn’t taking payments just yet. Please get in touch and I’ll sort it out.',
    });
  }

  // Load every ready-made hoop the basket references, so the quote works from
  // stored records rather than anything the browser sent.
  const hoopIds = [
    ...new Set(parsed.data.items.flatMap((i) => (i.kind === 'ready-made' ? [i.hoopId] : []))),
  ];
  const hoops = new Map<string, ReadyMadeHoop>();
  for (const id of hoopIds) {
    const hoop = await getProduct(id);
    if (hoop) hoops.set(id, hoop);
  }

  const now = new Date().toISOString();
  const quoted = quoteCart(
    parsed.data.items,
    parsed.data.deliveryMethod,
    (id) => hoops.get(id),
    now,
  );
  if (!quoted.ok) return jsonResponse(400, { error: quoted.error });

  const delivery = findDelivery(parsed.data.deliveryMethod)!;
  const { quote } = quoted;

  const order: Order = {
    id: crypto.randomUUID(),
    createdAt: now,
    status: 'pending',
    lines: quote.lines,
    deliveryMethod: parsed.data.deliveryMethod,
    deliveryPence: quote.deliveryPence,
    totalPence: quote.totalPence,
    customerEmail: parsed.data.email,
    reservedHoopIds: quote.reservedHoopIds,
  };

  // Reserve the one-off hoops and write the pending order atomically. If two
  // people check out with the same hoop, exactly one transaction lands.
  try {
    await reserveAndCreateOrder(order, RESERVATION_MINUTES);
  } catch (err) {
    if (err instanceof HoopUnavailableError) return jsonResponse(409, { error: err.message });
    throw err;
  }

  try {
    const session = await createCheckoutSession({
      lineItems: quote.lines.map((l) => ({
        name: l.description,
        description: l.detail.join(' · ') || undefined,
        unitPence: l.unitPence,
        quantity: l.quantity,
      })),
      deliveryPence: quote.deliveryPence,
      deliveryLabel: delivery.label,
      orderReference: order.id,
      successUrl: `${SITE_URL}/shop/thank-you/?order=${order.id}`,
      cancelUrl: `${SITE_URL}/shop/cart/`,
      customerEmail: parsed.data.email,
      collectShippingAddress: parsed.data.deliveryMethod !== 'collection',
      // The webhook reads orderId back out of here, so it can GetItem the order
      // directly instead of searching by session id.
      metadata: { orderId: order.id },
      idempotencyKey: order.id,
    });

    await setOrderSession(order.id, session.id);
    return jsonResponse(200, { url: session.url, orderId: order.id });
  } catch (err) {
    // Stripe failed after we took the hold — give the hoops straight back rather
    // than leaving them locked for 30 minutes.
    await releaseReservation(order.id, order.reservedHoopIds);
    throw err;
  }
}

// --- POST /stripe-webhook ----------------------------------------------------

export async function postStripeWebhook(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  // Signature is over the RAW bytes. Never let the shared JSON parser near this.
  const body = rawBody(event);
  const signature = header(event, 'stripe-signature');

  const stripeEvent = await verifyWebhook(body, signature);
  if (!stripeEvent) return jsonResponse(400, { error: 'Invalid signature.' });

  const session = stripeEvent.data.object;
  const orderId: string = session?.metadata?.orderId ?? '';

  if (stripeEvent.type === 'checkout.session.completed') {
    if (!orderId) return jsonResponse(200, { received: true });

    const order = await getOrder(orderId);
    if (!order) {
      console.error(`Webhook for unknown order ${orderId}`);
      return jsonResponse(200, { received: true });
    }

    const shipping = session.collected_information?.shipping_details ?? session.shipping_details;
    const changed = await markOrderPaid(orderId, {
      customerName: shipping?.name ?? session.customer_details?.name,
      customerEmail: session.customer_details?.email ?? order.customerEmail,
      shippingAddress: formatAddress(shipping?.address),
      reservedHoopIds: order.reservedHoopIds,
    });

    // `changed === false` means Stripe replayed an event we already handled —
    // sending the emails again would be the visible symptom of a lost race.
    if (changed) {
      try {
        await sendOrderEmails({
          ...order,
          status: 'paid',
          customerName: shipping?.name ?? session.customer_details?.name,
          customerEmail: session.customer_details?.email ?? order.customerEmail,
          shippingAddress: formatAddress(shipping?.address),
        });
      } catch (err) {
        // The payment is taken and the order is recorded; a failed email must
        // never turn into a 500, because Stripe would then retry the whole event.
        console.error('Order email failed (non-fatal):', err);
      }
    }
    return jsonResponse(200, { received: true });
  }

  if (stripeEvent.type === 'checkout.session.expired') {
    if (orderId) {
      const order = await getOrder(orderId);
      if (order) await releaseReservation(orderId, order.reservedHoopIds);
    }
    return jsonResponse(200, { received: true });
  }

  // Unhandled event types are fine — acknowledge so Stripe stops retrying.
  return jsonResponse(200, { received: true });
}

function formatAddress(address?: Record<string, string | null>): string | undefined {
  if (!address) return undefined;
  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');
}
