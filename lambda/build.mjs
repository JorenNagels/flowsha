import * as esbuild from 'esbuild';
import { writeFileSync } from 'fs';

const shared = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  external: ['@aws-sdk/*'],
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
