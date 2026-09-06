'use client';
/* eslint-disable @next/next/no-img-element */
// Trials 7–10: the ambitious ones. Where 1–6 only change the colour behind the logo, these
// rethink the entrance and the homepage itself — the Apple-product-page register.
//
// Deliberately no 3D library. three.js is ~600 kB gzip, which on a static SEO-first site
// that currently ships ~130 kB of HTML per page would be the single biggest thing we serve.
// Everything here is CSS transforms with `perspective`, driven by at most one scroll or
// pointer listener writing one custom property. That is genuinely 3D — real perspective
// projection — at a few hundred bytes.
//
// Each concept honours `prefers-reduced-motion`: the motion is the garnish, the static
// composition underneath has to stand on its own.

import { useEffect, useRef, useState } from 'react';
import { heroImage, galleryImages, navLinks } from '@/lib/data';
import { siteConfig } from '@/lib/site';
import { Switcher } from './registry';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (src: string) => `${basePath}${src}`;
const LOGO = asset('/brand/flowsha-logo.svg');

const FOREST_DARK = '#2b402e';
const NEAR_BLACK = '#0b110c';

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Shared nav, so the cinematic trials still read as the same site. */
function Nav({
  logoOpacity = 1,
  markClass = 'h-12 w-auto',
}: {
  logoOpacity?: number;
  markClass?: string;
}) {
  return (
    <header
      className="relative z-30 border-b border-cream/10"
      style={{ backgroundColor: FOREST_DARK }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5 sm:px-8">
        <span
          className="inline-flex items-center gap-3"
          style={{ opacity: logoOpacity, transition: 'opacity .5s ease' }}
        >
          <img src={LOGO} alt="" aria-hidden width={670} height={896} className={markClass} />
          <span className="font-display text-xl tracking-wide text-cream">{siteConfig.name}</span>
        </span>
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <span key={l.href} className="text-sm font-semibold text-cream/80">
              {l.label}
            </span>
          ))}
          <span className="rounded-full bg-terracotta-light px-5 py-2 text-sm font-semibold text-forest-dark">
            Book a workshop
          </span>
        </nav>
      </div>
    </header>
  );
}

