'use client';

import { useCallback, useEffect, useRef } from 'react';

// Cloudflare Turnstile site key (public). When unset (e.g. local dev with no key),
// the widget is skipped entirely and forms post an empty token — the Lambda only
// enforces verification when its own secret is configured.
const DEFAULT_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';

// Minimal typing for the Turnstile global injected by api.js.
interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      appearance?: TurnstileAppearance;
      theme?: 'auto' | 'light' | 'dark';
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileLoad?: () => void;
  }
}

export type TurnstileAppearance = 'always' | 'execute' | 'interaction-only';

export type UseTurnstileOptions = {
  // Whether the widget is a silent background check or a visible checkbox is a
  // property of the SITE KEY, set in the Cloudflare dashboard (Managed vs
  // Non-Interactive vs Invisible) — `appearance` alone cannot turn an invisible
  // key into a checkbox. So checkout, which SHOP-PLAN §12 wants as a visible
  // managed challenge, needs its own Managed-mode key passed in here.
  siteKey?: string;
  appearance?: TurnstileAppearance;
  theme?: 'auto' | 'light' | 'dark';
};

export type Turnstile = {
  // Attach to the <div> that should host the widget.
  widgetRef: React.RefObject<HTMLDivElement | null>;
  // Current token, or '' when unverified/disabled. Read at submit time.
  getToken: () => string;
  // Tokens are single-use — call this in the submit handler's `finally`.
  reset: () => void;
  // False when no site key is configured, so callers can skip rendering the host div.
  enabled: boolean;
};

// Loads api.js once, renders one widget, and keeps the token in a ref so token
// changes never re-render the form. Previously copy-pasted into ContactForm,
// FeedbackForm and WaiverForm.
export function useTurnstile(options: UseTurnstileOptions = {}): Turnstile {
  const { siteKey = DEFAULT_SITE_KEY, appearance, theme } = options;

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');
  const tokenRef = useRef<string>('');

  useEffect(() => {
    if (!siteKey) return;

    function renderWidget() {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        appearance,
        theme,
        callback: (token) => {
          tokenRef.current = token;
        },
        // Tokens are single-use and expire after ~5 min; refresh silently.
        'expired-callback': () => {
          tokenRef.current = '';
          window.turnstile?.reset(widgetIdRef.current);
        },
        'error-callback': () => {
          tokenRef.current = '';
        },
      });
    }

    window.onTurnstileLoad = renderWidget;

    if (window.turnstile) {
      renderWidget();
    } else if (!document.querySelector(`script[src="${TURNSTILE_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = '';
      }
    };
  }, [siteKey, appearance, theme]);

  const getToken = useCallback(() => tokenRef.current, []);

  const reset = useCallback(() => {
    tokenRef.current = '';
    if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
  }, []);

  return { widgetRef, getToken, reset, enabled: Boolean(siteKey) };
}
