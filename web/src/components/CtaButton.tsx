import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'gold' | 'outline' | 'light' | 'lightOutline';

const styles: Record<Variant, string> = {
  primary: 'bg-terracotta-deep text-cream hover:bg-clay',
  gold: 'bg-terracotta-light text-forest-dark hover:bg-terracotta-light/90',
  outline: 'border border-cream/40 text-cream hover:bg-cream hover:text-forest-dark',
  light: 'bg-cream text-forest hover:bg-terracotta-light hover:text-ink',
  lightOutline: 'border border-cream/70 text-cream hover:bg-cream hover:text-forest',
};

export default function CtaButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
