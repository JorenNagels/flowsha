'use client';

// Internal style explorer — NOT a public page. Lets us click through 10 candidate
// homepage looks via a toolbar before committing to one. Excluded from the sitemap
// and not linked from the live nav; delete /styles once a direction is chosen.

import { useEffect, useState } from 'react';
import { variants } from './variants';

export default function StylesPage() {
  const [active, setActive] = useState(0);

  // Deep-link / remember choice via the URL hash (e.g. /styles#groovy).
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace('#', '');
      const i = variants.findIndex((v) => v.id === id);
      if (i >= 0) setActive(i);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const select = (i: number) => {
    setActive(i);
    window.location.hash = variants[i].id;
    window.scrollTo({ top: 0 });
  };

  const Active = variants[active].Component;

  return (
    <div className="styles-scope min-h-screen">
      {/* Keyframes used by a few variants (marquee, float, slow spin). Scoped here
          so they don't leak into the real site's globals. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fv-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
            @keyframes fv-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
            @keyframes fv-spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
            .fv-marquee { animation: fv-marquee 28s linear infinite; }
            .fv-float { animation: fv-float 7s ease-in-out infinite; }
            .fv-spin { animation: fv-spin 40s linear infinite; }
          `,
        }}
      />

      {/* Prototype toolbar — sits above whichever homepage is selected. */}
      <div className="sticky top-0 z-[100] border-b border-white/10 bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
              Flowsha · homepage styles
            </span>
            <span className="text-xs text-neutral-400">
              {active + 1}/{variants.length} · {variants[active].vibe}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => select(i)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  i === active
                    ? 'bg-white text-neutral-900'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {i + 1}. {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The selected homepage. */}
      <Active />
    </div>
  );
}
