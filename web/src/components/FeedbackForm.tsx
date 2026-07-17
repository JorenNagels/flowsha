'use client';

import { useEffect, useRef, useState } from 'react';
import { feedbackQuestions, type FeedbackQuestion } from '@/lib/data';
import PhoneInput from '@/components/PhoneInput';

// Lambda Function URLs always carry a trailing slash; strip it so we don't post
// to `…on.aws//feedback` (which the handler's route table 404s on).
const API_URL = (process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '').replace(/\/$/, '');

// Cloudflare Turnstile site key (public). When unset (e.g. local dev with no key),
// the widget is skipped and the form posts an empty token — the Lambda only
// enforces verification when its secret is configured.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';

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

type Answers = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  newsletter: boolean;
  difficulty: number | null;
  supported: number | null;
  preferredSlots: string[];
  convenienceNote: string;
  improvements: string;
  source: string;
  sourceOther: string;
  learningStyle: string;
  learningStyleOther: string;
  courseInterest: string;
  groupChat: string;
};

const initialAnswers: Answers = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  newsletter: false,
  difficulty: null,
  supported: null,
  preferredSlots: [],
  convenienceNote: '',
  improvements: '',
  source: '',
  sourceOther: '',
  learningStyle: '',
  learningStyleOther: '',
  courseInterest: '',
  groupChat: '',
};

const field =
  'w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-3 text-cream placeholder-cream/40 outline-none transition focus:border-mustard focus:ring-2 focus:ring-mustard/20';

const labelText = 'mb-1.5 block text-sm font-semibold text-cream/80';

// Pill / chip styling for scale numbers, options and schedule slots.
function chip(active: boolean): string {
  return [
    'cursor-pointer select-none rounded-full border px-4 py-2 text-sm transition',
    active
      ? 'border-mustard bg-mustard font-semibold text-forest-dark'
      : 'border-cream/20 text-cream/80 hover:border-mustard/70 hover:text-cream',
  ].join(' ');
}

// Has the current question been answered? Drives the "Skip" vs "Continue" label.
function isAnswered(q: FeedbackQuestion, a: Answers): boolean {
  switch (q.kind) {
    case 'scale':
      return a[q.key] !== null;
    case 'text':
      return a[q.key].trim() !== '';
    case 'schedule':
      return a.preferredSlots.length > 0 || a.convenienceNote.trim() !== '';
    case 'single': {
      const v = a[q.key];
      if (v === '') return false;
      if (q.otherKey && v === 'other') return a[q.otherKey].trim() !== '';
      return true;
    }
  }
}

