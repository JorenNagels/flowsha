import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { z } from 'zod';
import { formatZodError } from './validation.js';
import { isTurnstileEnabled, verifyTurnstile } from './turnstile.js';
import { verifySession, type Session } from './clerk.js';

// Shared request plumbing. CORS itself is configured on the Function URL in CDK;
// this module only builds responses and runs the guards every route repeats.

const MAX_BODY_BYTES = 64 * 1024;

export function jsonResponse(
  statusCode: number,
  body: unknown,
  headers: Record<string, string> = {},
) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  };
}

/** Either a parsed body, or the response to return instead. */
export type Parsed<T> = { ok: true; data: T } | { ok: false; response: APIGatewayProxyResultV2 };

export function parseBody<S extends z.ZodTypeAny>(
  event: APIGatewayProxyEventV2,
  schema: S,
): Parsed<z.infer<S>> {
  const raw = rawBody(event);
  if (raw.length > MAX_BODY_BYTES) {
    return { ok: false, response: jsonResponse(413, { error: 'Request body too large.' }) };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || '{}');
  } catch {
    return { ok: false, response: jsonResponse(400, { error: 'Invalid JSON body.' }) };
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    return { ok: false, response: jsonResponse(400, { error: formatZodError(result.error) }) };
  }
  return { ok: true, data: result.data };
}

/**
 * The body as the client sent it.
 *
 * Function URLs base64-encode the body whenever they decide the content isn't
 * text, so anything that needs the exact bytes — the Stripe webhook signature,
 * above all — must come through here rather than reading `event.body` directly.
 */
export function rawBody(event: APIGatewayProxyEventV2): string {
  const body = event.body ?? '';
  return event.isBase64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body;
}

/** Headers arrive lowercased through the Function URL, but don't rely on it. */
export function header(event: APIGatewayProxyEventV2, name: string): string {
  const headers = event.headers ?? {};
  const direct = headers[name] ?? headers[name.toLowerCase()];
  if (direct) return direct;
  const hit = Object.entries(headers).find(([k]) => k.toLowerCase() === name.toLowerCase());
  return hit?.[1] ?? '';
}

/** Verify a Clerk session JWT. Returns the response to send when it fails. */
export async function requireSession(
  event: APIGatewayProxyEventV2,
): Promise<{ ok: true; session: Session } | { ok: false; response: APIGatewayProxyResultV2 }> {
  const token = header(event, 'authorization')
    .replace(/^Bearer /i, '')
    .trim();
  const session = await verifySession(token);
  if (!session) return { ok: false, response: jsonResponse(401, { error: 'Unauthorized' }) };
  return { ok: true, session };
}

/**
 * Honeypot + Turnstile, in that order.
 *
 * A filled honeypot returns a fake 200 so the bot believes it succeeded and
 * doesn't retry with a different technique — hence `response`, not an error.
 */
export async function botCheck(
  event: APIGatewayProxyEventV2,
  data: { company?: string; turnstileToken?: string },
): Promise<{ ok: true } | { ok: false; response: APIGatewayProxyResultV2 }> {
  if ((data.company ?? '').trim() !== '') {
    return { ok: false, response: jsonResponse(200, { ok: true }) };
  }

  if (isTurnstileEnabled()) {
    const human = await verifyTurnstile(
      data.turnstileToken ?? '',
      event.requestContext.http.sourceIp,
    );
    if (!human) {
      return {
        ok: false,
        response: jsonResponse(400, {
          error: 'Could not verify you’re human. Please refresh the page and try again.',
        }),
      };
    }
  }
  return { ok: true };
}
