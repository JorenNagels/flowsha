import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { jsonResponse } from './lib/http.js';
import { getFeedback, getWaiver, postContact, postFeedback, postWaiver } from './routes/forms.js';
import { getProducts, postCheckout, postStripeWebhook } from './routes/shop.js';
import {
  getAdminOrders,
  getAdminProducts,
  patchAdminOrder,
  patchAdminProduct,
  postAdminProduct,
  postUpload,
} from './routes/admin.js';

type RouteHandler = (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>;

// Keyed `METHOD /path`. This replaced a flat if-chain, which was already long at
// five routes and unreadable at fourteen.
const routes: Record<string, RouteHandler> = {
  // --- Public forms ---
  'POST /contact': postContact,
  'POST /feedback': postFeedback,
  'POST /waiver': postWaiver,

  // --- Dashboard reads (Clerk session JWT) ---
  'GET /feedback': getFeedback,
  'GET /waiver': getWaiver,

  // --- Shop (public) ---
  'GET /products': getProducts,
  'POST /checkout': postCheckout,
  'POST /stripe-webhook': postStripeWebhook,

  // --- Shop admin (Clerk session JWT) ---
  'POST /uploads': postUpload,
  'GET /admin/products': getAdminProducts,
  'POST /admin/products': postAdminProduct,
  'PATCH /admin/products': patchAdminProduct,
  'GET /admin/orders': getAdminOrders,
  'PATCH /admin/orders': patchAdminOrder,
};

/**
 * Function URLs always carry a trailing slash on the base URL, and callers vary
 * on whether they add one. Normalise so `/contact` and `/contact/` are the same
 * route rather than a silent 404.
 */
function normalisePath(rawPath: string): string {
  const path = rawPath || '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const method = event.requestContext.http.method;
  const path = normalisePath(event.rawPath);

  const route = routes[`${method} ${path}`];
  if (!route) return jsonResponse(404, { error: 'Not found' });

  try {
    return await route(event);
  } catch (error) {
    console.error(`Handler error (${method} ${path}):`, error);
    return jsonResponse(500, { error: 'Internal server error' });
  }
}
