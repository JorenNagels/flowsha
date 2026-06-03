// CORS is handled by the Lambda Function URL config in CDK.
// This file only provides the JSON response helper.

export function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}
