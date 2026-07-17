import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from '@/components/dashboard/LoginClient';

// Private sign-in page for the dashboard — kept out of search (also excluded from
// sitemap.ts and disallowed in robots.ts).
export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
