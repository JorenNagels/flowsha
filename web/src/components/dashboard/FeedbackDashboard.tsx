'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { feedbackQuestions } from '@/lib/data';
import { SkeletonCardList, SkeletonGroup, SkeletonStats } from '@/components/Skeleton';
import { apiGet, errorMessage } from '@/lib/api';
import { FilterFooter, FilterPanel, InfiniteScroll, SearchInput, SegmentedFilter } from './Filters';

// Cards rendered per "page"; keeps the DOM small no matter how many records exist.
const PAGE_SIZE = 20;

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
        const data = await apiGet<{ items: FeedbackItem[] }>('/feedback', token);
        const list: FeedbackItem[] = Array.isArray(data.items) ? data.items : [];
        list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); // newest first
        if (!cancelled) {
          setItems(list);
          setStatus('loaded');
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err, 'Something went wrong.'));
          setStatus('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  // --- Search + filters (client-side over the loaded records). ---
  const [query, setQuery] = useState('');
  const [fCourse, setFCourse] = useState('');
  const [fGroup, setFGroup] = useState('');
  const [fNewsletter, setFNewsletter] = useState('');
  const [fStyle, setFStyle] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (fCourse && i.courseInterest !== fCourse) return false;
      if (fGroup && i.groupChat !== fGroup) return false;
      if (fNewsletter === 'yes' && !i.newsletter) return false;
      if (fStyle && i.learningStyle !== fStyle) return false;
      if (q) {
        const hay = [
          i.firstName,
          i.lastName,
          i.email,
          i.phone,
          i.improvements,
          i.convenienceNote,
          i.sourceOther,
          i.learningStyleOther,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, fCourse, fGroup, fNewsletter, fStyle]);

  const filtersActive = Boolean(query || fCourse || fGroup || fNewsletter || fStyle);
  const clearFilters = () => {
    setQuery('');
    setFCourse('');
    setFGroup('');
    setFNewsletter('');
    setFStyle('');
  };

  // Reveal cards in pages; reset back to the first page whenever the query or
  // any filter changes so you always start at the top of a new result set.
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, fCourse, fGroup, fNewsletter, fStyle]);
  const showMore = useCallback(() => setVisible((v) => v + PAGE_SIZE), []);

  // Stats + list reflect the filtered slice (equals all records when no filter).
  const difficulties = filtered
    .map((i) => i.difficulty)
    .filter((n): n is number => typeof n === 'number');
  const supports = filtered
    .map((i) => i.supported)
    .filter((n): n is number => typeof n === 'number');
  const newsletterCount = filtered.filter((i) => i.newsletter).length;
  const courseYes = filtered.filter((i) => i.courseInterest === 'yes').length;
  const courseMaybe = filtered.filter((i) => i.courseInterest === 'maybe').length;
  const groupYes = filtered.filter((i) => i.groupChat === 'yes').length;

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
            onClick={() => downloadCsv(filtered)}
            className="inline-flex items-center justify-center rounded-full border border-cream/25 px-5 py-2.5 text-sm font-semibold text-cream/85 transition-colors hover:border-terracotta-light hover:text-cream"
          >
            Export CSV
          </button>
        )}
      </div>

      {status === 'loading' && (
        <SkeletonGroup label="Loading feedback…">
          <SkeletonStats />
          <div className="mt-6">
            <SkeletonCardList count={5} />
          </div>
        </SkeletonGroup>
      )}

      {status === 'error' && (
        <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
          {error}
        </p>
      )}

      {status === 'loaded' && items.length === 0 && (
        <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center text-cream/70">
          No feedback yet. Responses will appear here as they come in.
        </div>
      )}

      {status === 'loaded' && items.length > 0 && (
        <>
          <FilterPanel>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search name, email, phone or notes…"
            />
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <SegmentedFilter
                label="Course"
                value={fCourse}
                onChange={setFCourse}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'maybe', label: 'Maybe' },
                  { value: 'no', label: 'No' },
                ]}
              />
              <SegmentedFilter
                label="Group chat"
                value={fGroup}
                onChange={setFGroup}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
              />
              <SegmentedFilter
                label="Newsletter"
                value={fNewsletter}
                onChange={setFNewsletter}
                options={[{ value: 'yes', label: 'Opted in' }]}
              />
              <SegmentedFilter
                label="Style"
                value={fStyle}
                onChange={setFStyle}
                options={[
                  { value: 'tricks', label: 'Tricks' },
                  { value: 'flow', label: 'Flow' },
                  { value: 'mix', label: 'Mix' },
                ]}
              />
            </div>
            <FilterFooter
              matched={filtered.length}
              total={items.length}
              noun="response"
              active={filtersActive}
              onClear={clearFilters}
            />
          </FilterPanel>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center text-cream/70">
              No responses match your search.
            </div>
          ) : (
            <>
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <Stat label="Responses" value={String(filtered.length)} />
                <Stat
                  label="Avg difficulty"
                  value={`${avg(difficulties)}${difficulties.length ? '/10' : ''}`}
                />
                <Stat
                  label="Avg support"
                  value={`${avg(supports)}${supports.length ? '/10' : ''}`}
                />
                <Stat label="Newsletter" value={String(newsletterCount)} />
                <Stat label="Course: yes/maybe" value={`${courseYes}/${courseMaybe}`} />
                <Stat label="Group chat: yes" value={String(groupYes)} />
              </div>

              <ul className="space-y-4">
                {filtered.slice(0, visible).map((item) => (
                  <SubmissionCard key={item.id} item={item} />
                ))}
              </ul>
              <InfiniteScroll
                visible={Math.min(visible, filtered.length)}
                total={filtered.length}
                noun="response"
                onMore={showMore}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-forest/40 p-4">
      <div className="font-display text-2xl text-terracotta">{value}</div>
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
              <span className="mt-1 inline-block rounded-full bg-terracotta-light/20 px-2 py-0.5 text-xs text-terracotta-light">
                Newsletter opt-in
              </span>
            ) : null}
          </div>
        </Field>

        <Field label="Ratings">
          <div className="flex gap-6">
            <span>
              Difficulty: {typeof item.difficulty === 'number' ? `${item.difficulty}/10` : '—'}
            </span>
            <span>
              Support: {typeof item.supported === 'number' ? `${item.supported}/10` : '—'}
            </span>
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
        {item.improvements ? (
          <Field label="Would change / like more">{item.improvements}</Field>
        ) : null}
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
