import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { z } from 'zod';
import { jsonResponse } from './lib/cors.js';
import { contactSchema, formatZodError } from './lib/validation.js';
import { sendContactEmail } from './lib/ses.js';

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

      await sendContactEmail(parsed.data);
      return jsonResponse(200, { ok: true });
    }

    // Future: POST /orders, POST /checkout, etc.

    return jsonResponse(404, { error: 'Not found' });
  } catch (error) {
    console.error('Handler error:', error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
}
