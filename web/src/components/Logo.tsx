import Link from 'next/link';
import { siteConfig } from '@/lib/site';

// Placeholder brand mark: a continuous flowing looping line forming a hoop.
// Swap for the real logo when available.
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="24"
        cy="24"
        rx="13"
        ry="20"
        transform="rotate(-32 24 24)"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="13"
        ry="20"
        transform="rotate(32 24 24)"
        stroke="currentColor"
        strokeWidth="2.4"
        opacity="0.55"
      />
    </svg>
  );
}

export default function Logo({
  className = '',
  tone = 'ink',
}: {
  className?: string;
  tone?: 'ink' | 'cream';
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={`group inline-flex items-center gap-2.5 ${tone === 'cream' ? 'text-cream' : 'text-forest'} ${className}`}
    >
      <LogoMark className="h-8 w-8 text-terracotta transition-transform duration-700 group-hover:rotate-180" />
      <span className="font-display text-xl tracking-wide">{siteConfig.name}</span>
    </Link>
  );
}
