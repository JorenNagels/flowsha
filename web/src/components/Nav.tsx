'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import { navLinks } from '@/lib/data';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-clay/15 bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Logo />

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-semibold text-forest/80 transition-colors hover:text-terracotta"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/workshops/"
              className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-clay"
            >
              Book a workshop
            </Link>
          </li>
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-forest md:hidden"
        >
          <span className="text-2xl" aria-hidden>
            {open ? '✕' : '☰'}
          </span>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-clay/15 bg-cream px-6 pb-5 pt-2 md:hidden">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-semibold text-forest"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/workshops/"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block rounded-full bg-terracotta px-5 py-2 font-semibold text-cream"
            >
              Book a workshop
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
