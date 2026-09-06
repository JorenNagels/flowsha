import Link from 'next/link';
import { siteConfig } from '@/lib/site';

// The brand mark ships as a static SVG in public/brand/ rather than inline JSX: it's 21 kB
// of path data, so inlining it in both the nav and the footer would add ~20 kB gzip to
// every page's HTML. Regenerate with `node scripts/prep-brand.mjs`.
//
// The logo is never recoloured. It's a green figure with an orange hoop, and repainting the
// figure to survive a dark background reads as a different logo. The rule runs the other
// way: whatever places the logo is responsible for putting something light behind it —
// on the forest-dark canvas the green figure all but disappears.

// Plain <img> srcs aren't rewritten with basePath by Next (unlike <ExportedImage> and
// static imports), so it has to be prepended by hand or the logo 404s on the staging
// preview, which is served under a subpath.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Intrinsic size of the source artwork. Declaring it keeps the reserved box correct while
// the SVG loads, so the sticky nav doesn't shift.
const MARK_WIDTH = 670;
const MARK_HEIGHT = 896;

export function LogoMark({ className = '', alt = '' }: { className?: string; alt?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG; the image optimizer only handles rasters
    <img
      src={`${basePath}/brand/flowsha-logo.svg`}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      width={MARK_WIDTH}
      height={MARK_HEIGHT}
      className={className}
    />
  );
}

/**
 * A cream tile for the mark to sit on, so the green figure stays visible against the
 * forest-dark chrome. Interim treatment while the /1…/5 chrome trials are being decided —
 * see src/app/_chrome-trials/trials.tsx. Drop it if the chosen direction puts the logo on
 * an already-light nav.
 */
function Plate({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-2xl bg-cream">
      {children}
    </span>
  );
}

export default function Logo({
  className = '',
  markClassName = 'h-11 w-auto',
  wordClassName = 'text-cream',
  plate = true,
}: {
  className?: string;
  /** Sizing for the mark itself. */
  markClassName?: string;
  /** Colour for the wordmark, so it can follow whatever background it sits on. */
  wordClassName?: string;
  /** Set false where the surrounding background is already light. */
  plate?: boolean;
}) {
  // The old placeholder was a symmetrical hoop, so a 180° hover spin read fine. A dancing
  // figure does not — it just goes upside down. A lean into the spin suits it better.
  const mark = (
    <LogoMark
      className={`${markClassName} transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105`}
    />
  );

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      {plate ? <Plate>{mark}</Plate> : mark}
      <span className={`font-display text-xl tracking-wide ${wordClassName}`}>
        {siteConfig.name}
      </span>
    </Link>
  );
}
