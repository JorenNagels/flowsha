/* eslint-disable @next/next/no-img-element */
// Trials 31–40: ten art directions. Not chrome fixes, not palette swaps — ten different
// answers to "what should a hooping artist's website feel like", each built around the logo
// rather than accommodating it.
//
// The brief that produced these: Flowsha is a performer and a maker, not a gym. The current
// site is a competent marketing template; none of these are. Each one commits to a single
// idea hard enough that it could only be this business.
//
// Everything is CSS — no libraries, no canvas, no WebGL. Marquees and glows are keyframes
// and gradients. All ten are server components; nothing here needs a hook.
//
// Practical note for whichever wins: these are art directions, not finished pages. They
// each show nav + hero + one content block. The rest of the site (forms, dashboard, shop,
// legal) would need bringing into whichever language is chosen, and a few of these — the
// orbit and the collage especially — will need real work to survive small screens.

import { galleryImages } from '@/lib/data';
import { siteConfig } from '@/lib/site';
import { Switcher } from './registry';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (src: string) => `${basePath}${src}`;
const LOGO = asset('/brand/flowsha-logo.svg');
const g = (i: number) => asset(galleryImages[i].src);

const GREEN = '#4c7252';
const ORANGE = '#d3793b';
const CREAM = '#f7f1e3';
const BONE = '#f2ece0';
const INK = '#1c1a17';

const OFFERINGS = [
  ['Classes', 'Workshops and private lessons. No experience needed.'],
  ['Performances', 'Fire and LED hoop acts for festivals and events.'],
  ['Hoops', 'Made by hand, sized and taped to how you move.'],
] as const;

function Frame({ id, bg, children }: { id: string; bg: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <Switcher current={id} />
      {children}
    </div>
  );
}

