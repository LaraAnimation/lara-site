/**
 * Upload local files to Cloudflare R2.
 *
 * Usage:
 *   npx tsx scripts/upload-to-r2.ts path/to/file.mp4
 *   npx tsx scripts/upload-to-r2.ts public/images/paintings --prefix paintings/
 *   npx tsx scripts/upload-to-r2.ts ./assets/reel.mp4 --key films/reel-2024.mp4
 *
 * Requires .env.local (or .env) with R2 credentials — see .env.example.
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config as loadEnv } from "dotenv";
import { createR2Client, getR2BucketName } from "../src/lib/r2";
import { r2Url } from "../src/lib/media";

loadEnv({ path: ".env.local" });
loadEnv(); // fallback .env

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
};

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  let prefix = "";
  let keyOverride: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--prefix") {
      prefix = argv[++i] ?? "";
      if (prefix && !prefix.endsWith("/")) prefix += "/";
    } else if (arg === "--key") {
      keyOverride = argv[++i];
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown flag: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length === 0) {
    throw new Error(
      "Usage: npx tsx scripts/upload-to-r2.ts <file-or-dir> [--prefix folder/] [--key object-key]",
    );
  }

  return { target: positional[0], prefix, keyOverride };
}

async function collectFiles(target: string): Promise<string[]> {
  const abs = path.resolve(target);
  if (!existsSync(abs)) {
    throw new Error(`Path not found: ${abs}`);
  }
  const stat = statSync(abs);
  if (stat.isFile()) return [abs];

  async function walk(dir: string): Promise<string[]> {
    const out: string[] = [];
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...(await walk(full)));
      else if (entry.isFile()) out.push(full);
    }
    return out;
  }

  return walk(abs);
}

async function uploadFile(
  client: ReturnType<typeof createR2Client>,
  bucket: string,
  filePath: string,
  key: string,
) {
  const Body = createReadStream(filePath);
  const ContentType = contentTypeFor(filePath);
  const size = statSync(filePath).size;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body,
      ContentType,
      // Helpful for CDN caching of static media
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  console.log(`✓ ${key} (${ContentType}, ${(size / 1024).toFixed(1)} KB)`);
  console.log(`  → ${r2Url(key)}`);
}

async function main() {
  const { target, prefix, keyOverride } = parseArgs(process.argv.slice(2));
  const client = createR2Client();
  const bucket = getR2BucketName();
  const files = await collectFiles(target);

  if (files.length === 0) {
    console.log("No files to upload.");
    return;
  }

  if (keyOverride && files.length > 1) {
    throw new Error("--key can only be used when uploading a single file.");
  }

  const root = path.resolve(target);
  const rootIsFile = statSync(root).isFile();

  for (const file of files) {
    const relative = rootIsFile
      ? path.basename(file)
      : path.relative(root, file).split(path.sep).join("/");
    const key = keyOverride ?? `${prefix}${relative}`;
    await uploadFile(client, bucket, file, key);
  }

  console.log(`\nUploaded ${files.length} file(s) to bucket "${bucket}".`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
