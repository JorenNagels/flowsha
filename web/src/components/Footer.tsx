import Link from 'next/link';
import { LogoMark } from './Logo';
import { TRADING_ADDRESS, navLinks } from '@/lib/data';
import { siteConfig } from '@/lib/site';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.25.07 1.62.07 4.81s0 3.56-.07 4.81c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.25.06-1.62.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.56 2.2 15.19 2.2 12s0-3.56.07-4.81c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.44 2.2 8.81 2.2 12 2.2Zm0 1.95c-3.14 0-3.51.01-4.75.07-.9.04-1.39.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.04.9.2 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.39-.2 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.2-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32-1.24-.06-1.61-.07-4.75-.07Zm0 3.32a4.53 4.53 0 1 1 0 9.06 4.53 4.53 0 0 1 0-9.06Zm0 1.95a2.58 2.58 0 1 0 0 5.16 2.58 2.58 0 0 0 0-5.16Zm5.77-2.17a1.06 1.06 0 1 1-2.12 0 1.06 1.06 0 0 1 2.12 0Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Link
            href="/"
            aria-label={`${siteConfig.name} home`}
            className="group inline-flex items-center gap-2.5"
          >
            {/* Cream tile so the green figure stays visible on the dark footer — interim,
                pending the /1…/5 chrome trials. */}
            <span className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-2xl bg-cream">
              <LogoMark className="h-[52px] w-auto transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105" />
            </span>
            <span className="font-display text-2xl">{siteConfig.name}</span>
          </Link>
          <p className="mt-3 font-script text-2xl italic text-terracotta-light">
            {siteConfig.tagline}
          </p>
          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-cream/70">
            {siteConfig.offerings}
          </p>
        </div>

        <nav aria-label="Footer" className="md:justify-self-center">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-light">
            Explore
          </h2>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-cream/85 transition-colors hover:text-terracotta-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:justify-self-end">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-light">
            Find me
          </h2>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${siteConfig.name} on Instagram`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 transition-colors hover:border-terracotta-light hover:text-terracotta-light"
            >
              <InstagramIcon />
            </a>
          </div>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 inline-block text-cream/85 transition-colors hover:text-terracotta-light"
          >
            {siteConfig.email}
          </a>
          <p className="mt-3 text-sm text-cream/70">
            Based in {siteConfig.location.city}, {siteConfig.location.region}.
          </p>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-5 text-xs text-cream/60 sm:flex-row sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {TRADING_ADDRESS}
          </p>
          {/* Trader identity + the consumer-facing policies must be reachable from
              every page, not buried in the checkout. */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/privacy/" className="transition-colors hover:text-terracotta-light">
              Privacy
            </Link>
            <Link href="/terms/" className="transition-colors hover:text-terracotta-light">
              Terms
            </Link>
            <Link href="/returns/" className="transition-colors hover:text-terracotta-light">
              Returns
            </Link>
            <Link href="/delivery/" className="transition-colors hover:text-terracotta-light">
              Delivery
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
