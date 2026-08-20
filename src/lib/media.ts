/**
 * Client-safe helpers for public R2 / CDN media URLs.
 * Uses only NEXT_PUBLIC_* env vars — safe in browser code.
 */

/** Public base URL for the R2 bucket or custom CDN (no trailing slash). */
export function getR2PublicBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  return base;
}

/**
 * Build a full public URL for an object key in R2.
 * @example r2Url("films/reel-2024.mp4") → "https://media.example.com/films/reel-2024.mp4"
 * @example r2Url("https://cdn.example.com/x.png") → unchanged absolute URL
 */
export function r2Url(keyOrUrl: string): string {
  if (!keyOrUrl) return "";
  if (
    keyOrUrl.startsWith("http://") ||
    keyOrUrl.startsWith("https://") ||
    keyOrUrl.startsWith("data:") ||
    keyOrUrl.startsWith("blob:")
  ) {
    return keyOrUrl;
  }

  const base = getR2PublicBaseUrl();
  if (!base) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[media] NEXT_PUBLIC_R2_PUBLIC_URL is not set; returning key as-is:",
        keyOrUrl,
      );
    }
    return keyOrUrl.startsWith("/") ? keyOrUrl : `/${keyOrUrl}`;
  }

  const key = keyOrUrl.replace(/^\//, "");
  return `${base}/${key}`;
}

/** True when a src points at the configured R2 public host (or any absolute URL). */
export function isRemoteMediaUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

/** Poster JPG key derived from a video object key (films/foo.mp4 → films/foo-poster.jpg). */
export function posterKeyForVideo(videoKey: string): string {
  return videoKey.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg");
}

/** Public URL for a poster image matching an R2 video key. */
export function r2PosterUrl(videoKey: string): string {
  return r2Url(posterKeyForVideo(videoKey));
}
