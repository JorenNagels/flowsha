'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiPost, errorMessage } from '@/lib/api';
import { useTurnstile } from '@/hooks/useTurnstile';

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

  const turnstile = useTurnstile();

  useEffect(() => {
    const t = params.get('type');
    if (t && ENQUIRY_TYPES.some((e) => e.value === t)) setEnquiryType(t);
  }, [params]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Turnstile is configured but hasn't produced a token yet — ask them to retry.
    if (turnstile.enabled && !turnstile.getToken()) {
      setStatus('error');
      setError('Still verifying you’re human — please wait a moment and try again.');
      turnstile.reset();
      return;
    }

    setStatus('submitting');
    setError('');

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      enquiryType,
      message: String(data.get('message') ?? ''),
      company: String(data.get('company') ?? ''), // honeypot
      turnstileToken: turnstile.getToken(),
    };

    try {
      await apiPost('/contact', payload);
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(errorMessage(err));
    } finally {
      // Tokens are single-use — get a fresh one for any subsequent submission.
      turnstile.reset();
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center">
        <p className="font-display text-2xl text-terracotta">Thanks! 🌀</p>
        <p className="mt-2 text-cream/80">Got your message. I’ll reply as soon as I can.</p>
      </div>
    );
  }

  const field =
    'w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-3 text-cream placeholder-cream/40 outline-none transition focus:border-terracotta-light focus:ring-2 focus:ring-terracotta-light/20';

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
        <span className="mb-1.5 block text-sm font-semibold text-cream/80">Message</span>
        <textarea name="message" required maxLength={3000} rows={6} className={field} />
      </label>

      {/* Invisible Cloudflare Turnstile widget — renders nothing visible. */}
      <div ref={turnstile.widgetRef} />

      {status === 'error' && (
        <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded-full bg-terracotta-deep px-8 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
