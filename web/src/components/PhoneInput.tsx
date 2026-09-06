'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { countries, DEFAULT_COUNTRY_ISO2, flagEmoji, type Country } from '@/lib/countries';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const DEFAULT = countries.find((c) => c.iso2 === DEFAULT_COUNTRY_ISO2) ?? countries[0];

export default function PhoneInput({ value, onChange }: Props) {
  const [country, setCountry] = useState<Country>(DEFAULT);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // National part = the digits the user typed, without the dial code.
  const national = value.startsWith(`+${country.dial}`)
    ? value.slice(country.dial.length + 1)
    : value.replace(/^\+/, '');

  // Emit E.164 (`+<dial><digits>`), or '' when there's no number yet — so the
  // "email or phone" requirement never treats a bare dial code as a real number.
  function emit(digits: string, dial: string) {
    onChange(digits ? `+${dial}${digits}` : '');
  }

  function onDigits(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 15);
    emit(digits, country.dial);
  }

  function selectCountry(c: Country) {
    setCountry(c);
    setOpen(false);
    setQuery('');
    emit(national.replace(/\D/g, ''), c.dial); // keep the typed number, swap the code
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q.replace('+', '')),
    );
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Focus the search box when the list opens.
  useEffect(() => {
    if (open) {
      setHighlight(0);
      searchRef.current?.focus();
    }
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-idx="${highlight}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  function onSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlight]) selectCountry(filtered[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-stretch rounded-xl border border-cream/15 bg-forest/40 transition focus-within:border-terracotta-light focus-within:ring-2 focus-within:ring-terracotta-light/20">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${country.name} +${country.dial}`}
          className="flex items-center gap-1.5 rounded-l-xl border-r border-cream/15 px-3 text-cream transition-colors hover:bg-forest/60"
        >
          <span className="text-lg leading-none">{flagEmoji(country.iso2)}</span>
          <span className="text-sm text-cream/80">+{country.dial}</span>
          <svg
            className={`h-3.5 w-3.5 text-cream/50 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="7700 900123"
          value={national}
          onChange={onDigits}
          maxLength={20}
          className="w-full rounded-r-xl bg-transparent px-3 py-3 text-cream placeholder-cream/40 outline-none"
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full min-w-[16rem] overflow-hidden rounded-xl border border-cream/15 bg-forest shadow-xl">
          <div className="p-2">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlight(0);
              }}
              onKeyDown={onSearchKeyDown}
              placeholder="Search country…"
              className="w-full rounded-lg border border-cream/15 bg-forest/50 px-3 py-2 text-sm text-cream placeholder-cream/40 outline-none focus:border-terracotta-light"
            />
          </div>
          <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto pb-1">
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-sm text-cream/50">No matching country.</li>
            )}
            {filtered.map((c, i) => (
              <li key={c.iso2} role="option" aria-selected={c.iso2 === country.iso2}>
                <button
                  type="button"
                  data-idx={i}
                  onClick={() => selectCountry(c)}
                  onMouseEnter={() => setHighlight(i)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-cream/90 ${
                    i === highlight ? 'bg-forest/70' : ''
                  } ${c.iso2 === country.iso2 ? 'font-semibold' : ''}`}
                >
                  <span className="text-lg leading-none">{flagEmoji(c.iso2)}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-cream/50">+{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
