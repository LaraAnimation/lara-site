/**
 * Generate poster JPGs from R2-hosted videos and upload them back to R2.
 *
 * Usage:
 *   npx tsx scripts/generate-video-posters.ts
 *   npx tsx scripts/generate-video-posters.ts --dry-run
 *
 * Requires .env.local with NEXT_PUBLIC_R2_PUBLIC_URL (download) and R2 credentials (upload).
 */

import { createWriteStream, existsSync, rmSync } from "node:fs";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { config as loadEnv } from "dotenv";
import { createR2Client, getR2BucketName } from "../src/lib/r2";
import { posterKeyForVideo, r2Url } from "../src/lib/media";

loadEnv({ path: ".env.local" });
loadEnv();

const VIDEO_KEYS = [
  "films/reel-2024-update3.mp4",
  "films/the-household.mp4",
  "films/the-escape.mp4",
  "films/merry.mp4",
  "films/un-write.mp4",
  "films/paradox.mp4",
];

function parseArgs(argv: string[]) {
  return { dryRun: argv.includes("--dry-run") };
}

async function downloadFromR2(key: string, dest: string): Promise<void> {
  const client = createR2Client();
  const bucket = getR2BucketName();
  const response = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  if (!response.Body) throw new Error(`Empty response for ${key}`);

  await new Promise<void>((resolve, reject) => {
    const stream = createWriteStream(dest);
    // @ts-expect-error AWS SDK body is a readable stream
    response.Body.pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

async function downloadFromPublicUrl(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

async function downloadVideo(
  videoKey: string,
  dest: string,
  hasR2Creds: boolean,
): Promise<void> {
  if (hasR2Creds) {
    await downloadFromR2(videoKey, dest);
    return;
  }

  const url = r2Url(videoKey);
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(
      `Cannot download ${videoKey}: set R2 credentials or NEXT_PUBLIC_R2_PUBLIC_URL`,
    );
  }
  await downloadFromPublicUrl(url, dest);
}

function extractPoster(videoPath: string, posterPath: string, atSeconds = 2): void {
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-ss",
      String(atSeconds),
      "-i",
      videoPath,
      "-frames:v",
      "1",
      "-update",
      "1",
      "-q:v",
      "2",
      posterPath,
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${videoPath}`);
  }
  if (!existsSync(posterPath)) {
    throw new Error(`Poster not created: ${posterPath}`);
  }
}

async function uploadPoster(key: string, filePath: string): Promise<void> {
  const client = createR2Client();
  const bucket = getR2BucketName();
  const body = await readFile(filePath);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

async function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));
  const hasR2Creds = Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME,
  );
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");

  if (!hasR2Creds && !publicBase) {
    throw new Error(
      "Set NEXT_PUBLIC_R2_PUBLIC_URL and/or R2 credentials in .env.local",
    );
  }

  if (!dryRun && !hasR2Creds) {
    throw new Error("R2 upload credentials are required unless using --dry-run");
  }

  const workDir = await mkdtemp(path.join(tmpdir(), "video-posters-"));
  console.log(`Working in ${workDir}`);

  try {
    for (const videoKey of VIDEO_KEYS) {
      const posterKey = posterKeyForVideo(videoKey);
      const videoPath = path.join(workDir, path.basename(videoKey));
      const posterPath = path.join(workDir, path.basename(posterKey));

      console.log(`\n→ ${videoKey}`);

      try {
        console.log("  downloading...");
        await downloadVideo(videoKey, videoPath, hasR2Creds);
      } catch (err) {
        console.warn(`  skipped — ${err instanceof Error ? err.message : err}`);
        continue;
      }

      console.log("  extracting poster frame...");
      extractPoster(videoPath, posterPath);

      if (dryRun) {
        console.log(`  dry-run — would upload ${posterKey}`);
        continue;
      }

      console.log(`  uploading ${posterKey}...`);
      await uploadPoster(posterKey, posterPath);
      console.log(`  ✓ ${r2Url(posterKey)}`);
    }
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
