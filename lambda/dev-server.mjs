import http from 'node:http';
import { handler } from './src/handler.ts';

const PORT = Number(process.env.PORT) || 3001;
// Next picks whatever port is free, so the web dev server is not always on 3000.
// Reflect any localhost origin rather than hard-coding one — this file is local
// dev only; production CORS is set on the Function URL in CDK.
const LOCALHOST_ORIGIN = /^http:\/\/localhost:\d+$/;

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin ?? '';
  res.setHeader(
    'Access-Control-Allow-Origin',
    LOCALHOST_ORIGIN.test(origin) ? origin : 'http://localhost:3000',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  // Authorization is needed to exercise the Clerk-gated dashboard + admin
  // routes locally; without it the browser blocks the preflight.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString();

  // rawPath must exclude the query string, or `/products?x=1` misses the route table.
  const url = new URL(req.url, `http://localhost:${PORT}`);

  const event = {
    rawPath: url.pathname,
    rawQueryString: url.search.replace(/^\?/, ''),
    queryStringParameters: Object.fromEntries(url.searchParams),
    requestContext: { http: { method: req.method, sourceIp: '127.0.0.1' } },
    headers: req.headers,
    body: body || undefined,
    isBase64Encoded: false,
  };

  try {
    const result = await handler(event);
    res.writeHead(result.statusCode, result.headers);
    res.end(result.body);
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Contact Lambda dev server running at http://localhost:${PORT}`);
});
