'use client';

import { useMemo, useState } from 'react';
import {
  coilsFully,
  CUSTOM_PRODUCTS,
  formatPence,
  isCollapsibleAvailable,
  JOINTS,
  PRICES_ARE_REAL,
  quoteHoop,
  SIZES,
  tapesOfKind,
  TUBING,
  type CustomProductId,
  type HoopConfig,
  type JointId,
  type TubingId,
} from '@flowsha/shared';
import { useCart } from '@/components/shop/CartProvider';

const label = 'mb-1.5 block text-sm font-semibold text-cream/80';
const select =
  'w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-3 text-cream outline-none transition focus:border-terracotta-light focus:ring-2 focus:ring-terracotta-light/20';

export default function HoopConfigurator({ productId }: { productId: CustomProductId }) {
  const product = CUSTOM_PRODUCTS.find((p) => p.id === productId)!;

  const [sizeInches, setSizeInches] = useState(32);
  const [tubingId, setTubingId] = useState<TubingId>('regular');
  const [jointId, setJointId] = useState<JointId>('fixed');
  const [tapeIds, setTapeIds] = useState<string[]>(() => product.tapeSlots.map(() => ''));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const { addCustom } = useCart();

  const collapsibleOk = isCollapsibleAvailable(sizeInches);
  // Selecting a big size, choosing collapsible, then shrinking would otherwise
  // leave an impossible configuration selected but invisible.
  const effectiveJoint: JointId = collapsibleOk ? jointId : 'fixed';

  const config: HoopConfig = useMemo(
    () => ({ productId, sizeInches, tubingId, jointId: effectiveJoint, tapeIds }),
    [productId, sizeInches, tubingId, effectiveJoint, tapeIds],
  );

  const result = useMemo(() => quoteHoop(config), [config]);

  function setTape(index: number, value: string) {
    setTapeIds((prev) => prev.map((t, i) => (i === index ? value : t)));
    setAdded(false);
  }

  function onAdd() {
    setAttempted(true);
    if (!result.ok) return;
    addCustom(config, quantity);
    setAdded(true);
  }

  return (
    <div className="rounded-3xl border border-cream/10 bg-forest/40 p-6 sm:p-8">
      <h2 className="font-display text-2xl text-cream">Make it yours</h2>

      {!PRICES_ARE_REAL && (
        <p className="mt-4 rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
          <strong>Prices shown are placeholders</strong> while I finalise them — nothing here is
          real yet, and checkout is not open.
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {/* Size */}
        <div>
          <label className={label} htmlFor="hoop-size">
            Size
          </label>
          <select
            id="hoop-size"
            className={select}
            value={sizeInches}
            onChange={(e) => {
              setSizeInches(Number(e.target.value));
              setAdded(false);
            }}
          >
            {SIZES.map((s) => (
              <option key={s.inches} value={s.inches}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-cream/55">
            Not sure?{' '}
            <a href="/shop/size-guide/" className="text-terracotta-light underline">
              Read the size guide
            </a>
            .
          </p>
        </div>

        {/* Tubing */}
        <div>
          <label className={label} htmlFor="hoop-tubing">
            Tubing
          </label>
          <select
            id="hoop-tubing"
            className={select}
            value={tubingId}
            onChange={(e) => {
              setTubingId(e.target.value as TubingId);
              setAdded(false);
            }}
          >
            {TUBING.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-cream/55">
            {TUBING.find((t) => t.id === tubingId)?.description}
          </p>
        </div>
      </div>

      {/* Joint. Explained rather than silently hidden when unavailable. */}
      <fieldset className="mt-5">
        <legend className={label}>Fixed or collapsible</legend>
        <div className="flex flex-wrap gap-2">
          {JOINTS.map((j) => {
            const disabled = j.id === 'collapsible' && !collapsibleOk;
            const active = effectiveJoint === j.id;
            return (
              <button
                key={j.id}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => {
                  setJointId(j.id);
                  setAdded(false);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? 'border-terracotta-light bg-terracotta-light font-semibold text-forest-dark'
                    : 'border-cream/25 text-cream/85 hover:border-terracotta-light'
                } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
              >
                {j.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-cream/55">
          {collapsibleOk
            ? coilsFully(sizeInches)
              ? 'At this size a collapsible hoop coils down fully for travel.'
              : 'At exactly 30″ a collapsible hoop folds, but only coils part-way.'
            : 'Collapsible isn’t possible below 30″ — the curve is too tight for the joint to sit safely. Larger sizes unlock it.'}
        </p>
      </fieldset>

      {/* Tapes, with visible swatches — colour names alone are a poor way to buy
          something decorative. */}
      {product.tapeSlots.map((slot, i) => {
        const options = tapesOfKind(slot.kind);
        const chosen = tapeIds[i];
        return (
          <fieldset className="mt-5" key={slot.kind}>
            <legend className={label}>
              {slot.label}
              {!slot.required && <span className="font-normal text-cream/50"> (optional)</span>}
            </legend>
            <p className="mb-2 text-xs text-cream/55">{slot.help}</p>
            <div className="flex flex-wrap gap-2">
              {!slot.required && (
                <SwatchButton
                  active={chosen === ''}
                  onClick={() => setTape(i, '')}
                  swatch="transparent"
                  name="None"
                />
              )}
              {options.map((t) => (
                <SwatchButton
                  key={t.id}
                  active={chosen === t.id}
                  onClick={() => setTape(i, t.id)}
                  swatch={t.swatch}
                  name={t.name}
                />
              ))}
            </div>
          </fieldset>
        );
      })}

      {/* Quantity */}
      <div className="mt-5 max-w-[8rem]">
        <label className={label} htmlFor="hoop-qty">
          Quantity
        </label>
        <input
          id="hoop-qty"
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) => {
            setQuantity(Math.max(1, Math.min(10, Number(e.target.value) || 1)));
            setAdded(false);
          }}
          className={select}
        />
      </div>

      {/* Running total. aria-live so the price change is announced, not just seen. */}
      <div className="mt-6 border-t border-cream/10 pt-5">
        <div aria-live="polite" aria-atomic="true">
          {result.ok ? (
            <>
              <p className="font-display text-3xl text-terracotta">
                {formatPence(result.quote.totalPence * quantity)}
              </p>
              <ul className="mt-2 space-y-0.5 text-xs text-cream/55">
                {result.quote.lines.map((l, i) => (
                  <li key={i}>
                    {l.label} — {formatPence(l.pence)}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-cream/60">
              {attempted ? (
                <span className="text-terracotta-light">{result.error}</span>
              ) : (
                'Choose your options to see the price.'
              )}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-terracotta-deep px-8 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add to basket
        </button>

        {added && (
          <p className="mt-3 text-sm text-cream/80" role="status">
            Added.{' '}
            <a href="/shop/cart/" className="text-terracotta-light underline">
              Go to basket
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function SwatchButton({
  active,
  onClick,
  swatch,
  name,
}: {
  active: boolean;
  onClick: () => void;
  swatch: string;
  name: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm transition-colors ${
        active
          ? 'border-terracotta-light bg-terracotta-light font-semibold text-forest-dark'
          : 'border-cream/25 text-cream/85 hover:border-terracotta-light'
      }`}
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border border-cream/30"
        style={{ background: swatch }}
      />
      {name}
    </button>
  );
}
