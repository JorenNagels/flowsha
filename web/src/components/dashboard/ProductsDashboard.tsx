'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  formatPence,
  JOINTS,
  SIZES,
  TUBING,
  type JointId,
  type ReadyMadeHoop,
  type ReadyMadePhoto,
  type TubingId,
} from '@flowsha/shared';
import { apiGet, apiPatch, apiPost, errorMessage } from '@/lib/api';
import { SkeletonCardList, SkeletonGroup } from '@/components/Skeleton';

type Status = 'loading' | 'loaded' | 'error';

const field =
  'w-full rounded-xl border border-cream/15 bg-forest/40 px-4 py-3 text-cream placeholder-cream/40 outline-none transition focus:border-terracotta-light focus:ring-2 focus:ring-terracotta-light/20';
const labelCls = 'mb-1.5 block text-sm font-semibold text-cream/80';

type Draft = {
  id?: string;
  title: string;
  description: string;
  sizeInches: number;
  tubingId: TubingId;
  jointId: JointId;
  tapeSummary: string;
  pricePounds: string;
  status: ReadyMadeHoop['status'];
  photos: ReadyMadePhoto[];
};

const EMPTY: Draft = {
  title: '',
  description: '',
  sizeInches: 32,
  tubingId: 'regular',
  jointId: 'fixed',
  tapeSummary: '',
  pricePounds: '',
  status: 'draft',
  photos: [],
};

