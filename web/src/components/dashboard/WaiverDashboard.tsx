'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { SkeletonCardList, SkeletonGroup, SkeletonStats } from '@/components/Skeleton';
import { apiGet, errorMessage } from '@/lib/api';
import { FilterFooter, FilterPanel, InfiniteScroll, SearchInput, SegmentedFilter } from './Filters';

// Cards rendered per "page"; keeps the DOM small no matter how many records exist.
const PAGE_SIZE = 20;

export type WaiverItem = {
  id: string;
  createdAt: string;
  fullName?: string;
  dateOfBirth?: string;
  address?: string;
  phone?: string;
  email?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  medicalDetails?: string;
  photoConsent?: string;
  groupChat?: string;
  signatureName?: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianSignature?: string;
  // Audit trail stamped by the Lambda.
  signedIp?: string;
  userAgent?: string;
  waiverVersion?: string;
};

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

function yesNo(v?: string): string {
  if (v === 'yes') return 'Yes';
  if (v === 'no') return 'No';
  return '—';
}

type Status = 'loading' | 'loaded' | 'error';

// Content only — Clerk gating + header/nav come from DashboardShell.
export default function WaiverDashboard() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<WaiverItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const data = await apiGet<{ items: WaiverItem[] }>('/waiver', token);
        const list: WaiverItem[] = Array.isArray(data.items) ? data.items : [];
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
  const [fAge, setFAge] = useState(''); // '' | 'minor' | 'adult'
  const [fPhoto, setFPhoto] = useState('');
  const [fChat, setFChat] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const isMinor = (i.guardianName ?? '') !== '';
      if (fAge === 'minor' && !isMinor) return false;
      if (fAge === 'adult' && isMinor) return false;
      if (fPhoto && i.photoConsent !== fPhoto) return false;
      if (fChat && i.groupChat !== fChat) return false;
      if (q) {
        const hay = [i.fullName, i.email, i.phone, i.address, i.emergencyName, i.guardianName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, fAge, fPhoto, fChat]);

  const filtersActive = Boolean(query || fAge || fPhoto || fChat);
  const clearFilters = () => {
    setQuery('');
    setFAge('');
    setFPhoto('');
    setFChat('');
  };

  // Reveal cards in pages; reset to the first page when the query/filters change.
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, fAge, fPhoto, fChat]);
  const showMore = useCallback(() => setVisible((v) => v + PAGE_SIZE), []);

  // Stats reflect the filtered slice (equals all records when no filter).
  const minors = filtered.filter((i) => (i.guardianName ?? '') !== '').length;
  const photoYes = filtered.filter((i) => i.photoConsent === 'yes').length;
  const chatYes = filtered.filter((i) => i.groupChat === 'yes').length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Signed waivers</h1>
          <p className="mt-1 text-cream/70">
            {status === 'loaded'
              ? `${items.length} ${items.length === 1 ? 'waiver' : 'waivers'}`
              : status === 'loading'
                ? 'Loading…'
                : 'Could not load waivers'}
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
        <SkeletonGroup label="Loading waivers…">
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
          No waivers yet. Signed forms will appear here as they come in.
        </div>
      )}

      {status === 'loaded' && items.length > 0 && (
        <>
          <FilterPanel>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search name, email, phone or address…"
            />
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <SegmentedFilter
                label="Age"
                value={fAge}
                onChange={setFAge}
                options={[
                  { value: 'adult', label: '18+' },
                  { value: 'minor', label: 'Under 18' },
                ]}
              />
              <SegmentedFilter
                label="Photo"
                value={fPhoto}
                onChange={setFPhoto}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
              />
              <SegmentedFilter
                label="Group chat"
                value={fChat}
                onChange={setFChat}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
              />
            </div>
            <FilterFooter
              matched={filtered.length}
              total={items.length}
              noun="waiver"
              active={filtersActive}
              onClear={clearFilters}
            />
          </FilterPanel>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center text-cream/70">
              No waivers match your search.
            </div>
          ) : (
            <>
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Waivers" value={String(filtered.length)} />
                <Stat label="Under 18" value={String(minors)} />
                <Stat label="Photo: yes" value={String(photoYes)} />
                <Stat label="Group chat: yes" value={String(chatYes)} />
              </div>

              <ul className="space-y-4">
                {filtered.slice(0, visible).map((item) => (
                  <SubmissionCard key={item.id} item={item} />
                ))}
              </ul>
              <InfiniteScroll
                visible={Math.min(visible, filtered.length)}
                total={filtered.length}
                noun="waiver"
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

function SubmissionCard({ item }: { item: WaiverItem }) {
  const isMinor = (item.guardianName ?? '') !== '';
  const name = item.fullName || 'Unnamed';

  return (
    <li className="rounded-3xl border border-cream/10 bg-forest/40 p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl text-cream">
          {name}
          {isMinor && (
            <span className="ml-2 rounded-full bg-terracotta-light/20 px-2 py-0.5 align-middle text-xs text-terracotta-light">
              Under 18
            </span>
          )}
        </h2>
        <span className="text-sm text-cream/50">{formatDate(item.createdAt)}</span>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth">{item.dateOfBirth || '—'}</Field>
        <Field label="Contact">
          <div className="space-y-0.5">
            {item.email ? <div>{item.email}</div> : null}
            {item.phone ? <div>{item.phone}</div> : null}
            {!item.email && !item.phone ? <span className="text-cream/50">—</span> : null}
          </div>
        </Field>
        {item.address ? <Field label="Address">{item.address}</Field> : null}
        <Field label="Emergency contact">
          {item.emergencyName || item.emergencyPhone
            ? `${item.emergencyName ?? ''}${item.emergencyPhone ? ` — ${item.emergencyPhone}` : ''}`
            : '—'}
        </Field>
        {item.medicalDetails ? <Field label="Medical details">{item.medicalDetails}</Field> : null}
        <Field label="Photo/video consent">{yesNo(item.photoConsent)}</Field>
        <Field label="Community chat">{yesNo(item.groupChat)}</Field>
        <Field label="Signed by">
          {isMinor
            ? `${item.guardianSignature ?? ''} (${item.guardianRelationship ?? 'guardian'})`
            : item.signatureName || '—'}
        </Field>
        <Field label="Audit trail">
          <div className="space-y-0.5 text-sm text-cream/70">
            <div>Version: {item.waiverVersion ?? '—'}</div>
            <div>IP: {item.signedIp ?? '—'}</div>
          </div>
        </Field>
      </dl>
    </li>
  );
}

// --- CSV export (client-side blob download) ---
const CSV_COLUMNS: (keyof WaiverItem)[] = [
  'createdAt',
  'fullName',
  'dateOfBirth',
  'address',
  'phone',
  'email',
  'emergencyName',
  'emergencyPhone',
  'medicalDetails',
  'photoConsent',
  'groupChat',
  'signatureName',
  'guardianName',
  'guardianRelationship',
  'guardianSignature',
  'waiverVersion',
  'signedIp',
  'userAgent',
];

function csvCell(value: unknown): string {
  const s = Array.isArray(value) ? value.join('; ') : value == null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(items: WaiverItem[]) {
  const header = CSV_COLUMNS.join(',');
  const rows = items.map((item) => CSV_COLUMNS.map((c) => csvCell(item[c])).join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'flowsha-waivers.csv';
  a.click();
  URL.revokeObjectURL(url);
}
