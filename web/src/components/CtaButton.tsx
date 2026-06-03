import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'light' | 'lightOutline';

const styles: Record<Variant, string> = {
  primary: 'bg-terracotta text-cream hover:bg-clay',
  outline: 'border border-forest/40 text-forest hover:bg-forest hover:text-cream',
  light: 'bg-cream text-forest hover:bg-mustard hover:text-ink',
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
