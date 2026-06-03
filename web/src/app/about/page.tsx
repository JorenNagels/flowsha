import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import FadeIn from '@/components/FadeIn';
import CtaButton from '@/components/CtaButton';
import JsonLd from '@/components/JsonLd';
import { aboutImage, aboutParagraphs } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Osha | Hula Hoop Teacher & Flow Artist',
  description:
    'Meet Osha, the flow artist and hula hoop teacher behind Flowsha. Her relaxed, welcoming workshops help everyone discover the joy of movement and flow.',
  alternates: { canonical: '/about/' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${siteConfig.url}/about/` },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <FadeIn
          as="p"
          className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta"
        >
          About me
        </FadeIn>
        <FadeIn as="h1" className="mb-10 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
          Hi, I’m Osha
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-[1fr_0.85fr] md:items-start">
          <FadeIn className="order-2 space-y-5 text-lg leading-relaxed text-ink/85 md:order-1">
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="pt-3">
              <CtaButton href="/workshops/" variant="primary">
                Come and play
              </CtaButton>
            </div>
          </FadeIn>

          <FadeIn className="order-1 md:sticky md:top-24 md:order-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-sand">
              <ExportedImage
                src={aboutImage}
                alt="Osha, founder of Flowsha, teaching a student in a hula hoop workshop"
                fill
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-sand px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn as="h2" className="mb-4 font-display text-[clamp(1.8rem,4vw,2.6rem)]">
            My teaching style
          </FadeIn>
          <FadeIn as="p" className="text-lg text-ink/85">
            My classes are relaxed and low-pressure. There’s no such thing as being “good” at it,
            just space to mess about, try things and move how feels right. Expect a lot of laughing,
            plenty of encouragement, and no rush.
          </FadeIn>
        </div>
      </section>
    </>
  );
}
