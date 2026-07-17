'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { feedbackQuestions } from '@/lib/data';
import { LoadingBlock } from '@/components/Spinner';

const API_URL = (process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '').replace(/\/$/, '');

export type FeedbackItem = {
  id: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  newsletter?: boolean;
  difficulty?: number | null;
  supported?: number | null;
  preferredSlots?: string[];
  convenienceNote?: string;
  improvements?: string;
  source?: string;
  sourceOther?: string;
  learningStyle?: string;
  learningStyleOther?: string;
  courseInterest?: string;
  groupChat?: string;
};

// value → human label lookups, reused from the survey's single-select options.
const optionLabels: Record<string, Record<string, string>> = {};
for (const q of feedbackQuestions) {
  if (q.kind === 'single') {
    optionLabels[q.key] = Object.fromEntries(q.options.map((o) => [o.value, o.label]));
  }
}
function label(key: string, value?: string): string {
  if (!value) return '';
  return optionLabels[key]?.[value] ?? value;
}

// "tue-evening" → "Tue evening"
function formatSlot(slot: string): string {
  return slot
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function avg(nums: number[]): string {
  if (nums.length === 0) return '—';
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
}

type Status = 'loading' | 'loaded' | 'error';

// Content only — Clerk gating + header/nav come from DashboardShell.
export default function FeedbackDashboard() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/feedback`, {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Request failed (${res.status}).`);
        }
        const data = await res.json();
        const list: FeedbackItem[] = Array.isArray(data.items) ? data.items : [];
        list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); // newest first
        if (!cancelled) {
          setItems(list);
          setStatus('loaded');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong.');
          setStatus('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const difficulties = items.map((i) => i.difficulty).filter((n): n is number => typeof n === 'number');
  const supports = items.map((i) => i.supported).filter((n): n is number => typeof n === 'number');
  const newsletterCount = items.filter((i) => i.newsletter).length;
  const courseYes = items.filter((i) => i.courseInterest === 'yes').length;
  const courseMaybe = items.filter((i) => i.courseInterest === 'maybe').length;
  const groupYes = items.filter((i) => i.groupChat === 'yes').length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Class feedback</h1>
            <p className="mt-1 text-cream/70">
              {status === 'loaded'
                ? `${items.length} ${items.length === 1 ? 'response' : 'responses'}`
                : status === 'loading'
                  ? 'Loading…'
                  : 'Could not load responses'}
            </p>
          </div>
          {status === 'loaded' && items.length > 0 && (
            <button
              type="button"
              onClick={() => downloadCsv(items)}
              className="inline-flex items-center justify-center rounded-full border border-cream/25 px-5 py-2.5 text-sm font-semibold text-cream/85 transition-colors hover:border-mustard hover:text-cream"
            >
              Export CSV
            </button>
          )}
        </div>

        {status === 'loading' && <LoadingBlock />}

        {status === 'error' && (
          <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta">{error}</p>
        )}

        {status === 'loaded' && items.length === 0 && (
          <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center text-cream/70">
            No feedback yet. Responses will appear here as they come in.
          </div>
        )}

        {status === 'loaded' && items.length > 0 && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Responses" value={String(items.length)} />
              <Stat label="Avg difficulty" value={`${avg(difficulties)}${difficulties.length ? '/10' : ''}`} />
              <Stat label="Avg support" value={`${avg(supports)}${supports.length ? '/10' : ''}`} />
              <Stat label="Newsletter" value={String(newsletterCount)} />
              <Stat label="Course: yes/maybe" value={`${courseYes}/${courseMaybe}`} />
              <Stat label="Group chat: yes" value={String(groupYes)} />
            </div>

            <ul className="space-y-4">
              {items.map((item) => (
                <SubmissionCard key={item.id} item={item} />
              ))}
            </ul>
          </>
        )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-forest/40 p-4">
      <div className="font-display text-2xl text-mustard">{value}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wide text-cream/55">{label}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-cream/50">{label}</dt>
      <dd className="mt-0.5 text-cream/90">{children}</dd>
    </div>
  );
}

function SubmissionCard({ item }: { item: FeedbackItem }) {
  const name = [item.firstName, item.lastName].filter(Boolean).join(' ') || 'Anonymous';
  const slots = (item.preferredSlots ?? []).map(formatSlot);
  const source = [label('source', item.source), item.sourceOther].filter(Boolean).join(' — ');
  const style = [label('learningStyle', item.learningStyle), item.learningStyleOther]
    .filter(Boolean)
    .join(' — ');

  return (
    <li className="rounded-3xl border border-cream/10 bg-forest/40 p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl text-cream">{name}</h2>
        <span className="text-sm text-cream/50">{formatDate(item.createdAt)}</span>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Field label="Contact">
          <div className="space-y-0.5">
            {item.email ? <div>{item.email}</div> : null}
            {item.phone ? <div>{item.phone}</div> : null}
            {!item.email && !item.phone ? <span className="text-cream/50">—</span> : null}
            {item.newsletter ? (
              <span className="mt-1 inline-block rounded-full bg-mustard/20 px-2 py-0.5 text-xs text-mustard">
                Newsletter opt-in
              </span>
            ) : null}
          </div>
        </Field>

        <Field label="Ratings">
          <div className="flex gap-6">
            <span>Difficulty: {typeof item.difficulty === 'number' ? `${item.difficulty}/10` : '—'}</span>
            <span>Support: {typeof item.supported === 'number' ? `${item.supported}/10` : '—'}</span>
          </div>
        </Field>

        {slots.length > 0 && (
          <Field label="Better times">
            <div className="flex flex-wrap gap-1.5">
              {slots.map((s) => (
                <span key={s} className="rounded-full bg-cream/10 px-2.5 py-0.5 text-sm">
                  {s}
                </span>
              ))}
            </div>
          </Field>
        )}

        {item.convenienceNote ? <Field label="Timing note">{item.convenienceNote}</Field> : null}
        {item.improvements ? <Field label="Would change / like more">{item.improvements}</Field> : null}
        {source ? <Field label="Found via">{source}</Field> : null}
        {style ? <Field label="Learning style">{style}</Field> : null}
        {item.courseInterest ? (
          <Field label="Weekly course">{label('courseInterest', item.courseInterest)}</Field>
        ) : null}
        {item.groupChat ? (
          <Field label="Group chat">{label('groupChat', item.groupChat)}</Field>
        ) : null}
      </dl>
    </li>
  );
}

// --- CSV export (client-side blob download) ---
const CSV_COLUMNS: (keyof FeedbackItem)[] = [
  'createdAt',
  'firstName',
  'lastName',
  'email',
  'phone',
  'newsletter',
  'difficulty',
  'supported',
  'preferredSlots',
  'convenienceNote',
  'improvements',
  'source',
  'sourceOther',
  'learningStyle',
  'learningStyleOther',
  'courseInterest',
  'groupChat',
];

function csvCell(value: unknown): string {
  const s = Array.isArray(value) ? value.join('; ') : value == null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(items: FeedbackItem[]) {
  const header = CSV_COLUMNS.join(',');
  const rows = items.map((item) => CSV_COLUMNS.map((c) => csvCell(item[c])).join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'flowsha-feedback.csv';
  a.click();
  URL.revokeObjectURL(url);
}
