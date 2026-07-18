import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { FeedbackInput, WaiverInput } from './validation.js';

// Set by CDK (see infrastructure/lib/flowsha-stack.ts). When unset — e.g. the
// local `npm run dev -w lambda` server with no AWS creds — saveFeedback logs the
// payload and skips the write, mirroring the config-gated Turnstile pattern.
const TABLE_NAME = process.env.FEEDBACK_TABLE_NAME || '';
const WAIVER_TABLE_NAME = process.env.WAIVER_TABLE_NAME || '';

// Reused across warm invocations. `removeUndefinedValues` lets us pass through
// skipped answers without hand-pruning the item.
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

export async function saveFeedback(input: FeedbackInput): Promise<void> {
  // Transport-only fields — never persisted.
  const { company: _company, turnstileToken: _token, ...fields } = input;

  if (!TABLE_NAME) {
    console.log('[dev] feedback (no table configured):', JSON.stringify(fields));
    return;
  }

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...fields },
    }),
  );
}

// Every stored feedback item (see saveFeedback). All feedback answers are
// optional, so consumers should render defensively.
export type FeedbackRecord = {
  id: string;
  createdAt: string;
  [key: string]: unknown;
};

// Scan an entire table, following LastEvaluatedKey so we return every record
// (a single Scan caps at 1 MB — without this loop, results silently truncate
// once the table grows past ~1,000 rows). The dashboard sorts + paginates.
async function scanAll(tableName: string): Promise<Record<string, unknown>[]> {
  const items: Record<string, unknown>[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const res = await docClient.send(new ScanCommand({ TableName: tableName, ExclusiveStartKey }));
    if (res.Items) items.push(...res.Items);
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

// List all submissions for the dashboard. The table has only a partition key
// (`id`), so a Scan is the way to enumerate; the dashboard sorts by createdAt.
// Returns [] with no table (local dev).
export async function listFeedback(): Promise<FeedbackRecord[]> {
  if (!TABLE_NAME) return [];
  return (await scanAll(TABLE_NAME)) as FeedbackRecord[];
}

// --- Waivers (PAR-Q + Informed Consent) -------------------------------------

// Server-captured audit trail stored alongside each signed waiver — evidence of
// intent/attribution for the electronic signature (see lambda/src/handler.ts).
export type WaiverMeta = {
  signedIp?: string;
  userAgent?: string;
  waiverVersion: string;
};

export async function saveWaiver(input: WaiverInput, meta: WaiverMeta): Promise<void> {
  // Transport-only fields — never persisted.
  const { company: _company, turnstileToken: _token, ...fields } = input;

  if (!WAIVER_TABLE_NAME) {
    console.log('[dev] waiver (no table configured):', JSON.stringify({ ...fields, ...meta }));
    return;
  }

  await docClient.send(
    new PutCommand({
      TableName: WAIVER_TABLE_NAME,
      Item: {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...fields,
        ...meta,
      },
    }),
  );
}

export type WaiverRecord = {
  id: string;
  createdAt: string;
  [key: string]: unknown;
};

// List all signed waivers for the dashboard. Same full-table Scan pattern as
// listFeedback; returns [] with no table (local dev).
export async function listWaivers(): Promise<WaiverRecord[]> {
  if (!WAIVER_TABLE_NAME) return [];
  return (await scanAll(WAIVER_TABLE_NAME)) as WaiverRecord[];
}
