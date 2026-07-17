import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { z } from 'zod';
import { jsonResponse } from './lib/cors.js';
import {
  contactSchema,
  feedbackSchema,
  waiverSchema,
  WAIVER_VERSION,
  formatZodError,
} from './lib/validation.js';
import { sendContactEmail, sendWaiverEmail } from './lib/ses.js';
import { saveFeedback, listFeedback, saveWaiver, listWaivers } from './lib/db.js';
import { isTurnstileEnabled, verifyTurnstile } from './lib/turnstile.js';
import { verifySession } from './lib/clerk.js';

const MAX_BODY_BYTES = 64 * 1024;

function parseBody<S extends z.ZodTypeAny>(
  event: APIGatewayProxyEventV2,
  schema: S,
): { ok: true; data: z.infer<S> } | { ok: false; response: APIGatewayProxyResultV2 } {
  const raw = event.body ?? '';
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

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const path = event.rawPath;
  const method = event.requestContext.http.method;

  try {
    if (method === 'POST' && path === '/contact') {
      const parsed = parseBody(event, contactSchema);
      if (!parsed.ok) return parsed.response;

      // Honeypot: a bot filled the hidden field. Pretend success, send nothing.
      if (parsed.data.company.trim() !== '') {
        return jsonResponse(200, { ok: true });
      }

      // Cloudflare Turnstile: confirm a real human (only when a secret is configured).
      if (isTurnstileEnabled()) {
        const human = await verifyTurnstile(
          parsed.data.turnstileToken,
          event.requestContext.http.sourceIp,
        );
        if (!human) {
          return jsonResponse(400, {
            error: 'Could not verify you’re human. Please refresh the page and try again.',
          });
        }
      }

      await sendContactEmail(parsed.data);
      return jsonResponse(200, { ok: true });
    }

    if (method === 'POST' && path === '/feedback') {
      const parsed = parseBody(event, feedbackSchema);
      if (!parsed.ok) return parsed.response;

      // Honeypot: a bot filled the hidden field. Pretend success, store nothing.
      if (parsed.data.company.trim() !== '') {
        return jsonResponse(200, { ok: true });
      }

      // Cloudflare Turnstile: confirm a real human (only when a secret is configured).
      if (isTurnstileEnabled()) {
        const human = await verifyTurnstile(
          parsed.data.turnstileToken,
          event.requestContext.http.sourceIp,
        );
        if (!human) {
          return jsonResponse(400, {
            error: 'Could not verify you’re human. Please refresh the page and try again.',
          });
        }
      }

      await saveFeedback(parsed.data);
      return jsonResponse(200, { ok: true });
    }

    // Authenticated read for the private /dashboard. Verifies a Clerk session
    // JWT (Bearer token) before returning any submissions.
    if (method === 'GET' && path === '/feedback') {
      const auth = event.headers.authorization ?? '';
      const token = auth.replace(/^Bearer /i, '').trim();
      const session = await verifySession(token);
      if (!session) return jsonResponse(401, { error: 'Unauthorized' });

      return jsonResponse(200, { items: await listFeedback() });
    }

    // Signed PAR-Q + Informed Consent waiver. Emails Osha a copy and persists
    // it, stamping an audit trail (IP, user-agent, waiver version) for the
    // electronic signature.
    if (method === 'POST' && path === '/waiver') {
      const parsed = parseBody(event, waiverSchema);
      if (!parsed.ok) return parsed.response;

      // Honeypot: a bot filled the hidden field. Pretend success, store nothing.
      if (parsed.data.company.trim() !== '') {
        return jsonResponse(200, { ok: true });
      }

      // Cloudflare Turnstile: confirm a real human (only when a secret is configured).
      if (isTurnstileEnabled()) {
        const human = await verifyTurnstile(
          parsed.data.turnstileToken,
          event.requestContext.http.sourceIp,
        );
        if (!human) {
          return jsonResponse(400, {
            error: 'Could not verify you’re human. Please refresh the page and try again.',
          });
        }
      }

      // The signed waiver is a legal record — persist it first (critical; may
      // throw → 500). The owner notification is best-effort: a failed email
      // must never lose the stored waiver or block the signer.
      await saveWaiver(parsed.data, {
        signedIp: event.requestContext.http.sourceIp,
        userAgent: event.headers['user-agent'],
        waiverVersion: WAIVER_VERSION,
      });
      try {
        await sendWaiverEmail(parsed.data);
      } catch (err) {
        console.error('Waiver notification email failed (non-fatal):', err);
      }
      return jsonResponse(200, { ok: true });
    }

    // Authenticated read of signed waivers for the private /dashboard/waivers.
    if (method === 'GET' && path === '/waiver') {
      const auth = event.headers.authorization ?? '';
      const token = auth.replace(/^Bearer /i, '').trim();
      const session = await verifySession(token);
      if (!session) return jsonResponse(401, { error: 'Unauthorized' });

      return jsonResponse(200, { items: await listWaivers() });
    }

    // Future: POST /orders, POST /checkout, etc.

    return jsonResponse(404, { error: 'Not found' });
  } catch (error) {
    console.error('Handler error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
}
