/* eslint-disable @next/next/no-img-element */
// Trials 25–30: replace green as the site's main colour outright. Not chrome tweaks — the
// whole canvas changes, and forest green stops being the background entirely.
//
// Why this fixes the logo problem, precisely:
//
// The bug was never "the background is dark". It's that the background is the SAME HUE as
// the figure, so the figure has nothing to separate it. Change the hue and you separate on
// two axes instead of one — hue and lightness — and the mark reads as deliberate rather
// than merely legible.
//
// Hue alone is not enough though. The green figure is #4c7252, relative luminance 0.142,
// so a background must sit at or below ~0.014 to clear the 3:1 floor for graphics. A
// mid-tone blue would look different and still fail. Every dark option below is chosen to
// clear 3:1, with the measured ratio noted. Option 30 goes the other way — light enough
// that the figure reads as dark-on-light at 4.7:1.
//
// A bonus of dropping green from the background: the logo becomes the only green thing on
// the page, so it can't compete with anything.

import type { CSSProperties } from 'react';
import { heroImage, galleryImages, navLinks } from '@/lib/data';
import { siteConfig } from '@/lib/site';
import { Switcher } from './registry';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const asset = (src: string) => `${basePath}${src}`;
const LOGO = asset('/brand/flowsha-logo.svg');

type Palette = {
  id: string;
  /** Page + hero + cards section. */
  base: string;
  /** Lifted panel colour for cards and the footer. */
  panel: string;
  /** Accent for eyebrows, links and the CTA fill. */
  accent: string;
  /** Text colour on the CTA fill. */
  accentText: string;
  /** true when the canvas is light and type has to flip dark. */
  light?: boolean;
};

const CREAM = '#f7f1e3';
const TERRA_LIGHT = '#e79a5c';
const TERRA_DEEP = '#a95720';

export const palettes: Palette[] = [
  // 25 — Petrol. Dark teal: adjacent to green on the wheel, so it still feels natural,
  // but far enough round that the figure separates. 3.2:1.
  { id: '25', base: '#0a1c20', panel: '#12313a', accent: TERRA_LIGHT, accentText: '#0a1c20' },
  // 26 — Midnight indigo. Cool and night-time; the warm orange hoop sings against it. 3.4:1.
  { id: '26', base: '#0c1430', panel: '#1b2450', accent: TERRA_LIGHT, accentText: '#0c1430' },
  // 27 — Charcoal. Neutral, so the logo supplies the only colour on the page. 3.3:1.
  { id: '27', base: '#16181a', panel: '#24282b', accent: TERRA_LIGHT, accentText: '#16181a' },
  // 28 — Oxblood. Deep burgundy, warm and theatrical — suits the fire-performance side. 3.3:1.
  { id: '28', base: '#240e13', panel: '#3d1a21', accent: TERRA_LIGHT, accentText: '#240e13' },
  // 29 — Dark rust. The brand's own orange taken right down, so the page is nearly
  // monochrome with the hoop and only the figure's green breaks it. 3.2:1.
  { id: '29', base: '#2a1408', panel: '#43220f', accent: TERRA_LIGHT, accentText: '#2a1408' },
  // 30 — Bone. The other direction: light enough that the figure reads dark-on-light at
  // 4.7:1. Warmer and softer than the cream already in the palette.
  {
    id: '30',
    base: '#f2ece0',
    panel: '#e6ddcb',
    accent: TERRA_DEEP,
    accentText: CREAM,
    light: true,
  },
];

const OFFERINGS: [string, string][] = [
  [
    'Classes',
    'Group workshops and private lessons for adults and young people. No experience needed.',
  ],
  ['Performances', 'Hoop acts for festivals, parties, and events — fire and LED.'],
  [
    'Handmade Hoops',
    'Hoops made by hand for every level, from your first beginner hoop to fast dance hoops.',
  ],
];

