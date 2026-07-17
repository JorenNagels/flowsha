'use client';

import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// The app routes (/login, /dashboard) get a clean, chrome-free shell instead of
// the marketing Nav/Footer. Everything else renders the normal site chrome.
const APP_ROUTES = ['/login', '/dashboard'];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isApp = APP_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  return (
    <>
      {!isApp && <Nav />}
      <main>{children}</main>
      {!isApp && <Footer />}
    </>
  );
}
