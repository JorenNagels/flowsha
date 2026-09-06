'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, HoopConfig } from '@flowsha/shared';
import { MAX_QUANTITY } from '@flowsha/shared';

// Cart state. The first React context in this codebase — everything else here is
// either a server component or self-contained client state.
//
// The cart holds only *identifiers and choices*, never prices. The server
// re-prices the whole basket at checkout, so a tampered localStorage entry can
// change what you're buying but never what you pay.

const STORAGE_KEY = 'flowsha-cart-v1';

export type CartEntry = {
  /** Stable key for React and for removal; not sent to the server. */
  lineId: string;
  item: CartItem;
};

type CartContextValue = {
  entries: CartEntry[];
  /** False until localStorage has been read — render skeletons, not "empty". */
  isReady: boolean;
  itemCount: number;
  addCustom: (config: HoopConfig, quantity?: number) => void;
  addReadyMade: (hoopId: string) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  hasReadyMade: (hoopId: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartEntry[]) : [];
  } catch {
    // Corrupt or unavailable (private mode) — start empty rather than crash.
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Read after mount: the site is a static export, so touching localStorage
  // during render would mismatch the prerendered HTML.
  useEffect(() => {
    setEntries(readStored());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Quota or private mode — the cart still works for this session.
    }
  }, [entries, isReady]);

  const addCustom = useCallback((config: HoopConfig, quantity = 1) => {
    setEntries((prev) => [
      ...prev,
      {
        lineId: crypto.randomUUID(),
        item: { kind: 'custom', config, quantity: Math.min(quantity, MAX_QUANTITY) },
      },
    ]);
  }, []);

  const addReadyMade = useCallback((hoopId: string) => {
    setEntries((prev) => {
      // One-offs: there is only ever one of each, so adding twice is a no-op.
      if (prev.some((e) => e.item.kind === 'ready-made' && e.item.hoopId === hoopId)) return prev;
      return [
        ...prev,
        { lineId: crypto.randomUUID(), item: { kind: 'ready-made', hoopId, quantity: 1 } },
      ];
    });
  }, []);

  const remove = useCallback((lineId: string) => {
    setEntries((prev) => prev.filter((e) => e.lineId !== lineId));
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    const q = Math.max(1, Math.min(Math.trunc(quantity) || 1, MAX_QUANTITY));
    setEntries((prev) =>
      prev.map((e) =>
        e.lineId === lineId && e.item.kind === 'custom'
          ? { ...e, item: { ...e.item, quantity: q } }
          : e,
      ),
    );
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      entries,
      isReady,
      itemCount: entries.reduce((n, e) => n + e.item.quantity, 0),
      addCustom,
      addReadyMade,
      remove,
      setQuantity,
      clear,
      hasReadyMade: (hoopId: string) =>
        entries.some((e) => e.item.kind === 'ready-made' && e.item.hoopId === hoopId),
    }),
    [entries, isReady, addCustom, addReadyMade, remove, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>.');
  return ctx;
}
