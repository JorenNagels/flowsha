'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { findDelivery, formatPence, type Order, type OrderStatus } from '@flowsha/shared';
import { apiGet, apiPatch, errorMessage } from '@/lib/api';
import { SkeletonCardList, SkeletonGroup, SkeletonStats } from '@/components/Skeleton';
import { FilterFooter, FilterPanel, InfiniteScroll, SearchInput, SegmentedFilter } from './Filters';

const PAGE_SIZE = 20;

type Status = 'loading' | 'loaded' | 'error';

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'cancelled', label: 'Cancelled' },
];

const DELIVERY_OPTIONS = [
  { value: 'uk-standard', label: 'Post' },
  { value: 'collection', label: 'Collection' },
];

// What happens when you press the button on an order in this state.
const NEXT_STATUS: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  paid: { to: 'in-progress', label: 'Start making' },
  'in-progress': { to: 'dispatched', label: 'Mark dispatched' },
};

export default function OrdersDashboard() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<Order[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = await getToken();
    const data = await apiGet<{ items: Order[] }>('/admin/orders', token);
    const list = Array.isArray(data.items) ? data.items : [];
    list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); // newest first
    return list;
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await load();
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
  }, [load]);

  // First mutating UI in the dashboard. Deliberately simple: PATCH, then re-fetch
  // the list. No optimistic update — an order status is the sort of thing you
  // want to see confirmed by the server rather than assumed.
  const [savingId, setSavingId] = useState('');

  const changeStatus = useCallback(
    async (order: Order, to: OrderStatus, trackingNumber?: string) => {
      setSavingId(order.id);
      setError('');
      try {
        const token = await getToken();
        await apiPatch('/admin/orders', { id: order.id, status: to, trackingNumber }, token);
        setItems(await load());
      } catch (err) {
        setError(errorMessage(err, 'Could not update that order.'));
      } finally {
        setSavingId('');
      }
    },
    [getToken, load],
  );

  // --- Search + filters (client-side over the loaded records). ---
  const [query, setQuery] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [fDelivery, setFDelivery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((o) => {
      if (fStatus && o.status !== fStatus) return false;
      if (fDelivery && o.deliveryMethod !== fDelivery) return false;
      if (!q) return true;
      const haystack = [
        o.id,
        o.customerName ?? '',
        o.customerEmail ?? '',
        o.shippingAddress ?? '',
        o.trackingNumber ?? '',
        ...o.lines.map((l) => `${l.description} ${l.detail.join(' ')}`),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, fStatus, fDelivery]);

  const filtersActive = Boolean(query || fStatus || fDelivery);
  const clearFilters = () => {
    setQuery('');
    setFStatus('');
    setFDelivery('');
  };

  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => setVisible(PAGE_SIZE), [query, fStatus, fDelivery]);
  const showMore = useCallback(() => setVisible((v) => v + PAGE_SIZE), []);

  // Revenue counts money actually taken — pending orders never completed payment.
  const revenue = filtered
    .filter((o) => o.status !== 'pending' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPence, 0);
  const unfulfilled = filtered.filter(
    (o) => o.status === 'paid' || o.status === 'in-progress',
  ).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Orders</h1>
          <p className="mt-1 text-cream/70">
            {status === 'loaded'
              ? `${items.length} ${items.length === 1 ? 'order' : 'orders'}`
              : status === 'loading'
                ? 'Loading…'
                : 'Could not load orders'}
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
        <SkeletonGroup label="Loading orders…">
          <SkeletonStats />
          <div className="mt-6">
            <SkeletonCardList count={5} />
          </div>
        </SkeletonGroup>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
          {error}
        </p>
      )}

      {status === 'loaded' && items.length === 0 && (
        <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center text-cream/70">
          No orders yet. They’ll appear here as soon as someone buys a hoop.
        </div>
      )}

      {status === 'loaded' && items.length > 0 && (
        <>
          <FilterPanel>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search name, email, address, item…"
            />
            <SegmentedFilter
              label="Status"
              value={fStatus}
              onChange={setFStatus}
              options={STATUS_OPTIONS}
            />
            <SegmentedFilter
              label="Delivery"
              value={fDelivery}
              onChange={setFDelivery}
              options={DELIVERY_OPTIONS}
            />
            <FilterFooter
              matched={filtered.length}
              total={items.length}
              noun="order"
              active={filtersActive}
              onClear={clearFilters}
            />
          </FilterPanel>

          <div className="mb-6 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Orders" value={String(filtered.length)} />
            <Stat label="Revenue" value={formatPence(revenue)} />
            <Stat label="To make" value={String(unfulfilled)} />
            <Stat
              label="Dispatched"
              value={String(filtered.filter((o) => o.status === 'dispatched').length)}
            />
          </div>

          <ul className="space-y-4">
            {filtered.slice(0, visible).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                saving={savingId === order.id}
                onChangeStatus={changeStatus}
              />
            ))}
          </ul>

          <InfiniteScroll
            visible={visible}
            total={filtered.length}
            noun="order"
            onMore={showMore}
          />
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-cream/50">{label}</dt>
      <dd className="mt-0.5 text-cream/85">{value}</dd>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-cream/10 text-cream/60',
  paid: 'bg-terracotta-light/20 text-terracotta-light',
  'in-progress': 'bg-sage/25 text-cream',
  dispatched: 'bg-forest/70 text-cream',
  cancelled: 'bg-clay/30 text-cream/70',
};

