'use client';

import { useEffect, useRef, useState } from 'react';
import PhoneInput from '@/components/PhoneInput';
import { waiverContent, WAIVER_VERSION } from '@/lib/data';

// Lambda Function URLs always carry a trailing slash; strip it so we don't post
// to `…on.aws//waiver` (which the handler's route table 404s on).
const API_URL = (process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '').replace(/\/$/, '');

// Cloudflare Turnstile site key (public). When unset (e.g. local dev with no key),
// the widget is skipped entirely and the form posts with an empty token — the
// Lambda only enforces verification when its secret is configured.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

type Status = 'idle' | 'submitting' | 'success' | 'error';

// Minimal typing for the Turnstile global injected by the api.js script.
interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileLoad?: () => void;
  }
}

const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';

type WaiverState = {
  fullName: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  emergencyName: string;
  emergencyPhone: string;
  medicalDetails: string;
  photoConsent: '' | 'yes' | 'no';
  groupChat: '' | 'yes' | 'no';
  acceptRisk: boolean;
  acceptMedical: boolean;
  acceptConsent: boolean;
  signatureName: string;
  guardianName: string;
  guardianRelationship: string;
  guardianSignature: string;
};

const EMPTY: WaiverState = {
  fullName: '',
  dateOfBirth: '',
  address: '',
  phone: '',
  email: '',
  emergencyName: '',
  emergencyPhone: '',
  medicalDetails: '',
  photoConsent: '',
  groupChat: '',
  acceptRisk: false,
  acceptMedical: false,
  acceptConsent: false,
  signatureName: '',
  guardianName: '',
  guardianRelationship: '',
  guardianSignature: '',
};

