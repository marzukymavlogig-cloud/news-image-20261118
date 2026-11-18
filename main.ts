// news-image-20261118 — entrypoint
//
// Reads the poster image (entry.png, sitting next to this file), checks that
// it is a well-formed PNG within the competition limits, and copies it into
// the output directory so the harness can pick it up.
//
// Usage:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// When MAKEFUN_OUTPUT_DIR is not set, the image goes to /output.

import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const SOURCE_NAME = "entry.png";
const MAX_BYTES = 1024 * 1024; // 1 MiB
const MAX_SIDE = 1024; // pixels

// The eight magic bytes every PNG file starts with.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(message: string): never {
  throw new Error(`entry.png rejected: ${message}`);
}

// Pull width and height out of the IHDR chunk (the first chunk after the
// 8-byte signature). Layout: 4-byte length, 4-byte type "IHDR", then width
// and height as 4-byte big-endian integers.
function readDimensions(buffer: Buffer): { width: number; height: number } {
  if (buffer.length < 8 + 8 + 13) {
    fail("file is too short to hold a PNG header (needs at least 29 bytes)");
  }
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail("missing PNG magic bytes — this is not a PNG file");
  }
  const chunkLength = buffer.readUInt32BE(8);
  const chunkType = buffer.subarray(12, 16).toString("latin1");
  if (chunkType !== "IHDR" || chunkLength !== 13) {
    fail("first chunk is not a 13-byte IHDR chunk");
  }
  // A complete PNG ends with a 12-byte IEND chunk (zero length, "IEND",
  // then a CRC). If it is absent the file was truncated mid-write.
  const tail = buffer.subarray(buffer.length - 12);
  if (tail.readUInt32BE(0) !== 0 || tail.subarray(4, 8).toString("latin1") !== "IEND") {
    fail("missing trailing IEND chunk — the file looks truncated");
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function main(): Promise<void> {
  const source = resolve(import.meta.dirname, SOURCE_NAME);
  const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  const destination = join(outputDir, SOURCE_NAME);

  const info = await stat(source).catch(() => {
    fail(`cannot find ${source}`);
  });
  if (info.size > MAX_BYTES) {
    fail(`is ${info.size} bytes, over the ${MAX_BYTES} byte limit`);
  }

  const bytes = await readFile(source);
  const { width, height } = readDimensions(bytes);
  if (width > MAX_SIDE || height > MAX_SIDE) {
    fail(`is ${width}x${height}px, over the ${MAX_SIDE}x${MAX_SIDE} limit`);
  }

  await mkdir(outputDir, { recursive: true });
  await copyFile(source, destination);

  console.log(`wrote ${destination}`);
  console.log(`dimensions: ${width}x${height}`);
  console.log(`size: ${info.size} bytes`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