export default function FeedbackForm() {
  // step 0 = personal info; steps 1..N = feedbackQuestions[step - 1].
  const totalSteps = feedbackQuestions.length + 1;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');
  const tokenRef = useRef<string>('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
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

  const personalValid =
    answers.firstName.trim() !== '' &&
    answers.lastName.trim() !== '' &&
    (answers.email.trim() !== '' || answers.phone.trim() !== '');

  const isLast = step === totalSteps - 1;
  const currentQuestion = step > 0 ? feedbackQuestions[step - 1] : null;

  function goNext() {
    setError('');
    if (step < totalSteps - 1) setStep(step + 1);
  }

  function goBack() {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  }

  async function submit() {
    // Turnstile is configured but hasn't produced a token yet — ask them to retry.
    if (TURNSTILE_SITE_KEY && !tokenRef.current) {
      setStatus('error');
      setError('Still checking you’re human. Give it a moment and try again.');
      if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
      return;
    }

    setStatus('submitting');
    setError('');

    const payload = {
      ...answers,
      company: honeypotRef.current?.value ?? '', // honeypot
      turnstileToken: tokenRef.current,
    };

    try {
      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      // Tokens are single-use — get a fresh one for any retry.
      tokenRef.current = '';
      if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center">
        <p className="font-display text-2xl text-mustard">Thanks for your feedback! 🌀</p>
        <p className="mt-2 text-cream/80">
          It really helps me shape the classes. See you at the next one!
        </p>
      </div>
    );
  }

  const progressPct = ((step + 1) / totalSteps) * 100;
  // On question steps, the primary button reads "Skip" until the question is answered.
  const primaryLabel =
    status === 'submitting'
      ? 'Sending…'
      : isLast
        ? 'Submit'
        : currentQuestion && !isAnswered(currentQuestion, answers)
          ? 'Skip'
          : 'Continue';

  return (
    <div className="rounded-3xl border border-cream/10 bg-forest/40 p-6 sm:p-8">
      {/* Honeypot — hidden from humans, bots fill it and get dropped. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input ref={honeypotRef} type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-cream/60">
          <span>{step === 0 ? 'Your details' : `Question ${step} of ${feedbackQuestions.length}`}</span>
          <span>
            {step + 1} / {totalSteps}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
          <div
            className="h-full rounded-full bg-mustard transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {step === 0 ? (
        <PersonalStep answers={answers} set={set} />
      ) : (
        <QuestionStep question={currentQuestion!} answers={answers} set={set} />
      )}

      {/* Invisible Cloudflare Turnstile widget — renders nothing visible. */}
      <div ref={widgetRef} />

      {status === 'error' && (
        <p className="mt-5 rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            disabled={status === 'submitting'}
            className="inline-flex items-center justify-center rounded-full border border-cream/25 px-6 py-3 text-sm font-semibold text-cream/85 transition-colors hover:border-cream/50 disabled:opacity-60"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={isLast ? submit : goNext}
          disabled={(step === 0 && !personalValid) || status === 'submitting'}
          className="inline-flex items-center justify-center rounded-full bg-terracotta px-8 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
        >
          {step === 0 ? 'Continue' : primaryLabel}
        </button>
      </div>
    </div>
  );
}

type StepProps = {
  answers: Answers;
  set: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
};

// Red asterisk marking a required field.
function Star() {
  return <span className="text-terracotta"> *</span>;
}

function PersonalStep({ answers, set }: StepProps) {
  // Only one of email/phone is required, so a filled field clears the other's
  // star: each is required only while the other is still empty.
  const emailRequired = answers.phone.trim() === '';
  const phoneRequired = answers.email.trim() === '';

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl text-cream">A little about you</h2>
        <p className="mt-1 text-sm text-cream/70">
          Just so I know whose feedback this is. Pop in your email or phone number so I can get
          back to you.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelText}>
            First name
            <Star />
          </span>
          <input
            type="text"
            required
            maxLength={100}
            value={answers.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className={labelText}>
            Last name
            <Star />
          </span>
          <input
            type="text"
            required
            maxLength={100}
            value={answers.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            className={field}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelText}>
            Email
            {emailRequired && <Star />}
          </span>
          <input
            type="email"
            maxLength={320}
            value={answers.email}
            onChange={(e) => set('email', e.target.value)}
            className={field}
          />
        </label>
        <div className="block">
          <span className={labelText}>
            Phone
            {phoneRequired && <Star />}
          </span>
          <PhoneInput value={answers.phone} onChange={(v) => set('phone', v)} />
        </div>
      </div>

      <p className="-mt-2 text-xs text-cream/55">Just one of these is needed.</p>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream/15 bg-forest/30 p-4">
        <input
          type="checkbox"
          checked={answers.newsletter}
          onChange={(e) => set('newsletter', e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-mustard"
        />
        <span className="text-sm text-cream/85">
          Check this box if you’re happy for me to send you emails with updates for workshops and
          offers!
        </span>
      </label>
    </div>
  );
}

function QuestionStep({
  question,
  answers,
  set,
}: {
  question: FeedbackQuestion;
} & StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl leading-snug text-cream sm:text-2xl">
          {question.question}
        </h2>
        {question.help && <p className="mt-2 text-sm text-cream/70">{question.help}</p>}
      </div>

      {question.kind === 'scale' && (
        <div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: question.max - question.min + 1 }, (_, i) => question.min + i).map(
              (n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set(question.key, answers[question.key] === n ? null : n)}
                  className={chip(answers[question.key] === n)}
                  aria-pressed={answers[question.key] === n}
                >
                  {n}
                </button>
              ),
            )}
          </div>
          <div className="mt-2 flex justify-between text-xs text-cream/50">
            <span>{question.minLabel}</span>
            <span>{question.maxLabel}</span>
          </div>
        </div>
      )}

      {question.kind === 'text' && (
        <textarea
          rows={6}
          maxLength={3000}
          placeholder={question.placeholder}
          value={answers[question.key]}
          onChange={(e) => set(question.key, e.target.value)}
          className={field}
        />
      )}

      {question.kind === 'single' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set(question.key, answers[question.key] === opt.value ? '' : opt.value)}
                className={chip(answers[question.key] === opt.value)}
                aria-pressed={answers[question.key] === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {question.otherKey && answers[question.key] === 'other' && (
            <input
              type="text"
              maxLength={200}
              placeholder="Tell me more…"
              value={answers[question.otherKey]}
              onChange={(e) => set(question.otherKey!, e.target.value)}
              className={field}
            />
          )}
        </div>
      )}

      {question.kind === 'schedule' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1 text-center text-sm">
              <thead>
                <tr>
                  <th />
                  {question.times.map((t) => (
                    <th key={t.value} className="px-1 pb-1 font-semibold text-cream/70">
                      {t.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.days.map((d) => (
                  <tr key={d.value}>
                    <th className="pr-2 text-right font-semibold text-cream/70">{d.label}</th>
                    {question.times.map((t) => {
                      const slot = `${d.value}-${t.value}`;
                      const active = answers.preferredSlots.includes(slot);
                      return (
                        <td key={t.value}>
                          <button
                            type="button"
                            aria-pressed={active}
                            aria-label={`${d.label} ${t.label}`}
                            onClick={() =>
                              set(
                                'preferredSlots',
                                active
                                  ? answers.preferredSlots.filter((s) => s !== slot)
                                  : [...answers.preferredSlots, slot],
                              )
                            }
                            className={[
                              'h-9 w-full min-w-[3.5rem] rounded-lg border transition',
                              active
                                ? 'border-mustard bg-mustard text-forest-dark'
                                : 'border-cream/15 bg-forest/30 text-cream/40 hover:border-mustard/60',
                            ].join(' ')}
                          >
                            {active ? '✓' : ''}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <textarea
            rows={3}
            maxLength={3000}
            placeholder={question.notePlaceholder}
            value={answers.convenienceNote}
            onChange={(e) => set('convenienceNote', e.target.value)}
            className={field}
          />
        </div>
      )}
    </div>
  );
}