export default function ProductsDashboard() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<ReadyMadeHoop[]>([]);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const token = await getToken();
    const data = await apiGet<{ items: ReadyMadeHoop[] }>('/admin/products', token);
    return Array.isArray(data.items) ? data.items : [];
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

  const live = useMemo(() => items.filter((i) => i.status !== 'archived'), [items]);

  async function save() {
    if (!draft) return;
    const pence = Math.round(Number(draft.pricePounds) * 100);
    if (!Number.isFinite(pence) || pence < 1) {
      setError('Please give the hoop a price.');
      return;
    }
    if (draft.photos.some((p) => !p.alt.trim())) {
      setError('Every photo needs alt text before you can save.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const token = await getToken();
      await apiPost(
        '/admin/products',
        {
          id: draft.id,
          title: draft.title,
          description: draft.description,
          sizeInches: draft.sizeInches,
          tubingId: draft.tubingId,
          jointId: draft.jointId,
          tapeSummary: draft.tapeSummary,
          pricePence: pence,
          status: draft.status,
          photos: draft.photos,
        },
        token,
      );
      setItems(await load());
      setDraft(null);
    } catch (err) {
      setError(errorMessage(err, 'Could not save that hoop.'));
    } finally {
      setSaving(false);
    }
  }

  async function archive(hoop: ReadyMadeHoop) {
    // Soft delete only — a hard delete would orphan any order referencing it.
    if (!window.confirm(`Archive “${hoop.title}”? It will disappear from the shop.`)) return;
    setError('');
    try {
      const token = await getToken();
      await apiPatch('/admin/products', { id: hoop.id }, token);
      setItems(await load());
    } catch (err) {
      setError(errorMessage(err, 'Could not archive that hoop.'));
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Ready-made hoops</h1>
          <p className="mt-1 text-cream/70">
            {status === 'loaded'
              ? `${live.length} listed`
              : status === 'loading'
                ? 'Loading…'
                : 'Could not load hoops'}
          </p>
        </div>
        {status === 'loaded' && !draft && (
          <button
            type="button"
            onClick={() => setDraft({ ...EMPTY })}
            className="inline-flex items-center justify-center rounded-full bg-terracotta-deep px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay"
          >
            Add a hoop
          </button>
        )}
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-terracotta/15 px-4 py-3 text-sm text-terracotta-light">
          {error}
        </p>
      )}

      {status === 'loading' && (
        <SkeletonGroup label="Loading hoops…">
          <SkeletonCardList count={3} />
        </SkeletonGroup>
      )}

      {draft && (
        <HoopForm
          draft={draft}
          setDraft={setDraft}
          onSave={save}
          onCancel={() => setDraft(null)}
          saving={saving}
          setError={setError}
        />
      )}

      {status === 'loaded' && !draft && live.length === 0 && (
        <div className="rounded-3xl border border-cream/10 bg-forest/40 p-8 text-center text-cream/70">
          No ready-made hoops listed. Add one and it’ll appear in the shop.
        </div>
      )}

      {status === 'loaded' && !draft && live.length > 0 && (
        <ul className="space-y-4">
          {live.map((hoop) => (
            <li
              key={hoop.id}
              className="flex flex-wrap items-center gap-4 rounded-3xl border border-cream/10 bg-forest/40 p-5"
            >
              {hoop.photos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hoop.photos[0].url}
                  alt={hoop.photos[0].alt}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-forest text-xs text-cream/40">
                  No photo
                </div>
              )}
              <div className="min-w-[10rem] flex-1">
                <h2 className="font-display text-lg text-cream">{hoop.title}</h2>
                <p className="text-sm text-cream/55">
                  {hoop.sizeInches}″ · {formatPence(hoop.pricePence)} · {hoop.status}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      id: hoop.id,
                      title: hoop.title,
                      description: hoop.description ?? '',
                      sizeInches: hoop.sizeInches,
                      tubingId: hoop.tubingId,
                      jointId: hoop.jointId,
                      tapeSummary: hoop.tapeSummary ?? '',
                      pricePounds: (hoop.pricePence / 100).toFixed(2),
                      status: hoop.status,
                      photos: hoop.photos,
                    })
                  }
                  className="rounded-full border border-cream/25 px-4 py-2 text-sm text-cream/85 hover:border-terracotta-light"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => archive(hoop)}
                  className="rounded-full border border-cream/25 px-4 py-2 text-sm text-cream/60 hover:border-terracotta-light"
                >
                  Archive
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function HoopForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
  setError,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  setError: (s: string) => void;
}) {
  const { getToken } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError('');
    try {
      const token = await getToken();
      const added: ReadyMadePhoto[] = [];
      for (const file of Array.from(files)) {
        const blob = await resizeToWebp(file);
        const { uploadUrl, publicUrl } = await apiPost<{ uploadUrl: string; publicUrl: string }>(
          '/uploads',
          { contentType: 'image/webp', contentLength: blob.size },
          token,
        );
        // Straight to S3 — the image bytes never pass through the Lambda.
        const res = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/webp' },
          body: blob,
        });
        if (!res.ok) throw new Error('Upload failed. Please try again.');
        added.push({ url: publicUrl, alt: '' });
      }
      setDraft({ ...draft, photos: [...draft.photos, ...added] });
    } catch (err) {
      setError(errorMessage(err, 'Could not upload that photo.'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mb-8 rounded-3xl border border-cream/10 bg-forest/40 p-6">
      <h2 className="font-display text-xl text-cream">{draft.id ? 'Edit hoop' : 'New hoop'}</h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="p-title">
            Title
          </label>
          <input
            id="p-title"
            className={field}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. Sunset spiral, 34″"
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="p-size">
            Size
          </label>
          <select
            id="p-size"
            className={field}
            value={draft.sizeInches}
            onChange={(e) => setDraft({ ...draft, sizeInches: Number(e.target.value) })}
          >
            {SIZES.map((s) => (
              <option key={s.inches} value={s.inches}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="p-price">
            Price (£)
          </label>
          <input
            id="p-price"
            className={field}
            inputMode="decimal"
            value={draft.pricePounds}
            onChange={(e) => setDraft({ ...draft, pricePounds: e.target.value })}
            placeholder="45.00"
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="p-tubing">
            Tubing
          </label>
          <select
            id="p-tubing"
            className={field}
            value={draft.tubingId}
            onChange={(e) => setDraft({ ...draft, tubingId: e.target.value as TubingId })}
          >
            {TUBING.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="p-joint">
            Joint
          </label>
          <select
            id="p-joint"
            className={field}
            value={draft.jointId}
            onChange={(e) => setDraft({ ...draft, jointId: e.target.value as JointId })}
          >
            {JOINTS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="p-tapes">
            Tapes used
          </label>
          <input
            id="p-tapes"
            className={field}
            value={draft.tapeSummary}
            onChange={(e) => setDraft({ ...draft, tapeSummary: e.target.value })}
            placeholder="e.g. Copper shiny over black gaffer"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="p-desc">
            Description
          </label>
          <textarea
            id="p-desc"
            className={field}
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="p-status">
            Status
          </label>
          <select
            id="p-status"
            className={field}
            value={draft.status}
            onChange={(e) =>
              setDraft({ ...draft, status: e.target.value as ReadyMadeHoop['status'] })
            }
          >
            <option value="draft">Draft (hidden)</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Photos */}
      <div className="mt-6">
        <label className={labelCls} htmlFor="p-photos">
          Photos
        </label>
        <input
          id="p-photos"
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => onFiles(e.target.files)}
          className="text-sm text-cream/70 file:mr-3 file:rounded-full file:border-0 file:bg-terracotta-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-forest-dark"
        />
        {uploading && <p className="mt-2 text-sm text-cream/60">Uploading…</p>}

        {draft.photos.length > 0 && (
          <ul className="mt-4 space-y-3">
            {draft.photos.map((photo, i) => (
              <li key={photo.url} className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <label className="sr-only" htmlFor={`alt-${i}`}>
                    Alt text for photo {i + 1}
                  </label>
                  {/* Required, not optional-and-always-skipped: alt text is what
                      makes the shop usable with a screen reader, and it is the
                      only text Google has to go on for these images. */}
                  <input
                    id={`alt-${i}`}
                    className={field}
                    value={photo.alt}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        photos: draft.photos.map((p, j) =>
                          j === i ? { ...p, alt: e.target.value } : p,
                        ),
                      })
                    }
                    placeholder="Describe the photo (required)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDraft({ ...draft, photos: draft.photos.filter((_, j) => j !== i) })
                  }
                  className="mt-3 text-sm text-cream/55 underline hover:text-terracotta-light"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || uploading}
          className="inline-flex items-center justify-center rounded-full bg-terracotta-deep px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-cream/25 px-6 py-2.5 text-sm text-cream/85 hover:border-terracotta-light"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * Downscale to at most 1600px and re-encode as WebP before uploading.
 *
 * A phone photo is 4–8 MB; this gets it under a few hundred KB, which keeps the
 * media bucket small and the shop fast. The server still enforces its own size
 * cap when signing, so this is a convenience rather than a control.
 */
async function resizeToWebp(file: File, maxEdge = 1600): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process that image.');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process that image.'))),
      'image/webp',
      0.82,
    );
  });
}
