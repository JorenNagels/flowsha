'use client';

import { useEffect, useRef, useState } from 'react';
import { apiPost, errorMessage } from '@/lib/api';
import { useTurnstile } from '@/hooks/useTurnstile';
import { feedbackQuestions, type FeedbackQuestion } from '@/lib/data';
import PhoneInput from '@/components/PhoneInput';

type Status = 'idle' | 'submitting' | 'success' | 'error';

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
  'w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-3 text-cream placeholder-cream/40 outline-none transition focus:border-terracotta-light focus:ring-2 focus:ring-terracotta-light/20';

const labelText = 'mb-1.5 block text-sm font-semibold text-cream/80';

// Rough email shape check — mirrors the Lambda's EMAIL_RE (lib/validation.ts) so
// the personal step catches a malformed address before advancing, not just on submit.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Pill / chip styling for scale numbers, options and schedule slots.
function chip(active: boolean): string {
  return [
    'cursor-pointer select-none rounded-full border px-4 py-2 text-sm transition',
    active
      ? 'border-terracotta-light bg-terracotta-light font-semibold text-forest-dark'
      : 'border-cream/20 text-cream/80 hover:border-terracotta-light/70 hover:text-cream',
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

  const turnstile = useTurnstile();
  const honeypotRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const personalValid =
    answers.firstName.trim() !== '' &&
    answers.lastName.trim() !== '' &&
    (answers.email.trim() !== '' || answers.phone.trim() !== '');

  const isLast = step === totalSteps - 1;
  const currentQuestion = step > 0 ? feedbackQuestions[step - 1] : null;

  function goNext() {
    // Validate the email's shape before leaving the personal step so a typo is
    // caught here rather than after filling in the whole survey.
    if (step === 0 && answers.email.trim() !== '' && !EMAIL_RE.test(answers.email.trim())) {
      setStatus('error');
      setError('Please enter a valid email address.');
      return;
    }
    setStatus('idle');
    setError('');
    if (step < totalSteps - 1) setStep(step + 1);
  }

  function goBack() {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  }

  async function submit() {
    // Turnstile is configured but hasn't produced a token yet — ask them to retry.
    if (turnstile.enabled && !turnstile.getToken()) {
      setStatus('error');
      setError('Still checking you’re human. Give it a moment and try again.');
      turnstile.reset();
      return;
    }

    setStatus('submitting');
    setError('');

    const payload = {
      ...answers,
      company: honeypotRef.current?.value ?? '', // honeypot
      turnstileToken: turnstile.getToken(),
    };

    try {
      await apiPost('/feedback', payload);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(errorMessage(err));
    } finally {
      // Tokens are single-use — get a fresh one for any retry.
      turnstile.reset();
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center">
        <p className="font-display text-2xl text-terracotta">Thanks for your feedback! 🌀</p>
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
          <span>
            {step === 0 ? 'Your details' : `Question ${step} of ${feedbackQuestions.length}`}
          </span>
          <span>
            {step + 1} / {totalSteps}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
          <div
            className="h-full rounded-full bg-terracotta transition-all duration-300"
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
      <div ref={turnstile.widgetRef} />

      {status === 'error' && (
        <p className="mt-5 rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
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
          className="inline-flex items-center justify-center rounded-full bg-terracotta-deep px-8 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
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
  return <span className="text-terracotta-light"> *</span>;
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
          Just so I know whose feedback this is. Pop in your email or phone number so I can get back
          to you.
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
          className="mt-0.5 h-5 w-5 shrink-0 accent-terracotta"
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
          {/* Responsive scale: a 5-col grid on mobile (two even rows of five,
              e.g. 1–5 / 6–10, with comfortable tap targets), collapsing to a
              single row of N equal segments from `sm` up. */}
          <div
            className="grid grid-cols-5 gap-1.5 sm:gap-2 sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            style={{ '--cols': question.max - question.min + 1 } as React.CSSProperties}
          >
            {Array.from(
              { length: question.max - question.min + 1 },
              (_, i) => question.min + i,
            ).map((n) => {
              const active = answers[question.key] === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => set(question.key, active ? null : n)}
                  aria-pressed={active}
                  className={`min-w-0 rounded-lg border py-3 text-center text-sm tabular-nums transition ${
                    active
                      ? 'border-terracotta-light bg-terracotta-light font-semibold text-forest-dark'
                      : 'border-cream/20 text-cream/80 hover:border-terracotta-light/70 hover:text-cream'
                  }`}
                >
                  {n}
                </button>
              );
            })}
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
                onClick={() =>
                  set(question.key, answers[question.key] === opt.value ? '' : opt.value)
                }
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
                                ? 'border-terracotta-light bg-terracotta-light text-forest-dark'
                                : 'border-cream/15 bg-forest/30 text-cream/40 hover:border-terracotta-light/60',
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
