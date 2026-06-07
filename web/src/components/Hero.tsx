import ExportedImage from '@/components/ExportedImage';
import FadeIn from './FadeIn';
import CtaButton from './CtaButton';
import { heroImage } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export default function Hero() {
  return (
    <section className="relative flex min-h-[82vh] items-center overflow-hidden px-6 sm:px-8">
      <ExportedImage
        src={heroImage}
        alt="Osha of Flowsha spinning hoops in a colourfully lit studio"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-dark via-forest-dark/60 to-forest-dark/30" />

      {/* Soft mustard glow — the After Dark signature. */}
      <div className="animate-float pointer-events-none absolute -right-10 top-16 -z-10 h-72 w-72 rounded-full bg-mustard/20 blur-3xl" />

      <div className="mx-auto w-full max-w-6xl py-20">
        <FadeIn
          as="p"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-mustard"
        >
          {siteConfig.offerings}
        </FadeIn>

        <FadeIn
          as="h1"
          className="mt-4 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] text-cream drop-shadow-sm"
        >
          Find your <span className="italic text-mustard">flow</span>
        </FadeIn>

        <FadeIn as="p" className="mt-6 max-w-lg text-lg text-cream/80">
          Hula hoop workshops, performances, and handmade hoops in Southampton.
        </FadeIn>

        <FadeIn className="mt-9 flex flex-wrap gap-4">
          <CtaButton href="/workshops/" variant="gold">
            Book a workshop
          </CtaButton>
        </FadeIn>
      </div>
    </section>
  );
}
