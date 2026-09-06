import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { returnsPolicy } from '@/lib/data';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Returns & Cancellations',
  description:
    'Change your mind within 14 days of delivery, on any Flowsha hoop including made-to-order ones. How to cancel, who pays return postage, and how refunds work.',
  path: '/returns/',
});

export default function ReturnsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Returns & cancellations"
      path="/returns/"
      doc={returnsPolicy}
    />
  );
}
