import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';
import FeedbackDashboard from '@/components/dashboard/FeedbackDashboard';

// Private dashboard — kept out of search (also excluded from sitemap.ts and
// disallowed via the /dashboard/ rule in robots.ts). The real gate is the
// authenticated GET /feedback API.
export const metadata: Metadata = {
  title: 'Feedback',
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return (
    <DashboardShell>
      <FeedbackDashboard />
    </DashboardShell>
  );
}
