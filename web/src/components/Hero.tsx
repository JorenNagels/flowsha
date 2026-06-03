import ExportedImage from '@/components/ExportedImage';
import FadeIn from './FadeIn';
import CtaButton from './CtaButton';
import { heroImage } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <ExportedImage
        src={heroImage}
        alt="Osha of Flowsha spinning hoops in a colourfully lit studio"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-dark/70 via-forest-dark/45 to-forest-dark/80" />

      <FadeIn
        as="p"
        className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cream/85"
      >
        {siteConfig.offerings}
      </FadeIn>

      <FadeIn
        as="h1"
        className="font-display text-[clamp(3rem,9vw,6rem)] leading-[0.95] text-cream drop-shadow-sm"
      >
        {siteConfig.name}
      </FadeIn>

      <FadeIn as="p" className="mt-4 font-script text-[clamp(1.8rem,5vw,3rem)] italic text-mustard">
        {siteConfig.tagline}
      </FadeIn>

      <FadeIn className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <CtaButton href="/workshops/" variant="primary">
          Book a workshop
        </CtaButton>
        <CtaButton href="/shop/" variant="lightOutline">
          Shop hoops
        </CtaButton>
        <CtaButton href="/performances/" variant="lightOutline">
          Performance enquiries
        </CtaButton>
      </FadeIn>
    </section>
  );
}
