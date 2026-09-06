'use client';
/* eslint-disable @next/next/no-img-element */
// Trials 11–14: scroll-driven, in the Apple product-page register. Where 7–10 animate on
// load or on pointer, these are all *scrubbed* — the scroll position is the timeline, so
// you control the animation rather than watching it.
//
// The shared mechanic is a tall outer section with a `sticky` inner viewport. The outer
// height is the runway; the inner pane stays pinned while you scroll past it, and scroll
// progress through the runway drives the transforms. That is exactly how Apple's product
// pages work, and it needs no library.
//
// Performance rule followed throughout: progress is written to a **CSS custom property on
// a ref**, not into React state. Scroll fires far more often than paint, and calling
// setState per frame would re-render the whole tree ~60×/second. React state is used only
// for the coarse "which text beat" index, which changes a handful of times per scroll.

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

/**
 * Writes scroll progress through `runway` (0 → 1) onto `--p` on that element, and reports
 * a coarse beat index via `onBeat` for anything that genuinely needs React state.
 */
function useScrubbed(
  runway: React.RefObject<HTMLElement | null>,
  opts: { beats?: number; onBeat?: (i: number) => void; enabled?: boolean } = {},
) {
  const { beats = 0, onBeat, enabled = true } = opts;
  const lastBeat = useRef(-1);

  useEffect(() => {
    const el = runway.current;
    if (!el || !enabled) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      if (beats > 0 && onBeat) {
        const i = Math.min(beats - 1, Math.floor(p * beats));
        if (i !== lastBeat.current) {
          lastBeat.current = i;
          onBeat(i);
        }
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [runway, beats, onBeat, enabled]);
}

function Nav() {
  return (
    <header
      className="relative z-30 border-b border-cream/10"
      style={{ backgroundColor: FOREST_DARK }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5 sm:px-8">
        <span className="inline-flex items-center gap-3">
          <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-12 w-auto" />
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

function ScrollCue({ label = 'Scroll' }: { label?: string }) {
  return (
    <p className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.34em] text-cream/40">
      {label}
    </p>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────────
// 11 — Scroll-scrubbed logo reveal. The flagship Apple move.
// ───────────────────────────────────────────────────────────────────────────────────────
const BEATS = [
  {
    kicker: 'Classes',
    line: 'Anyone can hoop.',
    body: 'No experience, no coordination. Just turn up curious.',
  },
  {
    kicker: 'Performances',
    line: 'Fire. Light. Flow.',
    body: 'Hoop acts for festivals, parties and events.',
  },
  {
    kicker: 'Handmade hoops',
    line: 'Made by hand.',
    body: 'Sized, weighted and taped to suit how you move.',
  },
];

export function Trial11() {
  const reduced = useReducedMotion();
  const runway = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);
  useScrubbed(runway, { beats: 3, onBeat: setBeat, enabled: !reduced });

  return (
    <div style={{ backgroundColor: NEAR_BLACK }} className="min-h-screen">
      <Switcher current="11" />
      <Nav />

      {/* 320vh of runway = ~2.2 screens of scrolling to play the whole thing through. */}
      <div ref={runway} className="relative h-[320vh]" style={{ ['--p' as string]: 0 }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <img
            src={asset(heroImage)}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              // Slow Ken Burns push, plus the photo fading up as the logo shrinks away.
              transform: 'scale(calc(1.06 + var(--p) * 0.12))',
              opacity: 'calc(0.16 + var(--p) * 0.3)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to top, ${NEAR_BLACK}, ${NEAR_BLACK}bb 60%, ${NEAR_BLACK}77)`,
            }}
          />

          {/* The logo is the scrubbed "product": huge and centred at rest, shrinking and
              rising out of the way as you scroll. clamp() keeps it sane past the runway. */}
          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="relative z-10 w-auto"
            style={{
              height: '54vh',
              transform:
                'translateY(calc(var(--p) * -26vh)) scale(calc(1 - min(var(--p), 0.62) * 0.72))',
              transformOrigin: 'center',
            }}
          />

          {/* Text beats cross-fade in beneath it. */}
          <div className="absolute inset-x-0 bottom-[12vh] z-10 px-6 text-center">
            {BEATS.map((b, i) => (
              <div
                key={b.kicker}
                aria-hidden={beat !== i}
                className="mx-auto max-w-xl transition-all duration-500"
                style={{
                  opacity: beat === i ? 1 : 0,
                  transform: beat === i ? 'translateY(0)' : 'translateY(14px)',
                  gridArea: '1 / 1',
                  position: i === 0 ? 'relative' : 'absolute',
                  left: i === 0 ? undefined : 0,
                  right: i === 0 ? undefined : 0,
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
                  {b.kicker}
                </p>
                <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.98] text-cream">
                  {b.line}
                </h2>
                <p className="mt-3 text-cream/75">{b.body}</p>
              </div>
            ))}
          </div>
          <ScrollCue />
        </div>
      </div>

      <Closer />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────────
// 12 — Pinned horizontal scroll. Vertical scroll drives sideways movement.
// ───────────────────────────────────────────────────────────────────────────────────────
const H_PANELS = [
  { kicker: 'Classes', line: 'Anyone can hoop.', img: galleryImages[1] },
  { kicker: 'Performances', line: 'Fire. Light. Flow.', img: galleryImages[5] },
  { kicker: 'Handmade hoops', line: 'Made by hand.', img: galleryImages[2] },
];

export function Trial12() {
  const reduced = useReducedMotion();
  const runway = useRef<HTMLDivElement>(null);
  useScrubbed(runway, { enabled: !reduced });

  const count = H_PANELS.length + 1; // logo panel + three offerings

  return (
    <div style={{ backgroundColor: NEAR_BLACK }} className="min-h-screen">
      <Switcher current="12" />
      <Nav />

      <div
        ref={runway}
        className="relative"
        style={{ height: `${count * 100}vh`, ['--p' as string]: 0 }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="flex h-full"
            style={{
              width: `${count * 100}vw`,
              // Travel is (count - 1) panels wide, so the last one lands flush.
              transform: `translate3d(calc(var(--p) * -${(count - 1) * 100}vw), 0, 0)`,
            }}
          >
            {/* Opening panel — the logo, big. */}
            <section className="relative flex h-full w-screen shrink-0 flex-col items-center justify-center px-8 text-center">
              <img src={LOGO} alt="Flowsha" width={670} height={896} className="h-[38vh] w-auto" />
              <h1 className="mt-7 font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.92] text-cream">
                flow <span className="text-terracotta">•</span> play{' '}
                <span className="text-terracotta">•</span> connect
              </h1>
              <p className="mt-4 max-w-md text-lg text-cream/70">
                Hula hoop workshops, performances and handmade hoops in Southampton.
              </p>
              <ScrollCue label="Scroll →" />
            </section>

            {H_PANELS.map((p) => (
              <section
                key={p.kicker}
                className="relative flex h-full w-screen shrink-0 items-center px-8 sm:px-16"
              >
                <img
                  src={asset(p.img.src)}
                  alt={p.img.alt}
                  className="absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${NEAR_BLACK}f2, ${NEAR_BLACK}99 55%, ${NEAR_BLACK}33)`,
                  }}
                />
                <div className="relative z-10 max-w-lg">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
                    {p.kicker}
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(2.2rem,5.5vw,4rem)] leading-[0.95] text-cream">
                    {p.line}
                  </h2>
                  <span className="mt-7 inline-block rounded-full bg-terracotta-light px-7 py-3 text-sm font-semibold text-forest-dark">
                    Find out more
                  </span>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <Closer />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────────
// 13 — Hoop wipe. A hoop opens out from the centre and reveals the next scene through it.
// ───────────────────────────────────────────────────────────────────────────────────────
export function Trial13() {
  const reduced = useReducedMotion();
  const runway = useRef<HTMLDivElement>(null);
  useScrubbed(runway, { enabled: !reduced });

  return (
    <div style={{ backgroundColor: NEAR_BLACK }} className="min-h-screen">
      <Switcher current="13" />
      <Nav />

      <div ref={runway} className="relative h-[260vh]" style={{ ['--p' as string]: 0 }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Base layer: the photo scene, always there underneath. */}
          <img
            src={asset(heroImage)}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(to top, ${NEAR_BLACK}dd, ${NEAR_BLACK}66)` }}
          />
          <div className="absolute inset-0 flex items-end px-6 pb-[14vh] sm:px-12">
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
                {siteConfig.offerings}
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.6rem)] leading-[0.96] text-cream">
                Classes, shows and hoops made by hand.
              </h2>
            </div>
          </div>

          {/* Top layer: the brand scene, clipped to a circle that opens as you scroll.
              clip-path is GPU-composited, so this stays smooth where a width/height
              animation on a mask would not. */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              backgroundColor: FOREST_DARK,
              clipPath: 'circle(calc((1 - var(--p)) * 105%) at 50% 45%)',
            }}
          >
            <img src={LOGO} alt="Flowsha" width={670} height={896} className="h-[42vh] w-auto" />
            <h1 className="mt-7 px-6 text-center font-display text-[clamp(2.2rem,6vw,4.6rem)] leading-[0.92] text-cream">
              flow <span className="text-terracotta">•</span> play{' '}
              <span className="text-terracotta">•</span> connect
            </h1>
          </div>

          {/* The hoop itself, drawn exactly on the clip edge so the wipe reads as a hoop
              opening out rather than an abstract circular mask. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[45%] rounded-full border-[6px] border-terracotta"
            style={{
              width: 'calc((1 - var(--p)) * 210%)',
              aspectRatio: '1',
              transform: 'translate(-50%,-50%)',
              opacity: 'calc(1 - var(--p) * 0.35)',
            }}
          />
          <ScrollCue label="Scroll — the hoop opens" />
        </div>
      </div>

      <Closer />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────────
// 14 — Stacked sticky cards. Each section deals on top of the last.
// ───────────────────────────────────────────────────────────────────────────────────────
const STACK = [
  {
    kicker: 'Classes',
    line: 'Anyone can hoop.',
    body: 'Group workshops and private lessons for adults and young people. No experience needed.',
    img: galleryImages[1],
    bg: '#38543c',
  },
  {
    kicker: 'Performances',
    line: 'Fire. Light. Flow.',
    body: 'Hoop acts for festivals, parties and events — LED and fire, built to fit your night.',
    img: galleryImages[5],
    bg: '#2b402e',
  },
  {
    kicker: 'Handmade hoops',
    line: 'Made by hand. Made for you.',
    body: 'From your first beginner hoop to fast dance hoops, sized and taped to suit how you move.',
    img: galleryImages[2],
    bg: '#251a13',
  },
];

export function Trial14() {
  return (
    <div style={{ backgroundColor: NEAR_BLACK }} className="min-h-screen">
      <Switcher current="14" />
      <Nav />

      {/* Opening scene. */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden px-6 text-center">
        <img
          src={asset(heroImage)}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(to bottom, ${NEAR_BLACK}cc, ${NEAR_BLACK})` }}
        />
        <div className="relative z-10">
          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="mx-auto h-[36vh] w-auto"
          />
          <h1 className="mt-7 font-display text-[clamp(2.4rem,7vw,5.2rem)] leading-[0.92] text-cream">
            flow <span className="text-terracotta">•</span> play{' '}
            <span className="text-terracotta">•</span> connect
          </h1>
        </div>
        <ScrollCue />
      </section>

      {/* Each card is sticky at the top with a rising z-index, so they slide over one
          another and stack. No JS at all — position:sticky does the whole thing. */}
      {STACK.map((s, i) => (
        <section
          key={s.kicker}
          className="sticky top-0 h-screen overflow-hidden rounded-t-[2.5rem] shadow-[0_-24px_60px_rgba(0,0,0,.5)]"
          style={{ backgroundColor: s.bg, zIndex: 10 + i }}
        >
          <img
            src={asset(s.img.src)}
            alt={s.img.alt}
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, ${s.bg}f2, ${s.bg}aa 55%, ${s.bg}33)`,
            }}
          />
          <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-8">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta-light">
                {s.kicker}
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,6vw,4.2rem)] leading-[0.95] text-cream">
                {s.line}
              </h2>
              <p className="mt-5 max-w-md text-lg text-cream/80">{s.body}</p>
              <span className="mt-8 inline-block rounded-full bg-terracotta-light px-7 py-3 text-sm font-semibold text-forest-dark">
                Find out more
              </span>
            </div>
          </div>
        </section>
      ))}

      <div className="relative z-20">
        <Closer />
      </div>
    </div>
  );
}

/** Shared closing block, so each scroll trial ends on a page rather than mid-stunt. */
function Closer() {
  return (
    <section className="px-6 py-20 sm:px-8" style={{ backgroundColor: FOREST_DARK }}>
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6">
        <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-20 w-auto" />
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-cream">
          Come and play in Southampton.
        </h2>
        <span className="inline-block rounded-full bg-terracotta-light px-7 py-3 text-sm font-semibold text-forest-dark">
          Book a workshop
        </span>
      </div>
    </section>
  );
}
