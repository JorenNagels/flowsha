import type { Metadata } from 'next';
import { Suspense } from 'react';
import ExportedImage from '@/components/ExportedImage';
import FadeIn from '@/components/FadeIn';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { contactImage } from '@/lib/data';
import { breadcrumbJsonLd, pageMetadata, siteConfig } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Contact & Booking',
  description:
    'Get in touch with Flowsha to book a workshop or private lesson, enquire about a performance, or order a handmade hoop. I’d love to hear from you.',
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <JsonLd data={breadcrumbJsonLd('Contact', '/contact/')} />
      <FadeIn
        as="p"
        className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-light"
      >
        Contact
      </FadeIn>
      <FadeIn as="h1" className="mb-4 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
        Let’s connect
      </FadeIn>
      <FadeIn as="p" className="mb-10 text-lg text-cream/85">
        Booking a workshop, enquiring about a performance, or after a handmade hoop? Fill in the
        form below or email{' '}
        <a href={`mailto:${siteConfig.email}`} className="text-terracotta-light underline">
          {siteConfig.email}
        </a>
        .
      </FadeIn>

      <FadeIn className="mb-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-forest">
          <ExportedImage
            src={contactImage}
            alt="Osha chatting with hoopers during a relaxed studio session in warm purple light"
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
