import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import CtaButton from '@/components/CtaButton';
import ClearCartOnSuccess from '@/components/shop/ClearCartOnSuccess';
import { pageMetadata, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Thank you for your order',
    description: 'Your Flowsha hoop order is confirmed.',
    path: '/shop/thank-you/',
  }),
  // Order confirmation pages must never be indexed.
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <ClearCartOnSuccess />

      <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:px-8">
        <FadeIn as="p" className="font-display text-5xl text-terracotta">
          🌀
        </FadeIn>
        <FadeIn as="h1" className="mt-4 font-display text-[clamp(2.2rem,6vw,3.5rem)]">
          Thank you!
        </FadeIn>
        <FadeIn as="p" className="mt-4 text-lg text-cream/85">
          Your order is confirmed and I’ve started on it. You’ll get a confirmation email with
          everything you ordered, and another one when it’s posted.
        </FadeIn>
        <FadeIn as="p" className="mt-4 text-cream/70">
          Made-to-order hoops usually take 3–10 working days before dispatch. If you need it sooner,
          just reply to your confirmation email and I’ll see what I can do.
        </FadeIn>
        <FadeIn className="mt-8">
          <CtaButton href="/shop/">Back to the shop</CtaButton>
        </FadeIn>
        <FadeIn as="p" className="mt-6 text-sm text-cream/55">
          Questions? Email{' '}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>
        </FadeIn>
      </section>
    </>
  );
}
