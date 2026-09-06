// The one place that knows how to talk to the Lambda Function URL.
//
// This used to be re-declared in six components (three forms + three dashboard
// views); the cart, checkout, products and admin calls would have made it eleven.

// Lambda Function URLs always carry a trailing slash; strip it so we don't post
// to `…on.aws//contact` (which the handler's route table 404s on).
export const API_URL = (process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '').replace(/\/$/, '');

const GENERIC_ERROR = 'Something went wrong. Please try again.';

// `status` is 0 when the request never reached the server (offline, DNS, CORS),
// which callers may want to word differently from a 4xx.
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Pull a displayable string out of an unknown catch value. Every form's catch
// block hand-rolled this ternary.
export function errorMessage(err: unknown, fallback = GENERIC_ERROR): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

// The handler's contract: errors are always `{ error: string }`, successes are
// `{ ok: true }` or `{ items: [...] }`. A non-JSON body (a gateway error page,
// say) must not surface as a JSON parse error, so it degrades to GENERIC_ERROR.
async function request<T>(path: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    const message = typeof body.error === 'string' && body.error ? body.error : GENERIC_ERROR;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

function authHeaders(token?: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function apiGet<T>(path: string, token?: string | null): Promise<T> {
  return request<T>(path, { headers: authHeaders(token) });
}

export function apiPost<T>(path: string, body: unknown, token?: string | null): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(body),
  });
}

export function apiPatch<T>(path: string, body: unknown, token?: string | null): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(body),
  });
}
