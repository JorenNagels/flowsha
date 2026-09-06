import type { Metadata } from 'next';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ProductsDashboard from '@/components/dashboard/ProductsDashboard';

// Private dashboard — see the note in dashboard/orders/page.tsx. The real gate is
// the authenticated /admin/products API.
export const metadata: Metadata = {
  title: 'Ready-made hoops',
  robots: { index: false, follow: false },
};

export default function DashboardShopPage() {
  return (
    <DashboardShell>
      <ProductsDashboard />
    </DashboardShell>
  );
}
