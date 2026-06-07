'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '';

const ENQUIRY_TYPES = [
  { value: 'general', label: 'General enquiry' },
  { value: 'workshop', label: 'Workshop / lesson booking' },
  { value: 'performance', label: 'Performance booking' },
  { value: 'shop', label: 'Hoop order' },
] as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const params = useSearchParams();
  const [enquiryType, setEnquiryType] = useState<string>('general');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const t = params.get('type');
    if (t && ENQUIRY_TYPES.some((e) => e.value === t)) setEnquiryType(t);
  }, [params]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      enquiryType,
      preferredDate: String(data.get('preferredDate') ?? ''),
      message: String(data.get('message') ?? ''),
      company: String(data.get('company') ?? ''), // honeypot
    };

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center">
        <p className="font-display text-2xl text-mustard">Thanks! 🌀</p>
        <p className="mt-2 text-cream/80">Got your message. I’ll reply as soon as I can.</p>
      </div>
    );
  }

  const field =
    'w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-3 text-cream placeholder-cream/40 outline-none transition focus:border-mustard focus:ring-2 focus:ring-mustard/20';

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Honeypot — hidden from humans, bots fill it and get dropped. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-cream/80">Your name</span>
          <input name="name" type="text" required maxLength={100} className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-cream/80">Email</span>
          <input name="email" type="email" required maxLength={320} className={field} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-cream/80">I’m interested in</span>
          <select
            name="enquiryType"
            value={enquiryType}
            onChange={(e) => setEnquiryType(e.target.value)}
            className={field}
          >
            {ENQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-cream/80">
            Preferred date <span className="font-normal text-cream/50">(optional)</span>
          </span>
          <input
            name="preferredDate"
            type="text"
            maxLength={100}
            placeholder="e.g. Sat 12 July"
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-cream/80">Message</span>
        <textarea name="message" required maxLength={3000} rows={6} className={field} />
      </label>

      {status === 'error' && (
        <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded-full bg-terracotta px-8 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
