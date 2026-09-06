import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';
import OrdersDashboard from '@/components/dashboard/OrdersDashboard';

// Private dashboard — kept out of search (also excluded from sitemap.ts and
// disallowed via the /dashboard/ rule in robots.ts). The real gate is the
// authenticated GET /admin/orders API.
export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <DashboardShell>
      <OrdersDashboard />
    </DashboardShell>
  );
}
