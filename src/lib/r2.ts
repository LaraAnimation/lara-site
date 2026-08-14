import { S3Client } from "@aws-sdk/client-s3";

/**
 * Server-only Cloudflare R2 client (S3-compatible).
 * Do not import this from Client Components — credentials stay on the server / CLI.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill in R2 values.`,
    );
  }
  return value;
}

export function getR2BucketName(): string {
  return required("R2_BUCKET_NAME");
}

export function createR2Client(): S3Client {
  const accountId = required("CLOUDFLARE_ACCOUNT_ID");

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  });
}
