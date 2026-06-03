// One-time / repeatable source-image prep.
//
// Reads the full-size originals from /img (gitignored, ~24MB each) and writes
// web-sized JPEGs into web/public/images/gallery/. next-image-export-optimizer
// then generates the responsive WebP variants from these at build time.
//
// Also writes small thumbnails into .image-review/ so we can eyeball which shots
// to feature (hero / about) without opening the huge originals.
//
// Usage: node scripts/prep-images.mjs
import { readdir, mkdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'img');
const GALLERY = join(root, 'web/public/images/gallery');
const THUMBS = join(root, '.image-review');

const MAX_EDGE = 2400; // plenty for web; the optimizer caps display sizes further
const THUMB_EDGE = 420;
const QUALITY = 80;

async function main() {
  await mkdir(GALLERY, { recursive: true });
  await mkdir(THUMBS, { recursive: true });

  const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();

  if (files.length === 0) {
    console.error(`No source images found in ${SRC}`);
    process.exit(1);
  }

  let i = 0;
  for (const file of files) {
    i += 1;
    const n = String(i).padStart(2, '0');
    const src = join(SRC, file);
    const outName = `hoop-${n}.jpg`;

    await sharp(src)
      .rotate() // respect EXIF orientation
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(join(GALLERY, outName));

    await sharp(src)
      .rotate()
      .resize({ width: THUMB_EDGE, height: THUMB_EDGE, fit: 'inside' })
      .jpeg({ quality: 70 })
      .toFile(join(THUMBS, `${n}-${file.replace(extname(file), '')}.jpg`));

    console.log(`${file}  →  gallery/${outName}`);
  }

  console.log(`\nDone: ${files.length} images → web/public/images/gallery/`);
  console.log(`Thumbnails for review → .image-review/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
