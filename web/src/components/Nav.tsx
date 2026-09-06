'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import { navLinks } from '@/lib/data';
import { useCart } from '@/components/shop/CartProvider';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { itemCount, isReady } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-forest-dark/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Logo />

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-semibold text-cream/80 transition-colors hover:text-terracotta-light"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <BasketLink count={isReady ? itemCount : 0} />
          </li>
          <li>
            <Link
              href="/workshops/"
              className="rounded-full bg-terracotta-light px-5 py-2 text-sm font-semibold text-forest-dark transition-colors hover:bg-terracotta-light/90"
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
          className="flex h-10 w-10 items-center justify-center rounded-full text-cream md:hidden"
        >
          <span className="text-2xl" aria-hidden>
            {open ? '✕' : '☰'}
          </span>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-cream/10 bg-forest-dark px-6 pb-5 pt-2 md:hidden">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-semibold text-cream/85"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/shop/cart/"
              onClick={() => setOpen(false)}
              className="block py-2 font-semibold text-cream/85"
            >
              Basket{isReady && itemCount > 0 ? ` (${itemCount})` : ''}
            </Link>
          </li>
          <li>
            <Link
              href="/workshops/"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block rounded-full bg-terracotta-light px-5 py-2 font-semibold text-forest-dark"
            >
              Book a workshop
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}

// Count is rendered only once the cart has been read from localStorage, so the
// static HTML and the first client render agree (no hydration mismatch).
function BasketLink({ count }: { count: number }) {
  return (
    <Link
      href="/shop/cart/"
      aria-label={count > 0 ? `Basket, ${count} item${count === 1 ? '' : 's'}` : 'Basket, empty'}
      className="relative flex items-center gap-1.5 text-sm font-semibold text-cream/80 transition-colors hover:text-terracotta-light"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span className="min-w-[1.25rem] rounded-full bg-terracotta-light px-1.5 py-0.5 text-center text-xs font-bold text-forest-dark">
          {count}
        </span>
      )}
    </Link>
  );
}
