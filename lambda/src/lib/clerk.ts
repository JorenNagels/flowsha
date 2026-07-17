import { createRemoteJWKSet, jwtVerify } from 'jose';

// Clerk instance issuer, e.g. https://<slug>.clerk.accounts.dev (dev) or
// https://clerk.flowsha.co.uk (prod). Set by CDK. When unset, auth is disabled
// (verifySession always returns null) — mirrors the config-gated Turnstile pattern.
const ISSUER = process.env.CLERK_ISSUER || '';

// Optional belt-and-suspenders allowlist. Only enforceable if the Clerk session
// token carries an `email` claim (added via the session-token customization in
// the Clerk dashboard). Empty = rely on Clerk's invite-only instance as the gate.
const ALLOWED_EMAILS = (process.env.DASHBOARD_ALLOWED_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Origins permitted as the token's authorized party (`azp`). Empty = skip the check.
const ALLOWED_ORIGINS = (process.env.DASHBOARD_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Cached across warm invocations. jose refreshes the key set as needed.
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

export type Session = { userId: string; email?: string };

export function isAuthEnabled(): boolean {
  return ISSUER !== '';
}

// Verify a Clerk session JWT. Fails closed: any problem → null. jwtVerify checks
// the signature (against Clerk's public JWKS), the issuer, and `exp`/`nbf`.
export async function verifySession(token: string): Promise<Session | null> {
  if (!ISSUER || !token) return null;
  try {
    jwks ??= createRemoteJWKSet(new URL('/.well-known/jwks.json', ISSUER));
    const { payload } = await jwtVerify(token, jwks, { issuer: ISSUER });

    // Authorized-party check (Clerk sets azp to the requesting origin).
    if (
      ALLOWED_ORIGINS.length > 0 &&
      typeof payload.azp === 'string' &&
      !ALLOWED_ORIGINS.includes(payload.azp)
    ) {
      return null;
    }

    const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : undefined;
    if (ALLOWED_EMAILS.length > 0 && (!email || !ALLOWED_EMAILS.includes(email))) {
      return null;
    }

    return { userId: String(payload.sub), email };
  } catch (err) {
    console.error('Clerk session verification failed:', err);
    return null;
  }
}
