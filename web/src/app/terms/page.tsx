import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { termsPolicy } from '@/lib/data';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Terms & Conditions',
  description:
    'Terms and conditions for buying handmade hula hoops from Flowsha — contract formation, pricing, lead times, your consumer rights, safety and liability.',
  path: '/terms/',
});

export default function TermsPage() {
  return <LegalPage eyebrow="Legal" title="Terms & conditions" path="/terms/" doc={termsPolicy} />;
}
