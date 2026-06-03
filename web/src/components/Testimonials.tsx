import FadeIn from './FadeIn';
import { testimonials } from '@/lib/data';

export default function Testimonials() {
  return (
    <section className="bg-sand px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <FadeIn
          as="p"
          className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta"
        >
          Kind words
        </FadeIn>
        <FadeIn as="h2" className="mb-10 font-display text-[clamp(2rem,5vw,3rem)]">
          What hoopers say
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <FadeIn key={t.name}>
              <figure className="flex h-full flex-col rounded-3xl bg-cream p-7 shadow-sm">
                <span aria-hidden className="font-display text-4xl leading-none text-mustard">
                  “
                </span>
                <blockquote className="mt-2 flex-1 text-[0.97rem] leading-relaxed text-ink/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 font-display text-lg text-forest">
                  — {t.name}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
