import http from 'node:http';
import { handler } from './src/handler.ts';

const PORT = 3001;
const DEV_ORIGIN = 'http://localhost:3000';

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', DEV_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString();

  const event = {
    rawPath: req.url,
    requestContext: { http: { method: req.method } },
    headers: req.headers,
    body: body || undefined,
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
