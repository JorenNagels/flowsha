'use client';

import { useEffect, useState } from 'react';
import { findJoint, findTubing, formatPence, isBuyable, type ReadyMadeHoop } from '@flowsha/shared';
import { apiGet, errorMessage } from '@/lib/api';
import { SkeletonGroup, SkeletonProductGrid } from '@/components/Skeleton';
import { useCart } from '@/components/shop/CartProvider';

type Status = 'loading' | 'loaded' | 'error';

// Ready-made stock is fetched at runtime rather than baked into the export: these
// are one-off hoops that churn, and showing a sold hoop as available is worse
// than not having them indexed. Deliberately NO Product JSON-LD here — a crawler
// would never see these items, and emitting markup it can't verify risks a
// structured-data mismatch.
export default function ReadyMadeList() {
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<ReadyMadeHoop[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet<{ items: ReadyMadeHoop[] }>('/products');
        const list = Array.isArray(data.items) ? data.items : [];
        if (!cancelled) {
          setItems(list);
          setStatus('loaded');
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err, 'Could not load the ready-made hoops.'));
          setStatus('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <SkeletonGroup label="Loading ready-made hoops…">
        <SkeletonProductGrid count={3} />
      </SkeletonGroup>
    );
  }

  if (status === 'error') {
    return (
      <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">{error}</p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center">
        <p className="text-cream/80">No ready-made hoops right now — they tend to go quickly.</p>
        <p className="mt-2 text-cream/70">
          You can{' '}
          <a href="/shop/" className="text-terracotta-light underline">
            commission one instead
          </a>
          , made exactly how you want it.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((hoop) => (
        <HoopCard key={hoop.id} hoop={hoop} />
      ))}
    </div>
  );
}

function HoopCard({ hoop }: { hoop: ReadyMadeHoop }) {
  const { addReadyMade, hasReadyMade } = useCart();
  const now = new Date().toISOString();
  const available = isBuyable(hoop, now);
  const inCart = hasReadyMade(hoop.id);
  const primary = hoop.photos[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-cream/10 bg-forest/40">
      <div className="relative aspect-[4/3] bg-forest">
        {primary ? (
          // Uploaded photos are served from the /media/* CloudFront behaviour, so
          // they are outside next-image-export-optimizer's build-time pipeline.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primary.url}
            alt={primary.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-cream/40">No photo yet</div>
        )}
        {!available && (
          <span className="absolute right-3 top-3 rounded-full bg-forest-dark/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream">
            {hoop.status === 'sold' ? 'Sold' : 'Reserved'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-lg text-cream">{hoop.title}</h2>
        <p className="mt-1 text-sm text-cream/60">
          {hoop.sizeInches}″ · {findTubing(hoop.tubingId)?.label.split(' — ')[1] ?? hoop.tubingId} ·{' '}
          {findJoint(hoop.jointId)?.label}
        </p>
        {hoop.tapeSummary && <p className="mt-2 text-sm text-cream/75">{hoop.tapeSummary}</p>}
        {hoop.description && (
          <p className="mt-2 flex-1 text-sm text-cream/75">{hoop.description}</p>
        )}

        <p className="mt-4 font-display text-2xl text-terracotta">{formatPence(hoop.pricePence)}</p>

        <button
          type="button"
          disabled={!available || inCart}
          onClick={() => addReadyMade(hoop.id)}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-terracotta-deep px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!available ? 'No longer available' : inCart ? 'In your basket' : 'Add to basket'}
        </button>
      </div>
    </article>
  );
}
