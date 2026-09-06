// Stripe over plain fetch — deliberately NOT the `stripe` npm SDK.
//
// build.mjs only externalises the four AWS SDK clients the runtime ships, so the
// Stripe SDK would be bundled into the function: ~1 MB of code for two API calls,
// paid on every cold start. Creating a Checkout Session is one form-encoded POST
// and verifying a webhook is an HMAC, so the SDK earns nothing here.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { loadSecret } from './secrets.js';

const API_BASE = 'https://api.stripe.com/v1';

const DIRECT_KEY = process.env.STRIPE_SECRET_KEY || '';
const KEY_PARAM = process.env.STRIPE_SECRET_PARAM || '';
const DIRECT_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const WEBHOOK_SECRET_PARAM = process.env.STRIPE_WEBHOOK_SECRET_PARAM || '';

/** False in local dev with no keys configured — checkout then returns a clear 503. */
export function isStripeEnabled(): boolean {
  return Boolean(DIRECT_KEY || KEY_PARAM);
}

// --- Form encoding -----------------------------------------------------------

// Stripe's API takes application/x-www-form-urlencoded with bracket notation for
// nested data, e.g. `line_items[0][price_data][currency]=gbp`.
function encode(params: unknown, prefix = '', out: string[] = []): string[] {
  if (params === undefined || params === null) return out;

  if (Array.isArray(params)) {
    params.forEach((v, i) => encode(v, `${prefix}[${i}]`, out));
    return out;
  }
  if (typeof params === 'object') {
    for (const [k, v] of Object.entries(params as Record<string, unknown>)) {
      encode(v, prefix ? `${prefix}[${k}]` : k, out);
    }
    return out;
  }
  out.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(params))}`);
  return out;
}

async function stripeRequest<T>(
  path: string,
  body: unknown,
  opts: { idempotencyKey?: string } = {},
): Promise<T> {
  const key = await loadSecret(DIRECT_KEY, KEY_PARAM);
  if (!key) throw new Error('Stripe is not configured.');

  const headers: Record<string, string> = {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  // Stripe retries network failures; without this a retry could create a second
  // Checkout Session (and a second order) for one customer click.
  if (opts.idempotencyKey) headers['Idempotency-Key'] = opts.idempotencyKey;

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: encode(body).join('&'),
  });

  const json = (await res.json().catch(() => ({}))) as Record<string, any>;
  if (!res.ok) {
    const message = json?.error?.message ?? `Stripe request failed (${res.status}).`;
    throw new Error(message);
  }
  return json as T;
}

// --- Checkout Sessions -------------------------------------------------------

export type CheckoutLineItem = {
  name: string;
  description?: string;
  unitPence: number;
  quantity: number;
};

export type CreateSessionInput = {
  lineItems: CheckoutLineItem[];
  /** Flat-rate postage, or 0 for local collection. */
  deliveryPence: number;
  deliveryLabel: string;
  /** Shown to the customer and echoed back on the webhook. */
  orderReference: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  /** Collection needs no address; delivery does. */
  collectShippingAddress: boolean;
  metadata: Record<string, string>;
  idempotencyKey: string;
};

export type StripeSession = { id: string; url: string };

export async function createCheckoutSession(input: CreateSessionInput): Promise<StripeSession> {
  const body: Record<string, unknown> = {
    mode: 'payment',
    // Ad-hoc `price_data` rather than a synced Stripe product catalogue: every
    // custom hoop is a unique configuration, so there is nothing to reuse.
    line_items: input.lineItems.map((li) => ({
      quantity: li.quantity,
      price_data: {
        currency: 'gbp',
        unit_amount: li.unitPence,
        product_data: li.description
          ? { name: li.name, description: li.description }
          : { name: li.name },
      },
    })),
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    client_reference_id: input.orderReference,
    metadata: input.metadata,
    // Stripe emails its own receipt. Not a substitute for our order confirmation,
    // but a useful backstop while SES is still sandboxed.
    payment_intent_data: { metadata: input.metadata },
  };

  if (input.customerEmail) body.customer_email = input.customerEmail;

  if (input.collectShippingAddress) {
    // UK only — no customs, no IOSS, no international VAT.
    body.shipping_address_collection = { allowed_countries: ['GB'] };
  }

  // Let Stripe show and charge postage, so we don't rebuild a delivery step.
  body.shipping_options = [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        display_name: input.deliveryLabel,
        fixed_amount: { amount: input.deliveryPence, currency: 'gbp' },
      },
    },
  ];

  const session = await stripeRequest<StripeSession>('/checkout/sessions', body, {
    idempotencyKey: input.idempotencyKey,
  });
  return { id: session.id, url: session.url };
}

// --- Webhook signature verification -----------------------------------------

export type StripeEvent = {
  id: string;
  type: string;
  data: { object: Record<string, any> };
};

/**
 * Verify a webhook against the `Stripe-Signature` header.
 *
 * The signed payload is `<timestamp>.<raw body>` — the RAW bytes, exactly as sent.
 * Re-serialising parsed JSON changes the bytes and the signature will never match,
 * which is why the handler must keep this path away from the shared body parser.
 */
export async function verifyWebhook(
  rawBody: string,
  signatureHeader: string,
  toleranceSeconds = 300,
): Promise<StripeEvent | null> {
  const secret = await loadSecret(DIRECT_WEBHOOK_SECRET, WEBHOOK_SECRET_PARAM);
  if (!secret || !signatureHeader) return null;

  // Header form: `t=1699999999,v1=abc...,v1=def...`
  let timestamp = '';
  const signatures: string[] = [];
  for (const part of signatureHeader.split(',')) {
    const [k, v] = part.split('=');
    if (k === 't') timestamp = v ?? '';
    else if (k === 'v1' && v) signatures.push(v);
  }
  if (!timestamp || signatures.length === 0) return null;

  // Reject replays of an old, previously-valid signature.
  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (!Number.isFinite(age) || Math.abs(age) > toleranceSeconds) return null;

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`, 'utf8')
    .digest('hex');
  const expectedBuf = Buffer.from(expected, 'utf8');

  const matched = signatures.some((sig) => {
    const sigBuf = Buffer.from(sig, 'utf8');
    // timingSafeEqual throws on a length mismatch, so guard first.
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
  if (!matched) return null;

  try {
    return JSON.parse(rawBody) as StripeEvent;
  } catch {
    return null;
  }
}
