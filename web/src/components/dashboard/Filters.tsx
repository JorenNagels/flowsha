'use client';

import { useEffect, useRef } from 'react';
import { Spinner } from '@/components/Spinner';

// Shared search + filter UI for the dashboard list pages. All filtering is
// client-side over the records already loaded (see each *Dashboard component).

export type FilterOption = { value: string; label: string };

// Rounded panel that groups the search box + filter rows + footer.
export function FilterPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-cream/10 bg-forest/30 p-4 sm:p-5">
      {children}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a1 1 0 01-1.42 1.42l-3.08-3.08A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-cream/15 bg-forest/40 py-2.5 pl-10 pr-10 text-cream placeholder-cream/40 outline-none transition focus:border-terracotta-light focus:ring-2 focus:ring-terracotta-light/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-1 text-lg leading-none text-cream/50 transition-colors hover:text-cream"
        >
          ×
        </button>
      )}
    </div>
  );
}

// A labelled segmented control; an implicit "All" is prepended. `value` is ''
// when "All" is selected.
export function SegmentedFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
}) {
  const all = [{ value: '', label: 'All' }, ...options];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-cream/50">{label}</span>
      <div className="flex flex-wrap gap-1">
        {all.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              value === o.value
                ? 'bg-terracotta-light/20 font-semibold text-cream'
                : 'text-cream/60 hover:bg-cream/5 hover:text-cream'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FilterFooter({
  matched,
  total,
  noun,
  active,
  onClear,
}: {
  matched: number;
  total: number;
  noun: string;
  active: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm text-cream/60">
      <span>
        {active ? (
          <>
            {matched} of {total} {total === 1 ? noun : `${noun}s`} match
          </>
        ) : (
          <>
            {total} {total === 1 ? noun : `${noun}s`}
          </>
        )}
      </span>
      {active && (
        <button
          type="button"
          onClick={onClear}
          className="font-semibold text-terracotta-light transition-colors hover:text-terracotta-light/80"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

// Infinite scroll: an invisible sentinel just below the list reveals the next
// chunk of cards as it nears the viewport, so the DOM grows gradually instead
// of rendering a huge list at once. `visible`/`total` count the (filtered) set.
export function InfiniteScroll({
  visible,
  total,
  noun,
  onMore,
}: {
  visible: number;
  total: number;
  noun: string;
  onMore: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const done = visible >= total;

  useEffect(() => {
    if (done) return;
    const el = ref.current;
    if (!el) return;
    // rootMargin preloads the next chunk before the sentinel is fully in view.
    // Re-running on `visible` re-observes after each load so it keeps filling
    // until the sentinel is pushed out of range (or everything is shown).
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onMore();
      },
      { rootMargin: '400px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [done, visible, onMore]);

  return (
    <div className="mt-6 flex flex-col items-center gap-2 text-xs text-cream/50">
      {!done && <div ref={ref} aria-hidden="true" className="h-px w-full" />}
      {!done && <Spinner className="h-5 w-5 border-2" />}
      <span>
        Showing {Math.min(visible, total)} of {total} {total === 1 ? noun : `${noun}s`}
      </span>
    </div>
  );
}
