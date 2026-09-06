'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { SkeletonCard, SkeletonGroup } from '@/components/Skeleton';
import { apiGet, errorMessage } from '@/lib/api';

type Status = 'loading' | 'loaded' | 'error';

// Landing page for the dashboard: at-a-glance counts + links into each section.
export default function DashboardOverview() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [counts, setCounts] = useState({ feedback: 0, waivers: 0, orders: 0, hoops: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        // Shop endpoints are allowed to fail without taking the page down —
        // they 503 until the tables are deployed.
        const [fData, wData, oData, pData] = await Promise.all([
          apiGet<{ items: unknown[] }>('/feedback', token),
          apiGet<{ items: unknown[] }>('/waiver', token),
          apiGet<{ items: unknown[] }>('/admin/orders', token).catch(() => ({ items: [] })),
          apiGet<{ items: unknown[] }>('/admin/products', token).catch(() => ({ items: [] })),
        ]);
        if (!cancelled) {
          const len = (d: { items: unknown[] }) => (Array.isArray(d.items) ? d.items.length : 0);
          setCounts({
            feedback: len(fData),
            waivers: len(wData),
            orders: len(oData),
            hoops: len(pData),
          });
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

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Dashboard</h1>
        <p className="mt-1 text-cream/70">Everything people have sent through the site.</p>
      </div>

      {status === 'loading' && (
        <SkeletonGroup label="Loading dashboard totals…">
          <div className="grid gap-4 sm:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </SkeletonGroup>
      )}

      {status === 'error' && (
        <p className="rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
          {error}
        </p>
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
          <OverviewCard
            href="/dashboard/orders/"
            title="Orders"
            description="Hoop orders that have been paid for, and what still needs making."
            count={counts.orders}
            noun="order"
          />
          <OverviewCard
            href="/dashboard/shop/"
            title="Ready-made hoops"
            description="The one-off hoops listed in the shop right now."
            count={counts.hoops}
            noun="hoop"
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
      className="group flex flex-col rounded-3xl border border-cream/10 bg-forest/40 p-6 transition-colors hover:border-terracotta-light/50"
    >
      <div className="font-display text-4xl text-terracotta">{count}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wide text-cream/55">
        {count === 1 ? noun : `${noun}s`}
      </div>
      <h2 className="mt-4 font-display text-xl text-cream">{title}</h2>
      <p className="mt-1 text-sm text-cream/70">{description}</p>
      <span className="mt-4 text-sm font-semibold text-cream/80 transition-colors group-hover:text-terracotta-light">
        View {title.toLowerCase()} →
      </span>
    </a>
  );
}
