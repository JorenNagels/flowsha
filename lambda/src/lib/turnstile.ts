// Cloudflare Turnstile server-side verification.
// The browser widget produces a token; we confirm it here before sending email.
//
// The secret comes from one of (checked in this order):
//   • TURNSTILE_SECRET_KEY    — inline secret, used by the local dev Lambda
//   • TURNSTILE_SECRET_PARAM  — name of an SSM SecureString param, used in prod
//                               (CDK sets this; the value is fetched + cached at runtime)
// If neither is set, protection is OFF and submissions pass through — so the dev
// Lambda works with no config. Production MUST have the SSM parameter.

import { loadSecret } from './secrets.js';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const DIRECT_SECRET = process.env.TURNSTILE_SECRET_KEY || '';
const SECRET_PARAM = process.env.TURNSTILE_SECRET_PARAM || '';

export function isTurnstileEnabled(): boolean {
  return DIRECT_SECRET !== '' || SECRET_PARAM !== '';
}

/** Resolve the secret, fetching+caching from SSM on first use when configured. */
async function getSecret(): Promise<string> {
  return loadSecret(DIRECT_SECRET, SECRET_PARAM);
}

interface SiteverifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

/** Returns true if Cloudflare confirms the token is a genuine human submission. */
export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  if (!token) return false;

  let secret: string;
  try {
    secret = await getSecret();
  } catch (err) {
    // Can't read the secret → fail closed so bots can't slip through a config gap.
    console.error('Could not load Turnstile secret:', err);
    return false;
  }
  if (!secret) {
    console.error('Turnstile enabled but secret resolved empty — rejecting.');
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.append('remoteip', remoteIp);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json()) as SiteverifyResponse;
    if (!data.success) {
      console.warn('Turnstile rejected submission:', data['error-codes']);
    }
    return data.success === true;
  } catch (err) {
    // Network/Cloudflare failure: fail closed so bots can't bypass by breaking the call.
    console.error('Turnstile verification error:', err);
    return false;
  }
}
