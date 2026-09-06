'use client';

import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// The app routes (/login, /dashboard) get a clean, chrome-free shell instead of
// the marketing Nav/Footer. The /1…/50 trials bring their own nav and footer, so
// they need the same treatment or you'd see two of each. Everything else renders the
// normal site chrome.
const CHROME_FREE_ROUTES = [
  '/login',
  '/dashboard',
  '/1',
  '/2',
  '/3',
  '/4',
  '/5',
  '/6',
  '/7',
  '/8',
  '/9',
  '/10',
  '/11',
  '/12',
  '/13',
  '/14',
  '/15',
  '/16',
  '/17',
  '/18',
  '/19',
  '/20',
  '/21',
  '/22',
  '/23',
  '/24',
  '/25',
  '/26',
  '/27',
  '/28',
  '/29',
  '/30',
  '/31',
  '/32',
  '/33',
  '/34',
  '/35',
  '/36',
  '/37',
  '/38',
  '/39',
  '/40',
  '/41',
  '/42',
  '/43',
  '/44',
  '/45',
  '/46',
  '/47',
  '/48',
  '/49',
  '/50',
];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const bare = CHROME_FREE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  return (
    <>
      {!bare && <Nav />}
      <main>{children}</main>
      {!bare && <Footer />}
    </>
  );
}
