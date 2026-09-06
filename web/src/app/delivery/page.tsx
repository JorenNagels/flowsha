import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { deliveryPolicy } from '@/lib/data';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Delivery',
  description:
    'UK mainland delivery on handmade Flowsha hoops, or free collection in Southampton. Making times, dispatch times, postage costs and what to do if something goes wrong.',
  path: '/delivery/',
});

export default function DeliveryPage() {
  return <LegalPage eyebrow="Legal" title="Delivery" path="/delivery/" doc={deliveryPolicy} />;
}