function Replay({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 rounded-full bg-terracotta-deep px-4 py-2 text-sm font-semibold text-cream shadow-lg"
    >
      ↻ Replay
    </button>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────────
// 7 — Logo flight intro
// ───────────────────────────────────────────────────────────────────────────────────────
export function Trial7() {
  const reduced = useReducedMotion();
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }
    setDone(false);
    const t = setTimeout(() => setDone(true), 2100);
    return () => clearTimeout(t);
  }, [run, reduced]);

  return (
    <div style={{ backgroundColor: FOREST_DARK }} className="min-h-screen">
      <Switcher current="7" />
      <Replay onClick={() => setRun((n) => n + 1)} />

      <style>{`
        @keyframes flowsha-flight {
          0%   { transform: translate(-50%,-50%) scale(.92); opacity: 0 }
          14%  { transform: translate(-50%,-50%) scale(1);   opacity: 1 }
          52%  { transform: translate(-50%,-50%) scale(1);   opacity: 1 }
          100% { transform: translate(-50%,-50%) translate(-38vw,-38vh) scale(.13); opacity: 1 }
        }
        @keyframes flowsha-curtain {
          0%,52% { opacity: 1 }
          100%   { opacity: 0 }
        }
        .flight-curtain { animation: flowsha-curtain 2.1s cubic-bezier(.65,0,.35,1) forwards }
        .flight-logo    { animation: flowsha-flight  2.1s cubic-bezier(.65,0,.35,1) forwards }
      `}</style>

      {/* The curtain is aria-hidden and pointer-events-none once gone — it must never trap
          focus or block the page for keyboard/screen-reader users. */}
      {!done && !reduced && (
        <div
          key={run}
          aria-hidden
          className="flight-curtain pointer-events-none fixed inset-0 z-40"
          style={{ backgroundColor: NEAR_BLACK }}
        >
          <img
            src={LOGO}
            alt=""
            width={670}
            height={896}
            className="flight-logo absolute left-1/2 top-1/2 h-[42vh] w-auto"
          />
        </div>
      )}

      <Nav logoOpacity={done || reduced ? 1 : 0} />

      <section className="relative isolate flex min-h-[76vh] items-center overflow-hidden px-6 sm:px-8">
        <img
          src={asset(heroImage)}
          alt="Osha of Flowsha spinning hoops"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to top, ${FOREST_DARK}, ${FOREST_DARK}99 55%, ${FOREST_DARK}4d)`,
          }}
        />
        <div
          className="relative z-10 mx-auto w-full max-w-6xl py-20"
          style={{ opacity: done || reduced ? 1 : 0, transition: 'opacity .7s ease .1s' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
            {siteConfig.offerings}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] text-cream">
            flow <span className="text-terracotta">•</span> play{' '}
            <span className="text-terracotta">•</span> connect
          </h1>
          <p className="mt-6 max-w-lg text-lg text-cream/80">
            Hula hoop workshops, performances, and handmade hoops in Southampton.
          </p>
          <span className="mt-9 inline-block rounded-full bg-terracotta-light px-7 py-3 text-sm font-semibold text-forest-dark">
            Book a workshop
          </span>
        </div>
      </section>
      <Cards />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────────
// 8 — Scroll-spun 3D hoops
// ───────────────────────────────────────────────────────────────────────────────────────
export function Trial8() {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      // rAF-throttled: scroll fires far faster than paint, and writing a CSS var on every
      // event is the classic way to make a page feel worse, not better.
      frame = requestAnimationFrame(() => {
        frame = 0;
        stage.current?.style.setProperty('--spin', `${window.scrollY * 0.55}deg`);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  // The centring translate has to live INSIDE this transform. Tailwind's
  // `-translate-x-1/2` is itself a transform utility, so an inline `transform` replaces it
  // outright and the rings drift off down-right — which is exactly what happened first try.
  const ring = (tilt: number, size: number, offset: number): React.CSSProperties => ({
    transform: `translate(-50%,-50%) rotateX(${tilt}deg) rotateZ(calc(var(--spin, 0deg) + ${offset}deg))`,
    width: `${size}%`,
    height: `${size}%`,
  });

  return (
    <div style={{ backgroundColor: FOREST_DARK }} className="min-h-screen">
      <Switcher current="8" />
      <Nav />

      <section className="relative isolate overflow-hidden px-6 py-20 sm:px-8">
        <img
          src={asset(heroImage)}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(to top, ${FOREST_DARK}, ${FOREST_DARK}cc)` }}
        />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
              {siteConfig.offerings}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.92] text-cream">
              flow <span className="text-terracotta">•</span> play{' '}
              <span className="text-terracotta">•</span> connect
            </h1>
            <p className="mt-6 max-w-md text-lg text-cream/80">
              Hula hoop workshops, performances, and handmade hoops in Southampton.
            </p>
            <span className="mt-8 inline-block rounded-full bg-terracotta-light px-7 py-3 text-sm font-semibold text-forest-dark">
              Book a workshop
            </span>
            <p className="mt-6 text-sm text-cream/50">↓ scroll — the hoops spin with you</p>
          </div>

          {/* The 3D stage. `perspective` on the parent is what makes the rings read as
              orbiting rather than just squashing. */}
          <div
            ref={stage}
            className="relative mx-auto aspect-square w-full max-w-[420px]"
            style={{ perspective: '900px' }}
          >
            <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              {/* Rings sit at the figure's waist rather than the box centre, so they read
                  as hoops being spun instead of orbits around a planet. */}
              {[
                [76, 66, 0],
                [70, 54, 55],
                [82, 76, 115],
              ].map(([tilt, size, offset], i) => (
                <span
                  key={i}
                  aria-hidden
                  className="absolute left-1/2 top-[57%] rounded-full border-[3px] border-terracotta/70"
                  style={ring(tilt, size, offset)}
                />
              ))}
            </div>
            <img
              src={LOGO}
              alt=""
              aria-hidden
              width={670}
              height={896}
              className="absolute bottom-0 left-1/2 h-[86%] w-auto -translate-x-1/2"
            />
          </div>
        </div>
      </section>
      <Cards />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────────
// 9 — Cinematic panels (full homepage rethink)
// ───────────────────────────────────────────────────────────────────────────────────────
const PANELS: { kicker: string; line: string; body: string; img: string }[] = [
  {
    kicker: 'Classes',
    line: 'Anyone can hoop.',
    body: 'Group workshops and private lessons for adults and young people. No experience, no coordination needed — just turn up curious.',
    img: galleryImages[1].src,
  },
  {
    kicker: 'Performances',
    line: 'Fire. Light. Flow.',
    body: 'Hoop acts for festivals, parties and events. LED and fire, built to fit your night.',
    img: galleryImages[5].src,
  },
  {
    kicker: 'Handmade hoops',
    line: 'Made by hand. Made for you.',
    body: 'From your first beginner hoop to fast dance hoops — sized, weighted and taped to suit how you move.',
    img: galleryImages[2].src,
  },
];

