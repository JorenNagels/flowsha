'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { clerkAppearance } from '@/lib/clerkAppearance';

const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

function GoToDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/');
  }, [router]);
  return null;
}

export default function LoginClient() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-forest px-6 py-16">
      <a href="/" className="font-display text-2xl text-cream">
        Flowsha
      </a>

      {!CLERK_KEY ? (
        <p className="max-w-sm rounded-2xl border border-cream/10 bg-forest/40 p-6 text-center text-sm text-cream/80">
          Sign-in isn’t configured yet. Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to enable
          the dashboard login.
        </p>
      ) : (
        <>
          <SignedIn>
            <GoToDashboard />
          </SignedIn>
          <SignedOut>
            {/* Hash routing keeps every step on /login/ so the static host never
                404s on a Clerk sub-path. */}
            <SignIn routing="hash" fallbackRedirectUrl="/dashboard/" appearance={clerkAppearance} />
          </SignedOut>
        </>
      )}
    </div>
  );
}
