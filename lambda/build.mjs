import * as esbuild from 'esbuild';
import { writeFileSync } from 'fs';

const shared = {
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  // Lets dynamic import() produce separate chunks — see the S3 SDK in
  // routes/admin.ts, which must not weigh down every other route's cold start.
  splitting: true,
  // Externalise ONLY the clients the Lambda runtime already ships. A blanket
  // '@aws-sdk/*' silently externalises new packages too (e.g.
  // @aws-sdk/s3-request-presigner), which then fail at runtime with
  // "Cannot find module". Anything not listed here gets bundled.
  external: [
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/client-ses',
    '@aws-sdk/client-ssm',
    '@aws-sdk/lib-dynamodb',
  ],
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
};

await esbuild.build({
  ...shared,
  entryPoints: ['src/handler.ts'],
  outdir: 'dist/handler',
});

// Lambda needs this to treat .js as ESM
writeFileSync('dist/handler/package.json', JSON.stringify({ type: 'module' }));

console.log('Build complete.');