// ═══ 31 — Gig poster ═══════════════════════════════════════════════════════════════════
// Screen-printed festival flyer. The logo is printed twice, offset, like a registration
// slip on a two-colour press — the mistake that print nerds love.
export function Art31() {
  return (
    <Frame id="31" bg={BONE}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div
          className="flex items-baseline justify-between border-b-2 border-current pb-3"
          style={{ color: INK }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
            Southampton · Hampshire
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]">Est. Flowsha</span>
        </div>

        <div className="relative mt-10 flex justify-center">
          {/* Offset "misprint" copy underneath, then the real logo on top. */}
          <img
            src={LOGO}
            alt=""
            aria-hidden
            width={670}
            height={896}
            className="absolute h-[46vh] w-auto translate-x-3 translate-y-2 opacity-45"
            style={{ filter: 'saturate(0) brightness(1.6)' }}
          />
          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="relative h-[46vh] w-auto"
          />
        </div>

        <h1
          className="mt-8 text-center font-display uppercase leading-[0.82]"
          style={{ color: INK }}
        >
          <span className="block text-[clamp(2.6rem,11vw,7.5rem)]">Flow</span>
          <span className="block text-[clamp(2.6rem,11vw,7.5rem)]" style={{ color: ORANGE }}>
            Play
          </span>
          <span className="block text-[clamp(2.6rem,11vw,7.5rem)]">Connect</span>
        </h1>

        <ul className="mt-12 divide-y-2 divide-current" style={{ color: INK }}>
          {OFFERINGS.map(([t, b]) => (
            <li key={t} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
              <span className="font-display text-2xl uppercase tracking-tight">{t}</span>
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] opacity-70">
                {b}
              </span>
              <span
                className="ml-auto font-mono text-[12px] uppercase tracking-[0.2em]"
                style={{ color: ORANGE }}
              >
                Book →
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

// ═══ 32 — Zine collage ═════════════════════════════════════════════════════════════════
// Cut-and-paste flow-arts zine: torn photos, tape, things slightly askew.
export function Art32() {
  const Tape = ({ className }: { className: string }) => (
    <span
      aria-hidden
      className={`absolute h-6 w-24 ${className}`}
      style={{ backgroundColor: 'rgba(215,205,180,.75)', boxShadow: '0 1px 2px rgba(0,0,0,.15)' }}
    />
  );
  return (
    <Frame id="32" bg="#e8e0cd">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl italic" style={{ color: GREEN }}>
            {siteConfig.name}
          </span>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: INK }}
          >
            issue no. 01
          </span>
        </div>

        <div className="relative mt-10 grid gap-8 md:grid-cols-[1.1fr_.9fr]">
          <div className="relative">
            <div className="relative -rotate-2 bg-white p-4 shadow-xl">
              <Tape className="-left-6 -top-3 -rotate-12" />
              <img
                src={LOGO}
                alt="Flowsha"
                width={670}
                height={896}
                className="mx-auto h-[40vh] w-auto"
              />
              <p className="mt-3 text-center font-display italic" style={{ color: INK }}>
                find your flow
              </p>
            </div>
            <p
              className="mt-8 max-w-sm rotate-[0.6deg] font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-tight"
              style={{ color: INK }}
            >
              Hoop classes, shows &amp; handmade hoops — made in Southampton.
            </p>
          </div>

          <div className="relative space-y-6">
            {[1, 5, 2].map((n, i) => (
              <div
                key={n}
                className={`relative bg-white p-3 shadow-lg ${['rotate-3', '-rotate-2', 'rotate-1'][i]}`}
              >
                <Tape className={`${i % 2 ? '-right-5' : '-left-5'} -top-3 rotate-6`} />
                <img src={g(n)} alt={galleryImages[n].alt} className="h-40 w-full object-cover" />
                <p
                  className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: INK }}
                >
                  {OFFERINGS[i][0]} — {OFFERINGS[i][1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ═══ 33 — Kinetic ribbons ══════════════════════════════════════════════════════════════
// The page is built from moving bands of type. Nothing on a hooping site should sit still.
export function Art33() {
  const words = 'flow · play · connect · ';
  return (
    <Frame id="33" bg={INK}>
      <style>{`
        @keyframes rib-l { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes rib-r { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        .rib { display:flex; width:200%; white-space:nowrap; will-change:transform }
        .rib-a { animation: rib-l 26s linear infinite }
        .rib-b { animation: rib-r 34s linear infinite }
        .rib-c { animation: rib-l 44s linear infinite }
        @media (prefers-reduced-motion: reduce) { .rib-a,.rib-b,.rib-c { animation: none } }
      `}</style>

      <div className="relative overflow-hidden py-14">
        {[
          ['rib-a', ORANGE, 'text-[clamp(3rem,9vw,7rem)]', 0.9],
          ['rib-b', GREEN, 'text-[clamp(2rem,6vw,4.5rem)]', 0.75],
          ['rib-c', CREAM, 'text-[clamp(1.4rem,4vw,3rem)]', 0.35],
        ].map(([cls, colour, size, op], i) => (
          <div
            key={i}
            className={`rib ${cls} font-display uppercase ${size}`}
            style={{ color: colour as string, opacity: op as number }}
          >
            <span>{words.repeat(6)}</span>
            <span>{words.repeat(6)}</span>
          </div>
        ))}

        {/* The logo sits still in the middle of all that motion — the hooper in the hoop. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="h-[52vh] w-auto drop-shadow-[0_18px_40px_rgba(0,0,0,.75)]"
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.34em]" style={{ color: ORANGE }}>
          {siteConfig.offerings}
        </p>
        <p className="mx-auto mt-5 max-w-lg text-lg" style={{ color: 'rgba(247,241,227,.8)' }}>
          Hula hoop workshops, performances and handmade hoops in Southampton.
        </p>
        <span
          className="mt-8 inline-block rounded-full px-8 py-3 text-sm font-semibold"
          style={{ backgroundColor: ORANGE, color: INK }}
        >
          Book a workshop
        </span>
      </div>
    </Frame>
  );
}

// ═══ 34 — Light trails ═════════════════════════════════════════════════════════════════
// The look of LED hooping photography: long exposure, glowing arcs in the dark.
export function Art34() {
  const arc = (size: number, tilt: number, colour: string, blur: number, op: number) => ({
    width: `${size}%`,
    aspectRatio: '1',
    transform: `translate(-50%,-50%) rotateX(${tilt}deg)`,
    borderColor: colour,
    filter: `blur(${blur}px)`,
    opacity: op,
  });
  return (
    <Frame id="34" bg="#07070a">
      <div
        className="relative flex min-h-[92vh] items-center justify-center overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(211,121,59,.28) 0%, rgba(211,121,59,0) 62%)',
          }}
        />
        {[
          [96, 72, '#ff8a3d', 2, 0.95],
          [80, 62, '#48d9c0', 3, 0.6],
          [112, 80, '#c774ff', 5, 0.45],
          [64, 55, '#ffd166', 2, 0.5],
        ].map(([s, t, c, b, o], i) => (
          <span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 rounded-full border-2"
            style={arc(s as number, t as number, c as string, b as number, o as number)}
          />
        ))}

        <img
          src={LOGO}
          alt="Flowsha"
          width={670}
          height={896}
          className="relative z-10 h-[54vh] w-auto"
          style={{ filter: 'drop-shadow(0 0 26px rgba(211,121,59,.55))' }}
        />

        <div className="absolute inset-x-0 bottom-[8vh] z-10 px-6 text-center">
          <h1
            className="font-display text-[clamp(2.2rem,7vw,5rem)] leading-[0.95]"
            style={{ color: CREAM }}
          >
            After dark, we glow.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg" style={{ color: 'rgba(247,241,227,.7)' }}>
            Fire and LED hoop performance for festivals, parties and events.
          </p>
        </div>
      </div>
    </Frame>
  );
}

// ═══ 35 — Gallery ══════════════════════════════════════════════════════════════════════
// The logo hung as an artwork, with a caption plate. Quiet, museum-grade restraint.
export function Art35() {
  return (
    <Frame id="35" bg="#faf7f0">
      <div className="mx-auto max-w-5xl px-8 py-8">
        <div className="flex items-center justify-between border-b border-black/15 pb-4">
          <span className="font-display text-lg uppercase tracking-[0.2em]" style={{ color: INK }}>
            Flowsha
          </span>
          <nav
            className="flex gap-7 font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: 'rgba(28,26,23,.6)' }}
          >
            <span>Classes</span>
            <span>Performance</span>
            <span>Hoops</span>
            <span>Contact</span>
          </nav>
        </div>

        <figure className="mx-auto mt-20 max-w-xl">
          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="mx-auto h-[46vh] w-auto"
          />
          <figcaption
            className="mt-12 border-t border-black/20 pt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em]"
            style={{ color: 'rgba(28,26,23,.65)' }}
          >
            <span className="block" style={{ color: INK }}>
              Flowsha — Osha
            </span>
            <span className="block">Hoop, tape, motion. Southampton, Hampshire.</span>
            <span className="block">Classes · Performance · Handmade hoops</span>
          </figcaption>
        </figure>

        <ol className="mx-auto mt-24 max-w-xl space-y-0 border-t border-black/15">
          {OFFERINGS.map(([t, b], i) => (
            <li key={t} className="flex gap-6 border-b border-black/15 py-6">
              <span className="font-mono text-[11px] tabular-nums" style={{ color: ORANGE }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1">
                <span className="block font-display text-xl" style={{ color: INK }}>
                  {t}
                </span>
                <span className="mt-1 block text-sm" style={{ color: 'rgba(28,26,23,.7)' }}>
                  {b}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

// ═══ 36 — Orbit ════════════════════════════════════════════════════════════════════════
// Hoop geometry as the layout system: everything sits on rings around the logo.
export function Art36() {
  const nav = ['Classes', 'Performance', 'Hoops', 'About', 'Contact'];
  return (
    <Frame id="36" bg="#12151b">
      <div className="relative mx-auto flex min-h-[94vh] max-w-5xl items-center justify-center px-6">
        <div className="relative aspect-square w-full max-w-[560px]">
          {[100, 82, 64].map((s, i) => (
            <span
              key={s}
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                width: `${s}%`,
                height: `${s}%`,
                borderColor: i === 0 ? ORANGE : 'rgba(247,241,227,.16)',
                borderWidth: i === 0 ? 2 : 1,
              }}
            />
          ))}

          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="absolute left-1/2 top-1/2 h-[72%] w-auto -translate-x-1/2 -translate-y-1/2"
          />

          {/* Nav items placed on the outer ring by angle. */}
          {nav.map((label, i) => {
            const a = (-90 + (360 / nav.length) * i) * (Math.PI / 180);
            return (
              <span
                key={label}
                className="absolute whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{
                  left: `${50 + 50 * Math.cos(a)}%`,
                  top: `${50 + 50 * Math.sin(a)}%`,
                  transform: 'translate(-50%,-50%)',
                  color: CREAM,
                  backgroundColor: '#12151b',
                  padding: '4px 10px',
                }}
              >
                {label}
              </span>
            );
          })}
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
          <p className="font-display text-[clamp(1.4rem,3.4vw,2.2rem)]" style={{ color: CREAM }}>
            Everything comes back around.
          </p>
          <p
            className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: ORANGE }}
          >
            Southampton · Hampshire
          </p>
        </div>
      </div>
    </Frame>
  );
}

// ═══ 37 — Sketchbook ═══════════════════════════════════════════════════════════════════
// Osha's notebook: imperfect circles, dashed boxes, things annotated by hand.
export function Art37() {
  return (
    <Frame id="37" bg="#f6f2e6">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-end justify-between">
          <span className="font-display text-3xl italic" style={{ color: GREEN }}>
            Flowsha
          </span>
          <span className="font-display text-lg italic" style={{ color: 'rgba(28,26,23,.55)' }}>
            notes on hooping ↘
          </span>
        </div>

        <div className="relative mt-12 flex justify-center">
          {/* Hand-drawn ring: an SVG ellipse with a wobbly dash pattern. */}
          <svg viewBox="0 0 400 400" aria-hidden className="absolute h-[52vh] w-auto -rotate-6">
            <ellipse
              cx="200"
              cy="200"
              rx="185"
              ry="170"
              fill="none"
              stroke={ORANGE}
              strokeWidth="3"
              strokeDasharray="14 9 26 7"
              strokeLinecap="round"
              opacity=".8"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="172"
              ry="182"
              fill="none"
              stroke={GREEN}
              strokeWidth="2"
              strokeDasharray="30 12"
              strokeLinecap="round"
              opacity=".35"
            />
          </svg>
          <img
            src={LOGO}
            alt="Flowsha"
            width={670}
            height={896}
            className="relative h-[42vh] w-auto"
          />
        </div>

        <p
          className="mx-auto mt-10 max-w-lg text-center font-display text-[clamp(1.5rem,3.6vw,2.3rem)] italic leading-snug"
          style={{ color: INK }}
        >
          “No experience, no coordination. Just turn up curious.”
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {OFFERINGS.map(([t, b], i) => (
            <div
              key={t}
              className={`border-2 border-dashed p-5 ${['-rotate-1', 'rotate-1', '-rotate-[0.5deg]'][i]}`}
              style={{ borderColor: 'rgba(28,26,23,.35)' }}
            >
              <span className="font-display text-xl" style={{ color: GREEN }}>
                {t}
              </span>
              <p className="mt-1.5 text-sm" style={{ color: 'rgba(28,26,23,.75)' }}>
                {b}
              </p>
              <span className="mt-3 inline-block font-display italic" style={{ color: ORANGE }}>
                have a go →
              </span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// ═══ 38 — Brutalist type ═══════════════════════════════════════════════════════════════
// Type at maximum, hard grid, no softness. The logo oversized and bleeding off the edge.
export function Art38() {
  return (
    <Frame id="38" bg="#0a0a0a">
      <div className="border-b border-white/15">
        <div
          className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: CREAM }}
        >
          <span>Flowsha</span>
          <span className="hidden gap-6 sm:flex">
            <span>Classes</span>
            <span>Shows</span>
            <span>Hoops</span>
            <span>Contact</span>
          </span>
          <span style={{ color: ORANGE }}>Book</span>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-8">
          <h1
            className="font-display uppercase leading-[0.78] tracking-[-0.02em]"
            style={{ color: CREAM }}
          >
            <span className="block text-[clamp(3.4rem,15vw,11rem)]">Hoop</span>
            <span className="block text-[clamp(3.4rem,15vw,11rem)]" style={{ color: ORANGE }}>
              Harder
            </span>
          </h1>
        </div>

        {/* Bleeds deliberately off the right edge — the crop is the point. */}
        <img
          src={LOGO}
          alt="Flowsha"
          width={670}
          height={896}
          className="pointer-events-none absolute -right-[6%] bottom-[-8%] h-[92%] w-auto opacity-95"
        />

        <div className="mx-auto max-w-6xl px-5 pb-16 pt-6">
          <p
            className="max-w-sm font-mono text-[13px] uppercase leading-relaxed tracking-[0.1em]"
            style={{ color: 'rgba(247,241,227,.72)' }}
          >
            Workshops, fire &amp; LED performance, handmade hoops. Southampton, Hampshire.
          </p>
        </div>
      </div>

      <div className="grid border-t border-white/15 sm:grid-cols-3">
        {OFFERINGS.map(([t, b]) => (
          <div key={t} className="border-b border-white/15 p-6 sm:border-r">
            <span className="font-display text-3xl uppercase leading-none" style={{ color: CREAM }}>
              {t}
            </span>
            <p
              className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em]"
              style={{ color: 'rgba(247,241,227,.6)' }}
            >
              {b}
            </p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ═══ 39 — Stage ════════════════════════════════════════════════════════════════════════
// A dark theatre and one spotlight. The logo is the performer walking on.
export function Art39() {
  return (
    <Frame id="39" bg="#08070b">
      <div className="relative flex min-h-[94vh] flex-col items-center justify-end overflow-hidden pb-[12vh]">
        {/* The beam, then the pool of light on the floor. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-[70%] w-[54vw] -translate-x-1/2"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,231,186,.22), rgba(255,231,186,0) 78%)',
            clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0% 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-[62%] h-[34vh] w-[76vw] -translate-x-1/2 rounded-[50%]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,231,186,.34) 0%, rgba(255,231,186,0) 70%)',
          }}
        />

        <img
          src={LOGO}
          alt="Flowsha"
          width={670}
          height={896}
          className="relative z-10 h-[58vh] w-auto"
          style={{ filter: 'drop-shadow(0 26px 30px rgba(0,0,0,.85))' }}
        />

        <div className="relative z-10 mt-10 px-6 text-center">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.34em]"
            style={{ color: '#e8c88a' }}
          >
            One hooper · one hoop · one room
          </p>
          <h1
            className="mt-4 font-display text-[clamp(2.2rem,7vw,5rem)] leading-[0.95]"
            style={{ color: CREAM }}
          >
            Come and play.
          </h1>
          <span
            className="mt-8 inline-block border px-8 py-3 font-mono text-[11px] uppercase tracking-[0.24em]"
            style={{ borderColor: '#e8c88a', color: '#e8c88a' }}
          >
            Book a workshop
          </span>
        </div>
      </div>
    </Frame>
  );
}

// ═══ 40 — Programme ════════════════════════════════════════════════════════════════════
// The site as a performance programme: a ticket with a perforated stub.
export function Art40() {
  const perf = 'radial-gradient(circle at 6px 50%, transparent 5px, currentColor 5px)';
  return (
    <Frame id="40" bg="#dcd3bd">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="overflow-hidden rounded-lg bg-[#fbf7ec] shadow-[0_18px_40px_rgba(0,0,0,.18)]">
          <div className="flex flex-col sm:flex-row">
            {/* Stub — the logo is printed here. */}
            <div
              className="relative flex shrink-0 flex-col items-center justify-center gap-3 px-8 py-10 sm:w-[36%]"
              style={{ backgroundColor: GREEN }}
            >
              <img
                src={LOGO}
                alt="Flowsha"
                width={670}
                height={896}
                className="h-[26vh] w-auto"
                style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.35))' }}
              />
              <span
                className="font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: CREAM }}
              >
                Admit one
              </span>
            </div>

            {/* Perforation. */}
            <div
              aria-hidden
              className="hidden w-[12px] shrink-0 sm:block"
              style={{
                color: '#dcd3bd',
                backgroundImage: perf,
                backgroundSize: '12px 18px',
                backgroundRepeat: 'repeat-y',
              }}
            />

            <div className="flex-1 px-8 py-10">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: ORANGE }}
              >
                Programme · Southampton
              </p>
              <h1
                className="mt-3 font-display text-[clamp(2rem,5.4vw,3.4rem)] leading-[0.95]"
                style={{ color: INK }}
              >
                Flow · Play · Connect
              </h1>
              <dl className="mt-7 space-y-0 font-mono text-[12px] uppercase tracking-[0.1em]">
                {[
                  ['Classes', 'Weekly · all levels'],
                  ['Performance', 'Fire &amp; LED · on request'],
                  ['Hoops', 'Made to order'],
                  ['Venue', siteConfig.areaServed],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="border-black/12 flex justify-between border-b py-2.5"
                    style={{ color: 'rgba(28,26,23,.75)' }}
                  >
                    <dt>{k}</dt>
                    <dd style={{ color: INK }} dangerouslySetInnerHTML={{ __html: v }} />
                  </div>
                ))}
              </dl>
              <span
                className="mt-7 inline-block px-7 py-3 font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ backgroundColor: INK, color: CREAM }}
              >
                Reserve a place
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[1, 5, 2].map((n, i) => (
            <div key={n} className="overflow-hidden rounded bg-[#fbf7ec] p-2 shadow-md">
              <img src={g(n)} alt={galleryImages[n].alt} className="h-32 w-full object-cover" />
              <p
                className="px-1 py-2 font-mono text-[10px] uppercase tracking-[0.16em]"
                style={{ color: 'rgba(28,26,23,.7)' }}
              >
                {OFFERINGS[i][0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
