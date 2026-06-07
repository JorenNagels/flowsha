import type { Metadata } from 'next';
import { Suspense } from 'react';
import ExportedImage from '@/components/ExportedImage';
import FadeIn from '@/components/FadeIn';
import ContactForm from '@/components/ContactForm';
import { contactImage } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact & Booking',
  description:
    'Get in touch with Flowsha to book a workshop or private lesson, enquire about a performance, or order a handmade hoop. I’d love to hear from you.',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <FadeIn
        as="p"
        className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-mustard"
      >
        Contact
      </FadeIn>
      <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
        Let’s connect
      </FadeIn>
      <FadeIn as="p" className="mb-10 text-lg text-cream/85">
        Booking a workshop, enquiring about a performance, or after a handmade hoop? Fill in the
        form below or email{' '}
        <a href={`mailto:${siteConfig.email}`} className="text-mustard underline">
          {siteConfig.email}
        </a>
        .
      </FadeIn>

      <FadeIn className="mb-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-forest">
          <ExportedImage
            src={contactImage}
            alt="Two people learning to spin hoops side by side under teal and purple studio lighting"
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      </FadeIn>

      <FadeIn>
        <Suspense fallback={<div className="h-96 rounded-3xl bg-forest/30" />}>
          <ContactForm />
        </Suspense>
      </FadeIn>
    </section>
  );
}
