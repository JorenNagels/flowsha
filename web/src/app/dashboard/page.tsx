import type { Metadata } from 'next';
import FeedbackDashboard from '@/components/dashboard/FeedbackDashboard';

// Private dashboard — kept out of search (also excluded from sitemap.ts and
// disallowed in robots.ts). The real gate is the authenticated GET /feedback API.
export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <FeedbackDashboard />;
}
