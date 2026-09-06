import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import JsonLd from '@/components/JsonLd';
import { privacyPolicy } from '@/lib/data';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How Flowsha handles the personal information you share through this website — the contact form and Cloudflare Turnstile spam protection — and your rights over it.',
  path: '/privacy/',
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd('Privacy Policy', '/privacy/')} />

      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <FadeIn
          as="p"
          className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-light"
        >
          Privacy
        </FadeIn>
        <FadeIn as="h1" className="mb-3 font-display text-[clamp(2.5rem,7vw,4.5rem)]">
          Privacy policy
        </FadeIn>
        <FadeIn as="p" className="text-sm text-cream/60">
          Last updated: {privacyPolicy.updated}
        </FadeIn>

        <div className="mt-8 space-y-5">
          {privacyPolicy.intro.map((p) => (
            <FadeIn as="p" key={p.slice(0, 24)} className="text-lg text-cream/85">
              {p}
            </FadeIn>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {privacyPolicy.sections.map((section) => (
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
                  <a
                    href={section.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta-light underline transition-colors hover:text-terracotta-light/80"
                  >
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
