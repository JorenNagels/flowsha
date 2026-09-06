// Cached SSM SecureString loader.
//
// Turnstile needed this, and Stripe needs it twice more (secret key + webhook
// signing secret), so the fetch-once-and-cache dance lives here rather than being
// copy-pasted per secret.
//
// Every secret follows the same two-source convention:
//   • <NAME>            — an inline value, used by the local dev Lambda
//   • <NAME>_PARAM      — the name of an SSM SecureString, used in production
// Neither set means the feature is off, which is what lets `npm run dev -w lambda`
// run with no AWS credentials at all.

import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

let ssmClient: SSMClient | undefined;

// Keyed by parameter name; persists across warm invocations.
const cache = new Map<string, string>();

/**
 * Resolve a secret from an inline value or an SSM SecureString.
 * Returns '' when neither is configured — callers treat that as "feature off".
 */
export async function loadSecret(directValue: string, paramName: string): Promise<string> {
  if (directValue) return directValue;
  if (!paramName) return '';

  const cached = cache.get(paramName);
  if (cached !== undefined) return cached;

  ssmClient ??= new SSMClient({ region: process.env.AWS_REGION });
  const res = await ssmClient.send(
    new GetParameterCommand({ Name: paramName, WithDecryption: true }),
  );
  const value = res.Parameter?.Value ?? '';
  cache.set(paramName, value);
  return value;
}
