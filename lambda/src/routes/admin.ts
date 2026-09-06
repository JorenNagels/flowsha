import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import type { ReadyMadeHoop } from '@flowsha/shared';
import { jsonResponse, parseBody, requireSession } from '../lib/http.js';
import {
  adminOrderPatchSchema,
  adminProductSchema,
  uploadRequestSchema,
  MAX_UPLOAD_BYTES,
} from '../lib/validation.js';
import {
  archiveProduct,
  getOrder,
  getProduct,
  listOrders,
  listProducts,
  putProduct,
  updateOrderStatus,
} from '../lib/shopDb.js';
import { sendDispatchEmail } from '../lib/ses.js';

const MEDIA_BUCKET = process.env.MEDIA_BUCKET_NAME || '';
const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL || '';

// The S3 SDK + presigner are ~1.4 MB and are needed by exactly one route, so
// they are imported dynamically. With `splitting: true` in build.mjs esbuild
// emits them as a separate chunk, keeping that weight off the cold start of
// the contact form and every other route.
let s3: import('@aws-sdk/client-s3').S3Client | undefined;

const EXTENSIONS: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// --- POST /uploads -----------------------------------------------------------

/**
 * Hand back a presigned PUT so the dashboard can upload a photo straight to S3 —
 * no image bytes ever pass through the Lambda.
 *
 * ContentType and ContentLength are part of the SIGNATURE, so the browser cannot
 * upload something larger or of a different type than it declared. The in-browser
 * resize is a convenience; this is the actual control.
 */
export async function postUpload(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const auth = await requireSession(event);
  if (!auth.ok) return auth.response;

  const parsed = parseBody(event, uploadRequestSchema);
  if (!parsed.ok) return parsed.response;

  if (!MEDIA_BUCKET) {
    return jsonResponse(503, { error: 'Photo uploads are not configured.' });
  }
  if (parsed.data.contentLength > MAX_UPLOAD_BYTES) {
    return jsonResponse(413, { error: 'That image is too large. Please use one under 3 MB.' });
  }

  // The `media/` prefix matches the /media/* CloudFront behaviour.
  const key = `media/${crypto.randomUUID()}.${EXTENSIONS[parsed.data.contentType]}`;

  const [{ S3Client, PutObjectCommand }, { getSignedUrl }] = await Promise.all([
    import('@aws-sdk/client-s3'),
    import('@aws-sdk/s3-request-presigner'),
  ]);

  s3 ??= new S3Client({});
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: MEDIA_BUCKET,
      Key: key,
      ContentType: parsed.data.contentType,
      ContentLength: parsed.data.contentLength,
    }),
    { expiresIn: 300 },
  );

  return jsonResponse(200, {
    uploadUrl,
    publicUrl: `${MEDIA_BASE_URL}/${key.replace(/^media\//, '')}`,
  });
}

// --- /admin/products ---------------------------------------------------------

export async function getAdminProducts(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const auth = await requireSession(event);
  if (!auth.ok) return auth.response;
  return jsonResponse(200, { items: await listProducts() });
}

/** Create or update a ready-made hoop. */
export async function postAdminProduct(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const auth = await requireSession(event);
  if (!auth.ok) return auth.response;

  const parsed = parseBody(event, adminProductSchema);
  if (!parsed.ok) return parsed.response;

  const input = parsed.data;
  const existing = input.id ? await getProduct(input.id) : undefined;

  if (input.id && !existing) return jsonResponse(404, { error: 'That hoop no longer exists.' });

  // Don't let an edit yank a hoop out from under a live checkout, or wipe the
  // record of one that's already sold.
  if (existing && (existing.status === 'reserved' || existing.status === 'sold')) {
    if (input.status !== existing.status) {
      return jsonResponse(409, {
        error: `“${existing.title}” is ${existing.status}. Use the order to change that, not the catalogue.`,
      });
    }
  }

  const hoop: ReadyMadeHoop = {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    title: input.title,
    description: input.description,
    sizeInches: input.sizeInches,
    tubingId: input.tubingId,
    jointId: input.jointId,
    tapeSummary: input.tapeSummary,
    pricePence: input.pricePence,
    status: input.status,
    photos: input.photos,
    // Preserve any live hold.
    reservedUntil: existing?.reservedUntil,
    reservedBy: existing?.reservedBy,
  };

  await putProduct(hoop);
  return jsonResponse(200, { item: hoop });
}

/** Soft delete — archived hoops drop out of the public list but stay in the table. */
export async function patchAdminProduct(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const auth = await requireSession(event);
  if (!auth.ok) return auth.response;

  const parsed = parseBody(event, adminProductSchema.pick({ id: true }).required({ id: true }));
  if (!parsed.ok) return parsed.response;

  const existing = await getProduct(parsed.data.id);
  if (!existing) return jsonResponse(404, { error: 'That hoop no longer exists.' });
  if (existing.status === 'reserved') {
    return jsonResponse(409, { error: 'That hoop is held by a checkout in progress.' });
  }

  await archiveProduct(parsed.data.id);
  return jsonResponse(200, { ok: true });
}

// --- /admin/orders -----------------------------------------------------------

export async function getAdminOrders(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const auth = await requireSession(event);
  if (!auth.ok) return auth.response;
  return jsonResponse(200, { items: await listOrders() });
}

export async function patchAdminOrder(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const auth = await requireSession(event);
  if (!auth.ok) return auth.response;

  const parsed = parseBody(event, adminOrderPatchSchema);
  if (!parsed.ok) return parsed.response;

  const order = await getOrder(parsed.data.id);
  if (!order) return jsonResponse(404, { error: 'That order no longer exists.' });

  await updateOrderStatus(parsed.data.id, parsed.data.status, parsed.data.trackingNumber);

  // Tell the customer once, on the transition into dispatched.
  if (parsed.data.status === 'dispatched' && order.status !== 'dispatched') {
    try {
      await sendDispatchEmail({
        ...order,
        status: 'dispatched',
        trackingNumber: parsed.data.trackingNumber ?? order.trackingNumber,
      });
    } catch (err) {
      console.error('Dispatch email failed (non-fatal):', err);
    }
  }

  return jsonResponse(200, { ok: true });
}
