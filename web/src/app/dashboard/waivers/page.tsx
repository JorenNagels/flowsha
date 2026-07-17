import type { Metadata } from 'next';
import WaiverDashboard from '@/components/dashboard/WaiverDashboard';

// Private dashboard — kept out of search (also excluded from sitemap.ts and
// disallowed via the /dashboard/ rule in robots.ts). The real gate is the
// authenticated GET /waiver API.
export const metadata: Metadata = {
  title: 'Waivers',
  robots: { index: false, follow: false },
};

export default function WaiversPage() {
  return <WaiverDashboard />;
}
