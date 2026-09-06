// Derives every brand asset the site needs from the single source logo.
//
//   brand/logo.svg  ──▶  web/public/brand/flowsha-logo.svg         (the logo, colours verbatim)
//                   ──▶  web/public/brand/archive-logo-knockout.svg (rejected variant, /15 only)
//                   ──▶  web/public/brand/flowsha-logo-email.png   (raster, for SES templates)
//                   ──▶  web/src/app/icon.svg                      (favicon — the spiral sun alone)
//                   ──▶  web/public/brand/apple-touch-icon.png     (180×180 home-screen icon)
//
// Run it whenever brand/logo.svg changes:  node scripts/prep-brand.mjs
//
// The logo is NEVER recoloured. It's a two-colour illustration — a green figure with an
// orange hoop — and repainting the figure cream so it survives a dark background reads as
// a different logo. The rule is the other way round: **the logo always sits on something
// light.** Each placement brings its own light background rather than bending the artwork.
//
// It also ships as a static file rather than inline JSX: 21 kB of path data inlined in both
// the nav and the footer would add ~20 kB gzip to every page's HTML, a real cost on an
// SEO-first static site. One cached request instead.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => join(root, ...parts);

// The artwork's two ink colours are already exactly the palette's `forest` and
// `terracotta`, so nothing needs remapping. SRC_ORANGE is only used to locate the path
// the spiral sun lives in.
const SRC_GREEN = '#4C7252';
const SRC_ORANGE = '#D3793B';
const TERRACOTTA = '#d3793b'; // colors.terracotta.DEFAULT
const CREAM = '#f7f1e3'; // colors.cream

const source = readFileSync(p('brand/logo.svg'), 'utf8');

function write(relPath, contents) {
  const out = p(relPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, contents);
  console.log(`  ${relPath}  (${(Buffer.byteLength(contents) / 1024).toFixed(1)} kB)`);
}

console.log('Brand assets:');

// --- 1. The logo. Colours untouched; only the fixed width/height dropped so CSS sizes it.
const logo = source.replace(/^<svg width="\d+" height="\d+" /, '<svg ');
write('web/public/brand/flowsha-logo.svg', logo);

// ARCHIVE ASSET, not for shipping. The cream "knockout" — figure repainted cream, hoop
// left orange — is the industry-standard treatment for dark backgrounds and was the first
// option rejected. It exists only so trial /15 can show it accurately; a CSS filter would
// flatten the hoop to cream too and misrepresent what was actually turned down.
write('web/public/brand/archive-logo-knockout.svg', logo.replaceAll(SRC_GREEN, CREAM));

// --- 2. The spiral sun, extracted as a standalone mark ---------------------------------
// The full figure is unreadable below ~44px, so the favicon uses the sun instead. It sits
// in the orange path as nine discrete subpaths, all inside the top-left corner of the
// 670×896 canvas. Selecting them by bounding box (rather than hardcoding indices) means
// this keeps working if the source path data is ever re-exported.
const orangePath = [...source.matchAll(/ d="([^"]+)"[^>]*fill="(#[0-9A-Fa-f]{6})"/g)]
  .map((m) => ({ d: m[1], fill: m[2] }))
  .find((path) => path.fill.toUpperCase() === SRC_ORANGE);

if (!orangePath) throw new Error('Could not find the orange path in brand/logo.svg');

/** Rough bounding box from the raw coordinate pairs — the path data is all absolute. */
function bounds(subpath) {
  const nums = (subpath.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (let i = 0; i + 1 < nums.length; i += 2) {
    box.x0 = Math.min(box.x0, nums[i]);
    box.x1 = Math.max(box.x1, nums[i]);
    box.y0 = Math.min(box.y0, nums[i + 1]);
    box.y1 = Math.max(box.y1, nums[i + 1]);
  }
  return box;
}

// The sun and its petals all fall inside this corner; the hoop and flourishes do not.
const SUN_REGION = { x: 260, y: 280 };
const sunSubpaths = orangePath.d
  .split(/(?=M)/)
  .filter((s) => s.trim())
  .filter((s) => {
    const b = bounds(s);
    return b.x1 < SUN_REGION.x && b.y1 < SUN_REGION.y;
  });

if (sunSubpaths.length < 5) {
  throw new Error(`Expected the spiral sun to be ~9 subpaths, found ${sunSubpaths.length}`);
}

const sunBox = sunSubpaths.reduce((acc, s) => {
  const b = bounds(s);
  return {
    x0: Math.min(acc.x0, b.x0),
    y0: Math.min(acc.y0, b.y0),
    x1: Math.max(acc.x1, b.x1),
    y1: Math.max(acc.y1, b.y1),
  };
}, bounds(sunSubpaths[0]));

// Pad to a square viewBox so the mark stays optically centred at every size.
const side = Math.max(sunBox.x1 - sunBox.x0, sunBox.y1 - sunBox.y0);
const vx = sunBox.x0 - (side - (sunBox.x1 - sunBox.x0)) / 2;
const vy = sunBox.y0 - (side - (sunBox.y1 - sunBox.y0)) / 2;
const sunD = sunSubpaths.map((s) => s.trim()).join('');
const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(2)} ${vy.toFixed(2)} ${side.toFixed(2)} ${side.toFixed(2)}">\n  <path d="${sunD}" fill="${TERRACOTTA}"/>\n</svg>\n`;

console.log(`  (sun: ${sunSubpaths.length} subpaths, viewBox ${side.toFixed(0)}²)`);
write('web/src/app/icon.svg', sunSvg);
// Same mark, also exposed to components — it's the brand's "simplified small-scale
// alternative", usable anywhere the full figure is too detailed or too dark to read.
write('web/public/brand/flowsha-sun.svg', sunSvg);

// --- 3. Rasters ------------------------------------------------------------------------
// Apple touch icons are composited onto the home screen with no transparency handling, so
// this one needs an opaque square. Cream, with the sun kept its own orange — consistent
// with the favicon and with the "logo sits on light" rule.
//
// It deliberately does NOT use the App Router's `app/apple-icon.png` convention: that
// makes next-image-export-optimizer treat it as a content image and emit eight useless
// WEBP variants into web/public/. Declared in layout.tsx metadata instead.
const appleIcon = await sharp(Buffer.from(sunSvg), { density: 900 })
  .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 20, bottom: 20, left: 20, right: 20, background: CREAM })
  .flatten({ background: CREAM })
  .png()
  .toBuffer();
mkdirSync(p('web/public/brand'), { recursive: true });
writeFileSync(p('web/public/brand/apple-touch-icon.png'), appleIcon);
console.log(
  `  web/public/brand/apple-touch-icon.png  (${(appleIcon.length / 1024).toFixed(1)} kB, 180×180)`,
);

// Email clients won't render SVG, so transactional templates reference this PNG at an
// absolute HTTPS URL. Colours untouched — the template gives it a light band to sit on.
const emailLogo = await sharp(Buffer.from(logo), { density: 900 })
  .resize({ height: 240 })
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(p('web/public/brand/flowsha-logo-email.png'), emailLogo);
console.log(
  `  web/public/brand/flowsha-logo-email.png  (${(emailLogo.length / 1024).toFixed(1)} kB)`,
);

console.log('Done.');
