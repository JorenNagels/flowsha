'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import { clerkAppearance } from '@/lib/clerkAppearance';

const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const API_URL = (process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '').replace(/\/$/, '');

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

export default function WaiverDashboard() {
  if (!CLERK_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest px-6">
        <p className="max-w-sm rounded-2xl border border-cream/10 bg-forest/40 p-6 text-center text-sm text-cream/80">
          The dashboard isn’t configured yet. Set{' '}
          <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to enable it.
        </p>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <GoToLogin />
      </SignedOut>
      <SignedIn>
        <DashboardInner />
      </SignedIn>
    </>
  );
}

// Send signed-out visitors to our own /login page (not Clerk's hosted portal).
function GoToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login/');
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest text-cream/60">
      Redirecting to sign in…
    </div>
  );
}

type Status = 'loading' | 'loaded' | 'error';

function DashboardInner() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<WaiverItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/waiver`, {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Request failed (${res.status}).`);
        }
        const data = await res.json();
        const list: WaiverItem[] = Array.isArray(data.items) ? data.items : [];
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

  const minors = items.filter((i) => (i.guardianName ?? '') !== '').length;
  const photoYes = items.filter((i) => i.photoConsent === 'yes').length;
  const chatYes = items.filter((i) => i.groupChat === 'yes').length;

  return (
    <div className="min-h-screen bg-forest text-cream">
      <header className="flex items-center justify-between border-b border-cream/10 px-6 py-4 sm:px-8">
        <a href="/" className="font-display text-xl text-cream">
          Flowsha
        </a>
        <div className="flex items-center gap-4">
          <a href="/dashboard/" className="text-sm text-cream/60 transition-colors hover:text-cream">
            Feedback
          </a>
          <span className="hidden text-sm text-cream/60 sm:inline">Waivers</span>
          <UserButton appearance={clerkAppearance} />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
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
              onClick={() => downloadCsv(items)}
              className="inline-flex items-center justify-center rounded-full border border-cream/25 px-5 py-2.5 text-sm font-semibold text-cream/85 transition-colors hover:border-mustard hover:text-cream"
            >
              Export CSV
            </button>
          )}
        </div>

        {status === 'error' && (
          <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta">{error}</p>
        )}

        {status === 'loaded' && items.length === 0 && (
          <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center text-cream/70">
            No waivers yet. Signed forms will appear here as they come in.
          </div>
        )}

        {status === 'loaded' && items.length > 0 && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Waivers" value={String(items.length)} />
              <Stat label="Under 18" value={String(minors)} />
              <Stat label="Photo: yes" value={String(photoYes)} />
              <Stat label="Group chat: yes" value={String(chatYes)} />
            </div>

            <ul className="space-y-4">
              {items.map((item) => (
                <SubmissionCard key={item.id} item={item} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
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

function SubmissionCard({ item }: { item: WaiverItem }) {
  const isMinor = (item.guardianName ?? '') !== '';
  const name = item.fullName || 'Unnamed';

  return (
    <li className="rounded-3xl border border-cream/10 bg-forest/40 p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl text-cream">
          {name}
          {isMinor && (
            <span className="ml-2 rounded-full bg-mustard/20 px-2 py-0.5 align-middle text-xs text-mustard">
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