// Whole years old from a YYYY-MM-DD string, or null if not a valid past date.
// Mirrors ageFromDob in lambda/src/lib/validation.ts (client-side toggle only;
// the server re-checks and is authoritative).
function ageFromDob(dob: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  if (d.getTime() > now.getTime()) return null;
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export default function WaiverForm() {
  const [form, setForm] = useState<WaiverState>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [signedCopy, setSignedCopy] = useState<{ state: WaiverState; signedAt: string } | null>(null);

  const honeypotRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');
  const tokenRef = useRef<string>('');

  const age = ageFromDob(form.dateOfBirth);
  const isMinor = age !== null && age < 18;

  function update<K extends keyof WaiverState>(key: K, value: WaiverState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Load + render the invisible Turnstile widget once on mount.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    function renderWidget() {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => {
          tokenRef.current = token;
        },
        'expired-callback': () => {
          tokenRef.current = '';
          window.turnstile?.reset(widgetIdRef.current);
        },
        'error-callback': () => {
          tokenRef.current = '';
        },
      });
    }

    window.onTurnstileLoad = renderWidget;

    if (window.turnstile) {
      renderWidget();
    } else if (!document.querySelector(`script[src="${TURNSTILE_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = '';
      }
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (TURNSTILE_SITE_KEY && !tokenRef.current) {
      setStatus('error');
      setError('Still verifying you’re human — please wait a moment and try again.');
      if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
      return;
    }

    setStatus('submitting');
    setError('');

    const payload = {
      ...form,
      company: honeypotRef.current?.value ?? '', // honeypot
      turnstileToken: tokenRef.current,
    };

    try {
      const res = await fetch(`${API_URL}/waiver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setSignedCopy({ state: form, signedAt: new Date().toISOString() });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      tokenRef.current = '';
      if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
    }
  }

  if (status === 'success' && signedCopy) {
    return (
      <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center">
        <p className="font-display text-2xl text-mustard">Thank you! 🌀</p>
        <p className="mt-2 text-cream/80">
          Your waiver has been signed and sent to Osha. See you in class!
        </p>
        <button
          type="button"
          onClick={() => downloadCopy(signedCopy.state, signedCopy.signedAt)}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-cream/25 px-6 py-2.5 text-sm font-semibold text-cream/85 transition-colors hover:border-mustard hover:text-cream"
        >
          Download your copy
        </button>
      </div>
    );
  }

  const field =
    'w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-3 text-cream placeholder-cream/40 outline-none transition focus:border-mustard focus:ring-2 focus:ring-mustard/20';
  const labelText = 'mb-1.5 block text-sm font-semibold text-cream/80';

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Honeypot — hidden from humans, bots fill it and get dropped. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input ref={honeypotRef} type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* --- Personal details --- */}
      <fieldset className="space-y-5">
        <legend className="mb-3 font-display text-xl text-cream">Personal details</legend>
        <label className="block">
          <span className={labelText}>Full name</span>
          <input
            type="text"
            required
            maxLength={100}
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className={field}
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={labelText}>Date of birth</span>
            <input
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => update('dateOfBirth', e.target.value)}
              className={field}
            />
          </label>
          <label className="block">
            <span className={labelText}>Email</span>
            <input
              type="email"
              required
              maxLength={320}
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={field}
            />
          </label>
        </div>
        <label className="block">
          <span className={labelText}>Address</span>
          <textarea
            required
            maxLength={300}
            rows={2}
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className={field}
          />
        </label>
        <div className="block">
          <span className={labelText}>Phone number</span>
          <PhoneInput value={form.phone} onChange={(v) => update('phone', v)} />
        </div>
      </fieldset>

      {/* --- Emergency contact --- */}
      <fieldset className="space-y-5">
        <legend className="mb-3 font-display text-xl text-cream">Emergency contact</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={labelText}>Name</span>
            <input
              type="text"
              required
              maxLength={100}
              value={form.emergencyName}
              onChange={(e) => update('emergencyName', e.target.value)}
              className={field}
            />
          </label>
          <div className="block">
            <span className={labelText}>Phone number</span>
            <PhoneInput value={form.emergencyPhone} onChange={(v) => update('emergencyPhone', v)} />
          </div>
        </div>
      </fieldset>

      {/* --- Assumption of risk --- */}
      <Clause heading="Assumption of risk" body={waiverContent.assumptionOfRisk}>
        <Checkbox
          checked={form.acceptRisk}
          onChange={(v) => update('acceptRisk', v)}
          label="I acknowledge and accept the assumption of risk described above."
        />
      </Clause>

      {/* --- Medical representation --- */}
      <Clause heading="Medical representation" body={waiverContent.medicalRepresentation}>
        <label className="block">
          <span className={labelText}>
            Any medical conditions or concerns to share? <span className="text-cream/50">(optional)</span>
          </span>
          <textarea
            maxLength={3000}
            rows={3}
            value={form.medicalDetails}
            onChange={(e) => update('medicalDetails', e.target.value)}
            placeholder="Leave blank if none apply."
            className={field}
          />
        </label>
        <Checkbox
          checked={form.acceptMedical}
          onChange={(v) => update('acceptMedical', v)}
          label="I confirm the medical representation above is accurate."
        />
      </Clause>

      {/* --- Photography & video release --- */}
      <Clause heading="Photography &amp; video release" body={waiverContent.photoRelease}>
        <YesNo
          legend="Do you consent to photos and video being used?"
          name="photoConsent"
          value={form.photoConsent}
          onChange={(v) => update('photoConsent', v)}
        />
      </Clause>

      {/* --- Informed consent --- */}
      <fieldset className="space-y-4">
        <legend className="mb-1 font-display text-xl text-cream">Informed consent</legend>
        <ul className="list-disc space-y-2 pl-5 text-cream/80">
          {waiverContent.informedConsentPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <YesNo
          legend="Would you like to join Flowsha’s hula-hoop community group chat on WhatsApp?"
          name="groupChat"
          value={form.groupChat}
          onChange={(v) => update('groupChat', v)}
        />
      </fieldset>

      {/* --- Signature / release --- */}
      <fieldset className="space-y-5 rounded-2xl border border-cream/10 bg-forest/30 p-5 sm:p-6">
        <legend className="px-2 font-display text-xl text-cream">Sign &amp; accept</legend>
        <p className="text-cream/80">{waiverContent.release}</p>
        <Checkbox
          checked={form.acceptConsent}
          onChange={(v) => update('acceptConsent', v)}
          label="I have read, understood and accept this waiver — I understand it is a release of liability."
        />

        {isMinor ? (
          <div className="space-y-5 rounded-xl border border-mustard/30 bg-mustard/5 p-4">
            <p className="text-sm text-mustard">
              This participant is under 18, so a parent or guardian must sign on their behalf.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelText}>Parent / guardian name</span>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.guardianName}
                  onChange={(e) => update('guardianName', e.target.value)}
                  className={field}
                />
              </label>
              <label className="block">
                <span className={labelText}>Relationship to participant</span>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.guardianRelationship}
                  onChange={(e) => update('guardianRelationship', e.target.value)}
                  className={field}
                />
              </label>
            </div>
            <label className="block">
              <span className={labelText}>Guardian signature (type full name)</span>
              <input
                type="text"
                required
                maxLength={100}
                value={form.guardianSignature}
                onChange={(e) => update('guardianSignature', e.target.value)}
                className={field}
              />
            </label>
          </div>
        ) : (
          <label className="block">
            <span className={labelText}>Signature (type your full name)</span>
            <input
              type="text"
              required
              maxLength={100}
              value={form.signatureName}
              onChange={(e) => update('signatureName', e.target.value)}
              className={field}
            />
          </label>
        )}
        <p className="text-xs text-cream/50">
          Signing electronically records the date, your IP address and this form’s version
          ({WAIVER_VERSION}) as proof of consent.
        </p>
      </fieldset>

      {/* Invisible Cloudflare Turnstile widget — renders nothing visible. */}
      <div ref={widgetRef} />

      {status === 'error' && (
        <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded-full bg-terracotta px-8 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Signing…' : 'Sign & submit waiver'}
      </button>
    </form>
  );
}

