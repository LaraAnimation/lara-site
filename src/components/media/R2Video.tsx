"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { r2Url } from "@/lib/media";
import { withBasePath } from "@/lib/paths";

type R2VideoProps = Omit<
  ComponentPropsWithoutRef<"video">,
  "src" | "controls" | "poster" | "preload"
> & {
  /** R2 object key (e.g. "films/reel-2024.mp4") or absolute URL */
  src: string;
  /** Optional poster image key or URL */
  poster?: string;
  fromR2?: boolean;
  /** Show native controls after play starts (default true) */
  controls?: boolean;
  /** Preload strategy (default "none" when poster is set, else "metadata") */
  preload?: "" | "none" | "metadata" | "auto";
};

function resolveMediaSrc(src: string, fromR2: boolean): string {
  if (/^https?:\/\//i.test(src)) return src;
  if (fromR2) {
    const url = r2Url(src);
    if (/^https?:\/\//i.test(url)) return url;
  }
  return withBasePath(src.startsWith("/") ? src : `/${src}`);
}

function resolvePosterSrc(poster: string, fromR2: boolean): string {
  return resolveMediaSrc(poster, poster.startsWith("/") ? false : fromR2);
}

/** Some mobile browsers paint the first frame when the URL includes a time fragment. */
function withFirstFrameHint(src: string, hasPoster: boolean): string {
  if (hasPoster || /#t=/i.test(src)) return src;
  return `${src}#t=0.001`;
}

/**
 * HTML5 video from R2 with a large centered play button (Wix-style).
 * Uses an explicit poster image when provided — required for reliable
 * thumbnails on iOS Safari, which often skips first-frame preview.
 */
export function R2Video({
  src,
  poster,
  fromR2 = true,
  controls = true,
  preload,
  playsInline = true,
  className,
  "aria-label": ariaLabel,
  ...rest
}: R2VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasPoster = Boolean(poster);
  const videoSrc = withFirstFrameHint(resolveMediaSrc(src, fromR2), hasPoster);
  const posterSrc = poster ? resolvePosterSrc(poster, fromR2) : undefined;
  const effectivePreload = preload ?? (hasPoster ? "none" : "metadata");

  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    void el.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const onPlay = useCallback(() => setPlaying(true), []);
  const onPause = useCallback(() => setPlaying(false), []);
  const onEnded = useCallback(() => setPlaying(false), []);

  useEffect(() => {
    if (hasPoster) return;
    const el = videoRef.current;
    if (!el) return;

    const seekToFirstFrame = () => {
      if (el.currentTime === 0 && el.readyState >= 1) {
        try {
          el.currentTime = 0.001;
        } catch {
          /* iOS may block seek before user gesture */
        }
      }
    };

    el.addEventListener("loadedmetadata", seekToFirstFrame);
    el.addEventListener("loadeddata", seekToFirstFrame);
    return () => {
      el.removeEventListener("loadedmetadata", seekToFirstFrame);
      el.removeEventListener("loadeddata", seekToFirstFrame);
    };
  }, [hasPoster, videoSrc]);

  return (
    <div
      className={`r2-video ${playing ? "is-playing" : ""}${hasPoster ? " has-poster" : ""}`}
    >
      {posterSrc && !playing ? (
        // eslint-disable-next-line @next/next/no-img-element -- poster URL is external R2/CDN
        <img
          src={posterSrc}
          alt=""
          className={`r2-video__poster ${className ?? ""}`}
          aria-hidden
          decoding="async"
        />
      ) : null}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        controls={controls && playing}
        preload={effectivePreload}
        playsInline={playsInline}
        className={className}
        aria-label={ariaLabel}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        {...rest}
      />
      {!playing ? (
        <button
          type="button"
          className="r2-video__play"
          onClick={play}
          aria-label={ariaLabel ? `Play ${ariaLabel}` : "Play video"}
        >
          <span className="r2-video__play-icon" aria-hidden>
            ▶
          </span>
        </button>
      ) : null}
    </div>
  );
}
