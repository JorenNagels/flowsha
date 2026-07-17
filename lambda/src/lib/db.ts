import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { FeedbackInput } from './validation.js';

// Set by CDK (see infrastructure/lib/flowsha-stack.ts). When unset — e.g. the
// local `npm run dev -w lambda` server with no AWS creds — saveFeedback logs the
// payload and skips the write, mirroring the config-gated Turnstile pattern.
const TABLE_NAME = process.env.FEEDBACK_TABLE_NAME || '';

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