// --- Presentational helpers -------------------------------------------------

function Clause({
  heading,
  body,
  children,
}: {
  heading: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 font-display text-xl text-cream">{heading}</legend>
      <p className="text-cream/80">{body}</p>
      {children}
    </fieldset>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-cream/90">
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-mustard"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function YesNo({
  legend,
  name,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  value: '' | 'yes' | 'no';
  onChange: (v: 'yes' | 'no') => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-semibold text-cream/80">{legend}</legend>
      <div className="flex gap-3">
        {(['yes', 'no'] as const).map((opt) => (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
              value === opt
                ? 'border-mustard bg-mustard/15 text-cream'
                : 'border-cream/20 text-cream/70 hover:border-cream/40'
            }`}
          >
            <input
              type="radio"
              required
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            {opt === 'yes' ? 'Yes' : 'No'}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// --- Downloadable copy for the signer (best-effort until SES prod access) ---
function downloadCopy(s: WaiverState, signedAt: string) {
  const isMinor = s.guardianName.trim() !== '';
  const yn = (v: string) => (v === 'yes' ? 'Yes' : 'No');
  const lines = [
    'FLOWSHA — PAR-Q & Informed Consent Form',
    `Signed: ${new Date(signedAt).toLocaleString('en-GB')}`,
    `Form version: ${WAIVER_VERSION}`,
    '',
    'PERSONAL DETAILS',
    `Full name: ${s.fullName}`,
    `Date of birth: ${s.dateOfBirth}`,
    `Address: ${s.address}`,
    `Phone: ${s.phone}`,
    `Email: ${s.email}`,
    '',
    'EMERGENCY CONTACT',
    `Name: ${s.emergencyName}`,
    `Phone: ${s.emergencyPhone}`,
    '',
    'ASSUMPTION OF RISK',
    waiverContent.assumptionOfRisk,
    '',
    'MEDICAL REPRESENTATION',
    waiverContent.medicalRepresentation,
    s.medicalDetails ? `Additional details: ${s.medicalDetails}` : '',
    '',
    'PHOTOGRAPHY & VIDEO RELEASE',
    waiverContent.photoRelease,
    `Consent to photos/video: ${yn(s.photoConsent)}`,
    '',
    'INFORMED CONSENT',
    ...waiverContent.informedConsentPoints.map((p) => `- ${p}`),
    `Community group chat: ${yn(s.groupChat)}`,
    '',
    'DECLARATION',
    waiverContent.release,
    isMinor
      ? `Signed by (parent/guardian): ${s.guardianSignature} — ${s.guardianRelationship} of ${s.fullName}`
      : `Signed by: ${s.signatureName}`,
  ].filter((line) => line !== '');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'flowsha-waiver.txt';
  a.click();
  URL.revokeObjectURL(url);
}
