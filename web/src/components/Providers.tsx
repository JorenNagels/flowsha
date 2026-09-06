'use client';

import { ClerkProvider } from '@clerk/clerk-react';
import { CartProvider } from '@/components/shop/CartProvider';

// Public Clerk key, baked in at build time (like NEXT_PUBLIC_TURNSTILE_SITE_KEY).
// When unset — local dev or CI without the key — we skip ClerkProvider entirely so
// the marketing site still builds/renders. The dashboard/login components detect
// the same missing key and show a "not configured" state instead of calling hooks.
const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

export default function Providers({ children }: { children: React.ReactNode }) {
  // CartProvider wraps everything (not just /shop) because the Nav shows a basket
  // count on every page. It holds no secrets and costs nothing when the cart is
  // empty, so it sits outside the Clerk gate.
  const withCart = <CartProvider>{children}</CartProvider>;

  if (!CLERK_KEY) return withCart;

  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      signInUrl="/login"
      signInFallbackRedirectUrl="/dashboard/"
      afterSignOutUrl="/login"
    >
      {withCart}
    </ClerkProvider>
  );
}