function OrderCard({
  order,
  saving,
  onChangeStatus,
}: {
  order: Order;
  saving: boolean;
  onChangeStatus: (order: Order, to: OrderStatus, tracking?: string) => void;
}) {
  const [tracking, setTracking] = useState(order.trackingNumber ?? '');
  const next = NEXT_STATUS[order.status];
  const delivery = findDelivery(order.deliveryMethod);

  return (
    <li className="rounded-3xl border border-cream/10 bg-forest/40 p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-cream">
            {order.id.slice(0, 8).toUpperCase()} — {formatPence(order.totalPence)}
          </h2>
          <p className="text-sm text-cream/55">
            {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            STATUS_STYLES[order.status] ?? 'bg-cream/10 text-cream/60'
          }`}
        >
          {order.status.replace('-', ' ')}
        </span>
      </div>

      <ul className="mb-4 space-y-2 border-y border-cream/10 py-3">
        {order.lines.map((l, i) => (
          <li key={i} className="text-sm">
            <span className="text-cream">
              {l.description}
              {l.quantity > 1 ? ` × ${l.quantity}` : ''}
            </span>
            <span className="float-right text-cream/70">{formatPence(l.linePence)}</span>
            {l.detail.length > 0 && (
              <div className="text-xs text-cream/50">{l.detail.join(' · ')}</div>
            )}
          </li>
        ))}
      </ul>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <Field label="Customer" value={order.customerName || '—'} />
        <Field label="Email" value={order.customerEmail || '—'} />
        <Field
          label="Delivery"
          value={`${delivery?.label ?? order.deliveryMethod} — ${formatPence(order.deliveryPence)}`}
        />
        <Field label="Address" value={order.shippingAddress || 'Collection'} />
      </dl>

      {order.stripeSessionId && (
        <p className="mt-3 text-xs text-cream/50">Stripe session: {order.stripeSessionId}</p>
      )}

      {next && (
        <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-cream/10 pt-4">
          {next.to === 'dispatched' && (
            <div className="min-w-[12rem] flex-1">
              <label
                htmlFor={`tracking-${order.id}`}
                className="mb-1.5 block text-sm font-semibold text-cream/80"
              >
                Tracking number (optional)
              </label>
              <input
                id={`tracking-${order.id}`}
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="e.g. AB123456789GB"
                className="w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-2.5 text-cream placeholder-cream/40 outline-none transition focus:border-terracotta-light"
              />
            </div>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => onChangeStatus(order, next.to, tracking || undefined)}
            className="inline-flex items-center justify-center rounded-full bg-terracotta-deep px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving…' : next.label}
          </button>
          {next.to === 'dispatched' && (
            <p className="w-full text-xs text-cream/50">Marking dispatched emails the customer.</p>
          )}
        </div>
      )}
    </li>
  );
}

// --- CSV export (matches the convention in the other dashboards) -------------

const CSV_COLUMNS: { header: string; get: (o: Order) => string }[] = [
  { header: 'Order', get: (o) => o.id },
  { header: 'Date', get: (o) => o.createdAt },
  { header: 'Status', get: (o) => o.status },
  { header: 'Customer', get: (o) => o.customerName ?? '' },
  { header: 'Email', get: (o) => o.customerEmail ?? '' },
  { header: 'Delivery', get: (o) => o.deliveryMethod },
  { header: 'Address', get: (o) => o.shippingAddress ?? '' },
  { header: 'Items', get: (o) => o.lines.map((l) => `${l.description} x${l.quantity}`).join('; ') },
  { header: 'Total (£)', get: (o) => (o.totalPence / 100).toFixed(2) },
  { header: 'Tracking', get: (o) => o.trackingNumber ?? '' },
];

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function downloadCsv(orders: Order[]): void {
  const rows = [
    CSV_COLUMNS.map((c) => csvCell(c.header)).join(','),
    ...orders.map((o) => CSV_COLUMNS.map((c) => csvCell(c.get(o))).join(',')),
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `flowsha-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
