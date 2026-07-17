import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

// Private dashboard overview — kept out of search (also excluded from sitemap.ts
// and disallowed in robots.ts). The real gate is the authenticated read APIs.
export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardOverview />
    </DashboardShell>
  );
}
