'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CUSTOM_PRODUCTS,
  DELIVERY_OPTIONS,
  findDelivery,
  formatPence,
  quoteCart,
  type DeliveryMethodId,
  type ReadyMadeHoop,
} from '@flowsha/shared';
import { apiPost, errorMessage } from '@/lib/api';
import { apiGet } from '@/lib/api';
import { SkeletonCardList, SkeletonGroup } from '@/components/Skeleton';
import { useTurnstile } from '@/hooks/useTurnstile';
import { useCart } from '@/components/shop/CartProvider';

// Checkout gets a VISIBLE Turnstile challenge, unlike the frictionless invisible
// one on the other forms — card-testing attacks target checkout endpoints
// specifically. Whether the widget is a checkbox is a property of the site key
// (set in the Cloudflare dashboard), so this needs its own Managed-mode key;
// falling back to the default key just keeps local dev working.
const CHECKOUT_TURNSTILE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_CHECKOUT_SITE_KEY ||
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  '';

const LEAD_TIME = '3–10 working days';

type Status = 'loading' | 'ready' | 'submitting' | 'error';

export default function CartView() {
  const { entries, isReady, remove, setQuantity } = useCart();

  const [hoops, setHoops] = useState<Map<string, ReadyMadeHoop>>(new Map());
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [delivery, setDelivery] = useState<DeliveryMethodId>('uk-standard');
  const [accepted, setAccepted] = useState(false);

  const turnstile = useTurnstile({ siteKey: CHECKOUT_TURNSTILE_KEY, appearance: 'always' });

  // Resolve ready-made lines against live stock, so a hoop sold since it went in
  // the basket shows as unavailable rather than silently failing at checkout.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet<{ items: ReadyMadeHoop[] }>('/products');
        if (!cancelled) {
          setHoops(new Map((data.items ?? []).map((h) => [h.id, h])));
          setStatus('ready');
        }
      } catch {
        // Non-fatal: a basket of custom hoops only doesn't need this list at all.
        if (!cancelled) setStatus('ready');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => entries.map((e) => e.item), [entries]);

  const quoted = useMemo(
    () => quoteCart(items, delivery, (id) => hoops.get(id), new Date().toISOString()),
    [items, delivery, hoops],
  );

  async function onCheckout() {
    setError('');

    if (turnstile.enabled && !turnstile.getToken()) {
      setError('Please complete the “I’m human” check above.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await apiPost<{ url: string }>('/checkout', {
        items,
        deliveryMethod: delivery,
        email,
        acceptedTerms: accepted,
        company: '',
        turnstileToken: turnstile.getToken(),
      });
      // Hand off to Stripe. The cart is intentionally NOT cleared here — if they
      // cancel, they come back to an intact basket. It clears on /shop/thank-you/.
      window.location.href = res.url;
    } catch (err) {
      setStatus('error');
      setError(errorMessage(err));
      turnstile.reset();
    }
  }

  if (!isReady || status === 'loading') {
    return (
      <SkeletonGroup label="Loading your basket…">
        <SkeletonCardList count={2} />
      </SkeletonGroup>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center">
        <p className="text-cream/80">Your basket is empty.</p>
        <a href="/shop/" className="mt-3 inline-block text-terracotta-light underline">
          Have a look at the hoops
        </a>
      </div>
    );
  }

  const busy = status === 'submitting';
  const deliveryOption = findDelivery(delivery)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      {/* Lines */}
      <ul className="space-y-4">
        {entries.map((entry) => {
          const { item } = entry;
          const hoop = item.kind === 'ready-made' ? hoops.get(item.hoopId) : undefined;
          const product =
            item.kind === 'custom'
              ? CUSTOM_PRODUCTS.find((p) => p.id === item.config.productId)
              : undefined;

          return (
            <li
              key={entry.lineId}
              className="rounded-3xl border border-cream/10 bg-forest/40 p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg text-cream">
                    {product?.name ?? hoop?.title ?? 'Item'}
                  </h2>
                  {item.kind === 'custom' && (
                    <ul className="mt-1 space-y-0.5 text-sm text-cream/65">
                      {describeConfig(item.config).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
                  {item.kind === 'ready-made' && !hoop && (
                    <p className="mt-1 text-sm text-terracotta-light">
                      This hoop is no longer listed — please remove it.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(entry.lineId)}
                  className="shrink-0 text-sm text-cream/55 underline hover:text-terracotta-light"
                >
                  Remove
                </button>
              </div>

              {item.kind === 'custom' && (
                <div className="mt-4 flex items-center gap-3">
                  <label
                    htmlFor={`qty-${entry.lineId}`}
                    className="text-sm font-semibold text-cream/80"
                  >
                    Quantity
                  </label>
                  <input
                    id={`qty-${entry.lineId}`}
                    type="number"
                    min={1}
                    max={10}
                    value={item.quantity}
                    onChange={(e) => setQuantity(entry.lineId, Number(e.target.value))}
                    className="w-20 rounded-xl border border-cream/15 bg-forest/40 px-3 py-2 text-cream outline-none focus:border-terracotta-light"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Summary + pre-contract disclosure + pay */}
      <aside className="rounded-3xl border border-cream/10 bg-forest/40 p-6">
        <h2 className="font-display text-xl text-cream">Summary</h2>

        <fieldset className="mt-5">
          <legend className="mb-1.5 block text-sm font-semibold text-cream/80">Delivery</legend>
          <div className="space-y-2">
            {DELIVERY_OPTIONS.map((d) => (
              <label
                key={d.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream/15 p-3 text-sm text-cream/85 has-[:checked]:border-terracotta-light"
              >
                <input
                  type="radio"
                  name="delivery"
                  value={d.id}
                  checked={delivery === d.id}
                  onChange={() => setDelivery(d.id)}
                  className="mt-1"
                />
                <span>
                  <span className="font-semibold">{d.label}</span> — {formatPence(d.pricePence)}
                  <span className="block text-xs text-cream/55">{d.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label
            htmlFor="checkout-email"
            className="mb-1.5 block text-sm font-semibold text-cream/80"
          >
            Email for your order confirmation
          </label>
          <input
            id="checkout-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-3 text-cream placeholder-cream/40 outline-none transition focus:border-terracotta-light focus:ring-2 focus:ring-terracotta-light/20"
            placeholder="you@example.com"
          />
        </div>

        {/* Totals */}
        <dl className="mt-6 space-y-1.5 border-t border-cream/10 pt-4 text-sm">
          <div className="flex justify-between text-cream/75">
            <dt>Subtotal</dt>
            <dd>{quoted.ok ? formatPence(quoted.quote.subtotalPence) : '—'}</dd>
          </div>
          <div className="flex justify-between text-cream/75">
            <dt>{deliveryOption.label}</dt>
            <dd>{formatPence(deliveryOption.pricePence)}</dd>
          </div>
          <div className="flex justify-between pt-2 font-display text-2xl text-terracotta">
            <dt>Total</dt>
            <dd>{quoted.ok ? formatPence(quoted.quote.totalPence) : '—'}</dd>
          </div>
        </dl>

        {/*
          Pre-contract information. The Consumer Contracts Regulations require the
          total price, the main characteristics, the lead time and the cancellation
          right to be given prominence IMMEDIATELY before the order is placed —
          this block is a legal requirement, not a nicety. Do not move it below the
          button or collapse it behind a link.
        */}
        <div className="mt-6 rounded-2xl border border-cream/15 bg-forest/30 p-4 text-xs leading-relaxed text-cream/75">
          <p className="mb-2 font-semibold text-cream/90">Before you order</p>
          <ul className="space-y-1">
            <li>
              Total to pay, including delivery:{' '}
              <strong className="text-cream">
                {quoted.ok ? formatPence(quoted.quote.totalPence) : '—'}
              </strong>
              . No VAT is charged.
            </li>
            <li>
              Each hoop is made by hand to your specification. Expect{' '}
              <strong className="text-cream">{LEAD_TIME}</strong> before dispatch.
            </li>
            <li>
              You may cancel for any reason within <strong className="text-cream">14 days</strong>{' '}
              of delivery and get a refund within 14 days of telling me. You pay return postage.{' '}
              <a href="/returns/" className="text-terracotta-light underline">
                Returns &amp; cancellations
              </a>
              .
            </li>
            <li>
              Sold by Flowsha, Southampton, UK ·{' '}
              <a href="/terms/" className="text-terracotta-light underline">
                Terms
              </a>
            </li>
          </ul>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-cream/85">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1"
          />
          <span>
            I’ve read and accept the{' '}
            <a href="/terms/" className="text-terracotta-light underline">
              terms
            </a>{' '}
            and{' '}
            <a href="/returns/" className="text-terracotta-light underline">
              cancellation policy
            </a>
            .
          </span>
        </label>

        {turnstile.enabled && <div ref={turnstile.widgetRef} className="mt-4" />}

        {!quoted.ok && (
          <p className="mt-4 rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
            {quoted.error}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onCheckout}
          disabled={busy || !quoted.ok || !accepted || !email}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-terracotta-deep px-8 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Taking you to payment…' : 'Pay securely with Stripe'}
        </button>
        <p className="mt-3 text-center text-xs text-cream/50">
          You’ll be taken to Stripe to pay. I never see your card details.
        </p>
      </aside>
    </div>
  );
}

function describeConfig(config: {
  sizeInches: number;
  tubingId: string;
  jointId: string;
  tapeIds: string[];
}): string[] {
  // Mirrors the server's summary, but the server's version is what gets stored.
  return [
    `Size: ${config.sizeInches}″`,
    `Tubing: ${config.tubingId === 'skinny' ? '16mm skinny' : '19mm regular'}`,
    `Joint: ${config.jointId === 'collapsible' ? 'Collapsible' : 'Fixed'}`,
  ];
}
