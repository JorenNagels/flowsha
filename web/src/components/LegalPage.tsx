import FadeIn from '@/components/FadeIn';
import JsonLd from '@/components/JsonLd';
import type { LegalDocument } from '@/lib/data';
import { breadcrumbJsonLd } from '@/lib/site';

// Shared renderer for the legal pages. Extracted from the privacy page's layout
// so terms/returns/delivery can't drift from it visually.
export default function LegalPage({
  eyebrow,
  title,
  path,
  doc,
}: {
  eyebrow: string;
  title: string;
  path: string;
  doc: LegalDocument;
}) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(title, path)} />

      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <FadeIn
          as="p"
          className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-light"
        >
          {eyebrow}
        </FadeIn>
        <FadeIn as="h1" className="mb-3 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
          {title}
        </FadeIn>
        <FadeIn as="p" className="text-sm text-cream/60">
          Last updated: {doc.updated}
        </FadeIn>

        <div className="mt-8 space-y-5">
          {doc.intro.map((p) => (
            <FadeIn as="p" key={p.slice(0, 24)} className="text-lg text-cream/85">
              {p}
            </FadeIn>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {doc.sections.map((section) => (
            <FadeIn key={section.heading} as="section">
              <h2 className="font-display text-2xl text-cream">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-cream/80">
                {section.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-3 space-y-2 text-cream/80">
                  {section.list.map((item) => (
                    <li key={item.slice(0, 24)} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-light"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.link && (
                <p className="mt-3 text-cream/80">
                  {section.link.before}
                  <a href={section.link.href} className="text-terracotta-light underline">
                    {section.link.label}
                  </a>
                  {section.link.after}
                </p>
              )}
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
