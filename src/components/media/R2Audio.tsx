import type { ComponentPropsWithoutRef } from "react";
import { r2Url } from "@/lib/media";
import { withBasePath } from "@/lib/paths";

type R2AudioProps = Omit<ComponentPropsWithoutRef<"audio">, "src"> & {
  /** R2 object key (e.g. "audio/score.mp3") or absolute URL */
  src: string;
  fromR2?: boolean;
};

function resolveMediaSrc(src: string, fromR2: boolean): string {
  if (/^https?:\/\//i.test(src)) return src;
  if (fromR2) {
    const url = r2Url(src);
    if (/^https?:\/\//i.test(url)) return url;
  }
  return withBasePath(src.startsWith("/") ? src : `/${src}`);
}

/** HTML5 audio from Cloudflare R2 (or local /public fallback). */
export function R2Audio({
  src,
  fromR2 = true,
  controls = true,
  preload = "metadata",
  ...rest
}: R2AudioProps) {
  return (
    <audio
      src={resolveMediaSrc(src, fromR2)}
      controls={controls}
      preload={preload}
      {...rest}
    />
  );
}
