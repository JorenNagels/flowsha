import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import FeedbackForm from '@/components/FeedbackForm';

// Hidden page: shared directly with past attendees, kept out of search + AI
// engines (same pattern as /styles). Also excluded from sitemap.ts and
// disallowed in robots.ts.
export const metadata: Metadata = {
  title: 'Class feedback',
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:px-8">
      <FadeIn
        as="p"
        className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
      >
        Your feedback
      </FadeIn>
      <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.25rem,6vw,3.75rem)]">
        How was your class?
      </FadeIn>
      <FadeIn as="p" className="mb-10 text-lg text-cream/85">
        Thanks so much for coming along! A few quick questions will help me shape the classes.
        It only takes a minute or two, and you can skip anything you&rsquo;d rather not answer.
      </FadeIn>

      <FadeIn>
        <FeedbackForm />
      </FadeIn>
    </section>
  );
}
