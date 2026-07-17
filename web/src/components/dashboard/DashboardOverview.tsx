'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { LoadingBlock } from '@/components/Spinner';

const API_URL = (process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '').replace(/\/$/, '');

type Status = 'loading' | 'loaded' | 'error';

// Landing page for the dashboard: at-a-glance counts + links into each section.
export default function DashboardOverview() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [counts, setCounts] = useState({ feedback: 0, waivers: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token ?? ''}` };
        const [fRes, wRes] = await Promise.all([
          fetch(`${API_URL}/feedback`, { headers }),
          fetch(`${API_URL}/waiver`, { headers }),
        ]);
        if (!fRes.ok || !wRes.ok) {
          const bad = !fRes.ok ? fRes : wRes;
          const body = await bad.json().catch(() => ({}));
          throw new Error(body.error || `Request failed (${bad.status}).`);
        }
        const [fData, wData] = await Promise.all([fRes.json(), wRes.json()]);
        if (!cancelled) {
          setCounts({
            feedback: Array.isArray(fData.items) ? fData.items.length : 0,
            waivers: Array.isArray(wData.items) ? wData.items.length : 0,
          });
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

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Dashboard</h1>
        <p className="mt-1 text-cream/70">Everything people have sent through the site.</p>
      </div>

      {status === 'loading' && <LoadingBlock />}

      {status === 'error' && (
        <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta">{error}</p>
      )}

      {status === 'loaded' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <OverviewCard
            href="/dashboard/feedback/"
            title="Class feedback"
            description="Survey responses from people who’ve been to a class."
            count={counts.feedback}
            noun="response"
          />
          <OverviewCard
            href="/dashboard/waivers/"
            title="Signed waivers"
            description="PAR-Q and consent forms signed before a first class."
            count={counts.waivers}
            noun="waiver"
          />
        </div>
      )}
    </>
  );
}

function OverviewCard({
  href,
  title,
  description,
  count,
  noun,
}: {
  href: string;
  title: string;
  description: string;
  count: number;
  noun: string;
}) {
  return (
    <a
      href={href}
      className="group flex flex-col rounded-3xl border border-cream/10 bg-forest/40 p-6 transition-colors hover:border-mustard/50"
    >
      <div className="font-display text-4xl text-mustard">{count}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wide text-cream/55">
        {count === 1 ? noun : `${noun}s`}
      </div>
      <h2 className="mt-4 font-display text-xl text-cream">{title}</h2>
      <p className="mt-1 text-sm text-cream/70">{description}</p>
      <span className="mt-4 text-sm font-semibold text-cream/80 transition-colors group-hover:text-mustard">
        View {title.toLowerCase()} →
      </span>
    </a>
  );
}