export function Trial9() {
  return (
    <div style={{ backgroundColor: NEAR_BLACK }} className="min-h-screen">
      <Switcher current="9" />
      <Nav />

      {/* Scroll-snap gives the Apple "one statement per screen" cadence. `snap-proximity`
          rather than `mandatory` so a trackpad flick can still scroll normally. */}
      <div className="h-[calc(100vh-4rem)] snap-y snap-proximity overflow-y-auto">
        {/* Opening panel — logo at a size where contrast is simply not a question. */}
        <section className="relative flex h-full snap-start flex-col items-center justify-center overflow-hidden px-6 text-center">
          <img
            src={asset(heroImage)}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${NEAR_BLACK}dd, ${NEAR_BLACK}88 45%, ${NEAR_BLACK})`,
            }}
          />
          <div className="relative z-10">
            <img
              src={LOGO}
              alt="Flowsha"
              width={670}
              height={896}
              className="mx-auto h-[34vh] w-auto"
            />
            <h1 className="mt-8 font-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.9] text-cream">
              flow <span className="text-terracotta">•</span> play{' '}
              <span className="text-terracotta">•</span> connect
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-cream/75">
              Hula hoop workshops, performances and handmade hoops in Southampton.
            </p>
            <p className="mt-14 text-xs uppercase tracking-[0.3em] text-cream/40">Scroll</p>
          </div>
        </section>

        {PANELS.map((p, i) => (
          <section
            key={p.kicker}
            className="relative flex h-full snap-start items-center overflow-hidden px-6 sm:px-10"
          >
            <img
              src={asset(p.img)}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  i % 2 === 0
                    ? `linear-gradient(to right, ${NEAR_BLACK}f2 0%, ${NEAR_BLACK}b3 45%, ${NEAR_BLACK}33 100%)`
                    : `linear-gradient(to left, ${NEAR_BLACK}f2 0%, ${NEAR_BLACK}b3 45%, ${NEAR_BLACK}33 100%)`,
              }}
            />
            <div
              className={`relative z-10 mx-auto w-full max-w-6xl ${i % 2 === 0 ? '' : 'text-right'}`}
            >
              <div className={`max-w-xl ${i % 2 === 0 ? '' : 'ml-auto'}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
                  {p.kicker}
                </p>
                <h2 className="mt-4 font-display text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.95] text-cream">
                  {p.line}
                </h2>
                <p className="mt-5 text-lg text-cream/80">{p.body}</p>
                <span className="mt-8 inline-block rounded-full bg-terracotta-light px-7 py-3 text-sm font-semibold text-forest-dark">
                  Find out more
                </span>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────────
// 10 — Pointer-tilt depth
// ───────────────────────────────────────────────────────────────────────────────────────
export function Trial10() {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = stage.current;
    if (!el) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // touch gets the static composition
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${x * 26}deg`);
        el.style.setProperty('--rx', `${-y * 20}deg`);
        el.style.setProperty('--px', `${-x * 26}px`);
        el.style.setProperty('--py', `${-y * 26}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div style={{ backgroundColor: NEAR_BLACK }} className="min-h-screen">
      <Switcher current="10" />
      <Nav />

      <section
        ref={stage}
        className="relative isolate flex min-h-[80vh] items-center overflow-hidden px-6 sm:px-8"
        style={{ perspective: '1100px' }}
      >
        {/* Background drifts opposite the cursor — the parallax that sells the depth. */}
        <img
          src={asset(heroImage)}
          alt=""
          aria-hidden
          className="absolute inset-[-4%] h-[108%] w-[108%] object-cover opacity-35"
          style={{
            transform: 'translate3d(var(--px,0),var(--py,0),0)',
            transition: 'transform .25s ease-out',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to top, ${NEAR_BLACK}, ${NEAR_BLACK}aa 55%, ${NEAR_BLACK}55)`,
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 py-16 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
              {siteConfig.offerings}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.92] text-cream">
              flow <span className="text-terracotta">•</span> play{' '}
              <span className="text-terracotta">•</span> connect
            </h1>
            <p className="mt-6 max-w-md text-lg text-cream/80">
              Hula hoop workshops, performances, and handmade hoops in Southampton.
            </p>
            <span className="mt-8 inline-block rounded-full bg-terracotta-light px-7 py-3 text-sm font-semibold text-forest-dark">
              Book a workshop
            </span>
            <p className="mt-6 text-sm text-cream/50">Move your cursor — the mark tilts with it</p>
          </div>

          <div
            className="mx-auto w-full max-w-[400px]"
            style={{
              transform: 'rotateX(var(--rx,0)) rotateY(var(--ry,0))',
              transformStyle: 'preserve-3d',
              transition: 'transform .2s ease-out',
            }}
          >
            <img
              src={LOGO}
              alt=""
              aria-hidden
              width={670}
              height={896}
              className="mx-auto h-[52vh] w-auto"
              style={{
                transform: 'translateZ(70px)',
                filter: 'drop-shadow(0 34px 46px rgba(0,0,0,.62))',
              }}
            />
          </div>
        </div>
      </section>
      <Cards />
    </div>
  );
}

// Shared offerings strip, so the cinematic trials still show a page rather than a stunt.
function Cards() {
  return (
    <section className="px-6 py-16 sm:px-8" style={{ backgroundColor: FOREST_DARK }}>
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {[
          [
            'Classes',
            'Group workshops and private lessons for adults and young people. No experience needed.',
          ],
          ['Performances', 'Hoop acts for festivals, parties, and events — fire and LED.'],
          [
            'Handmade Hoops',
            'Hoops made by hand for every level, from your first beginner hoop to fast dance hoops.',
          ],
        ].map(([title, blurb], i) => (
          <div
            key={title}
            className="flex flex-col rounded-3xl p-7"
            style={{ backgroundColor: '#38543c', border: '1px solid rgba(247,241,227,.10)' }}
          >
            <img
              src={asset(galleryImages[i + 1].src)}
              alt={galleryImages[i + 1].alt}
              className="mb-5 h-40 w-full rounded-2xl object-cover"
            />
            <h3 className="font-display text-xl text-cream">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/80">{blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
