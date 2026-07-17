import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import CtaButton from '@/components/CtaButton';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center sm:px-8">
      {/* Decorative spinning hoop with the code in the middle. */}
      <FadeIn>
        <div
          aria-hidden="true"
          className="relative mb-10 flex h-44 w-44 items-center justify-center"
        >
          <span className="absolute inset-0 rounded-full border-[6px] border-cream/10" />
          <span className="absolute inset-0 animate-spin rounded-full border-[6px] border-transparent border-t-mustard [animation-duration:3s]" />
          <span className="font-display text-5xl text-mustard">404</span>
        </div>
      </FadeIn>

      <FadeIn
        as="p"
        className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
      >
        Page not found
      </FadeIn>
      <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.25rem,6vw,3.75rem)]">
        This one span off somewhere
      </FadeIn>
      <FadeIn as="p" className="mb-10 text-lg text-cream/85">
        The page you&rsquo;re after isn&rsquo;t here &mdash; it may have rolled away or never
        existed. Let&rsquo;s get you back in the flow.
      </FadeIn>

      <FadeIn className="flex flex-wrap items-center justify-center gap-3">
        <CtaButton href="/">Back home</CtaButton>
        <CtaButton href="/contact/" variant="outline">
          Get in touch
        </CtaButton>
      </FadeIn>
    </section>
  );
}
