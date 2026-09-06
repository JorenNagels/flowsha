// Shape-matched loading placeholders.
//
// The rule (see the shop plan §9): use a skeleton when we know the shape of what's
// coming — lists, cards, stat tiles, product grids — and a <Spinner>/<LoadingBlock>
// only when we don't, e.g. the Clerk SPA booting or a form submit button.
//
// Every skeleton must occupy the same box as the real content it stands in for, or
// it trades a spinner for a layout shift, which is worse.

// Base block. `motion-safe:` so a reduced-motion user gets a static placeholder
// instead of a pulsing page.
export function Skeleton({ className = '' }: { className?: string }) {
  return <span className={`block rounded-lg bg-cream/10 motion-safe:animate-pulse ${className}`} />;
}

// Wraps a set of skeletons. Screen readers must not read a wall of empty boxes, so
// the placeholders are hidden and a single live-region message is announced instead.
export function SkeletonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <span role="status" aria-live="polite" className="sr-only">
        {label}
      </span>
      <div aria-hidden="true">{children}</div>
    </>
  );
}

// Prose stand-in. Widths vary because equal-width bars read as a table, not a
// paragraph — the last line is always shortest.
export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/4', 'w-2/3'];
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${i === lines - 1 ? 'w-1/2' : widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

// Matches the dashboard submission card: `rounded-3xl border border-cream/10 bg-forest/40 p-5 sm:p-6`.
export function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-cream/10 bg-forest/40 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonCardList({ count = 5 }: { count?: number }) {
  return (
    <ul className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
}

// Matches the `grid grid-cols-2 sm:grid-cols-4` row of <Stat> tiles.
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl border border-cream/10 bg-forest/40 p-4">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

// Ready-made hoop card: fixed aspect ratio on the image so nothing jumps when the
// real photo loads.
export function SkeletonProductCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-cream/10 bg-forest/40">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}
