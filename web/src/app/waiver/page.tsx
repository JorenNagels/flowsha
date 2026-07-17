import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import WaiverForm from '@/components/WaiverForm';

// Hidden page: shared directly with attendees before their first class, kept out
// of search + AI engines (same pattern as /feedback). Also excluded from
// sitemap.ts and disallowed in robots.ts.
export const metadata: Metadata = {
  title: 'Class waiver',
  robots: { index: false, follow: false },
};

export default function WaiverPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:px-8">
      <FadeIn
        as="p"
        className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
      >
        Before your first class
      </FadeIn>
      <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.25rem,6vw,3.75rem)]">
        PAR-Q &amp; Informed Consent
      </FadeIn>
      <FadeIn as="p" className="mb-10 text-lg text-cream/85">
        A quick health questionnaire and consent form so I know you can take part safely. Your
        answers are kept private and confidential &mdash; see the{' '}
        <a href="/privacy/" className="underline decoration-mustard/60 underline-offset-2 hover:text-cream">
          privacy policy
        </a>{' '}
        for how your information is handled.
      </FadeIn>

      <FadeIn>
        <WaiverForm />
      </FadeIn>
    </section>
  );
}
