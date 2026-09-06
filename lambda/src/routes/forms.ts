import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { botCheck, jsonResponse, parseBody, requireSession } from '../lib/http.js';
import { contactSchema, feedbackSchema, waiverSchema, WAIVER_VERSION } from '../lib/validation.js';
import { sendContactEmail, sendWaiverEmail } from '../lib/ses.js';
import { listFeedback, listWaivers, saveFeedback, saveWaiver } from '../lib/db.js';

// The three public forms, plus their authenticated dashboard reads. Behaviour is
// unchanged from the original handler — the honeypot and Turnstile checks simply
// moved into the shared `botCheck` guard instead of being repeated per route.

export async function postContact(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const parsed = parseBody(event, contactSchema);
  if (!parsed.ok) return parsed.response;

  const bots = await botCheck(event, parsed.data);
  if (!bots.ok) return bots.response;

  await sendContactEmail(parsed.data);
  return jsonResponse(200, { ok: true });
}

export async function postFeedback(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const parsed = parseBody(event, feedbackSchema);
  if (!parsed.ok) return parsed.response;

  const bots = await botCheck(event, parsed.data);
  if (!bots.ok) return bots.response;

  await saveFeedback(parsed.data);
  return jsonResponse(200, { ok: true });
}

export async function getFeedback(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const auth = await requireSession(event);
  if (!auth.ok) return auth.response;
  return jsonResponse(200, { items: await listFeedback() });
}

/**
 * Signed PAR-Q + Informed Consent waiver. Persists first and emails second: the
 * stored form is the legal record, so a failed notification must never lose it.
 */
export async function postWaiver(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const parsed = parseBody(event, waiverSchema);
  if (!parsed.ok) return parsed.response;

  const bots = await botCheck(event, parsed.data);
  if (!bots.ok) return bots.response;

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

export async function getWaiver(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const auth = await requireSession(event);
  if (!auth.ok) return auth.response;
  return jsonResponse(200, { items: await listWaivers() });
}
