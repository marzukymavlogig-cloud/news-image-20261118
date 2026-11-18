// news-image-20261118 — "The World in One Picture": a newspaper front page
// summing up Wednesday 18 November 2026, drawn as a 1024x1024 PNG.
//
// The program copies the image the repository holds to the grader's output
// directory as /output/entry.png. The image was designed and rendered by the
// entrant's agent (HTML + inline SVG, rendered once to PNG during the build);
// this program only validates it and copies it, so both graded runs write
// byte-identical output.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by 1024 pixels.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const SRC = new URL('./entry.png', import.meta.url);
const DEST = join(OUT_DIR, 'entry.png');

// The gate's limits for this competition: whole PNG, at most 1 MiB,
// at most 1024 by 1024 pixels.
const MAX_BYTES = 1048576;
const MAX_SIDE = 1024;

const bytes = readFileSync(SRC);
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
// PNG signature, then the IHDR chunk's width and height (big-endian u32).
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG file');
}
if (bytes.toString('ascii', 12, 16) !== 'IHDR') {
  throw new Error('entry.png has no IHDR chunk where one belongs');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > MAX_SIDE || height > MAX_SIDE) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}

mkdirSync(dirname(DEST), { recursive: true });
copyFileSync(SRC, DEST);
console.log(`wrote ${DEST} (${width}x${height}, ${bytes.length} bytes)`);
