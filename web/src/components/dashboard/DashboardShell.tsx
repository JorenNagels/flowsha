'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { clerkAppearance } from '@/lib/clerkAppearance';
import { LoadingBlock } from '@/components/Spinner';

const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

const NAV_LINKS = [
  { href: '/dashboard/', label: 'Overview' },
  { href: '/dashboard/feedback/', label: 'Feedback' },
  { href: '/dashboard/waivers/', label: 'Waivers' },
];

// Trailing-slash-insensitive compare so `/dashboard` and `/dashboard/` match.
function samePath(a: string, b: string): boolean {
  const strip = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);
  return strip(a) === strip(b);
}

// Shared chrome for the private dashboard pages: Clerk gating + a header with
// nav between Overview / Feedback / Waivers. Each page renders only its own
// content as children.
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  if (!CLERK_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest px-6">
        <p className="max-w-sm rounded-2xl border border-cream/10 bg-forest/40 p-6 text-center text-sm text-cream/80">
          The dashboard isn’t configured yet. Set{' '}
          <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to enable it.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Brief moment while the Clerk SPA boots — avoids a blank flash. */}
      <ClerkLoading>
        <div className="min-h-screen bg-forest text-cream">
          <LoadingBlock label="Loading dashboard…" className="min-h-screen" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <GoToLogin />
        </SignedOut>
        <SignedIn>
          <div className="min-h-screen bg-forest text-cream">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-cream/10 px-6 py-4 sm:px-8">
              <div className="flex items-center gap-5">
                <a href="/" className="font-display text-xl text-cream">
                  Flowsha
                </a>
                <nav className="flex items-center gap-1">
                  {NAV_LINKS.map((link) => (
                    <NavLink key={link.href} href={link.href} label={link.label} />
                  ))}
                </nav>
              </div>
              <UserButton appearance={clerkAppearance} />
            </header>
            <main className="mx-auto max-w-4xl px-6 py-10 sm:px-8">{children}</main>
          </div>
        </SignedIn>
      </ClerkLoaded>
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname() ?? '';
  const active = samePath(pathname, href);
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? 'bg-mustard/15 text-cream'
          : 'text-cream/60 hover:bg-cream/5 hover:text-cream'
      }`}
    >
      {label}
    </a>
  );
}

// Send signed-out visitors to our own /login page (not Clerk's hosted portal).
function GoToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login/');
  }, [router]);
  return (
    <div className="min-h-screen bg-forest text-cream">
      <LoadingBlock label="Redirecting to sign in…" className="min-h-screen" />
    </div>
  );
}