export default function MainColourTrial({ id }: { id: string }) {
  const p = palettes.find((v) => v.id === id);
  if (!p) return null;

  // One switch, so a light canvas flips every text colour rather than only some of them —
  // the classic way a theme swap ends up with invisible copy in one corner.
  const heading = p.light ? 'text-forest-dark' : 'text-cream';
  const body = p.light ? 'text-ink/75' : 'text-cream/80';
  const rule = p.light ? 'rgba(46,42,36,.12)' : 'rgba(247,241,227,.10)';
  const cardStyle: CSSProperties = { backgroundColor: p.panel, border: `1px solid ${rule}` };

  // The hero photo always sits on a dark scrim so the cream hero type stays legible, even
  // on the light canvas — otherwise option 30's headline lands on a bright photo.
  const scrim = p.light ? '#2b2118' : p.base;
  // These bases are much darker than the forest-dark they replace, so the old scrim ate the
  // photography. Solid only at the very bottom (to blend into the next section), then it
  // lets go quickly — the photos are one of the site's main assets and shouldn't be crushed.
  const heroGrad = `linear-gradient(to top, ${scrim} 0%, ${scrim}cc 38%, ${scrim}59 100%)`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: p.base }}>
      <Switcher current={id} />

      <header
        className="relative z-20"
        style={{ backgroundColor: p.base, borderBottom: `1px solid ${rule}` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5 sm:px-8">
          <span className="inline-flex items-center gap-3">
            <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-12 w-auto" />
            <span className={`font-display text-xl tracking-wide ${heading}`}>
              {siteConfig.name}
            </span>
          </span>
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <span key={l.href} className={`text-sm font-semibold ${body}`}>
                {l.label}
              </span>
            ))}
            <span
              className="rounded-full px-5 py-2 text-sm font-semibold"
              style={{ backgroundColor: p.accent, color: p.accentText }}
            >
              Book a workshop
            </span>
          </nav>
        </div>
      </header>

      <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden px-6 sm:px-8">
        <img
          src={asset(heroImage)}
          alt="Osha of Flowsha spinning hoops in a colourfully lit studio"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.55]"
        />
        <div className="absolute inset-0" style={{ backgroundImage: heroGrad }} />
        <div className="relative z-10 mx-auto w-full max-w-6xl py-20">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: TERRA_LIGHT }}
          >
            {siteConfig.offerings}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] text-cream">
            flow <span style={{ color: '#d3793b' }}>•</span> play{' '}
            <span style={{ color: '#d3793b' }}>•</span> connect
          </h1>
          <p className="mt-6 max-w-lg text-lg text-cream/80">
            Hula hoop workshops, performances, and handmade hoops in Southampton.
          </p>
          <span
            className="mt-9 inline-block rounded-full px-7 py-3 text-sm font-semibold"
            style={{ backgroundColor: p.accent, color: p.accentText }}
          >
            Book a workshop
          </span>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8" style={{ backgroundColor: p.base }}>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {OFFERINGS.map(([title, blurb], i) => (
            <div key={title} className="flex flex-col rounded-3xl p-7" style={cardStyle}>
              <img
                src={asset(galleryImages[i + 1].src)}
                alt={galleryImages[i + 1].alt}
                className="mb-5 h-40 w-full rounded-2xl object-cover"
              />
              <h3 className={`font-display text-xl ${heading}`}>{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${body}`}>{blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ backgroundColor: p.panel }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-3">
          <div>
            <div className="inline-flex items-center gap-3">
              <img src={LOGO} alt="" aria-hidden width={670} height={896} className="h-20 w-auto" />
              <div>
                <div className={`font-display text-2xl ${heading}`}>{siteConfig.name}</div>
                <div
                  className="font-script text-xl italic"
                  style={{ color: p.light ? TERRA_DEEP : TERRA_LIGHT }}
                >
                  {siteConfig.tagline}
                </div>
              </div>
            </div>
            <p className={`mt-3 text-sm uppercase tracking-[0.18em] ${body}`}>
              {siteConfig.offerings}
            </p>
          </div>
          <nav className="md:justify-self-center">
            <h2
              className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]"
              style={{ color: p.light ? TERRA_DEEP : TERRA_LIGHT }}
            >
              Explore
            </h2>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href} className={body}>
                  {l.label}
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:justify-self-end">
            <h2
              className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]"
              style={{ color: p.light ? TERRA_DEEP : TERRA_LIGHT }}
            >
              Find me
            </h2>
            <p className={body}>{siteConfig.email}</p>
            <p className={`mt-1 text-sm ${body}`}>Based in {siteConfig.areaServed}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
