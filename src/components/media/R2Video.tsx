"use client";

import {
  useCallback,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { r2Url } from "@/lib/media";
import { withBasePath } from "@/lib/paths";

type R2VideoProps = Omit<
  ComponentPropsWithoutRef<"video">,
  "src" | "controls"
> & {
  /** R2 object key (e.g. "films/reel-2024.mp4") or absolute URL */
  src: string;
  /** Optional poster image key or URL */
  poster?: string;
  fromR2?: boolean;
  /** Show native controls after play starts (default true) */
  controls?: boolean;
};

function resolveMediaSrc(src: string, fromR2: boolean): string {
  if (/^https?:\/\//i.test(src)) return src;
  if (fromR2) {
    const url = r2Url(src);
    if (/^https?:\/\//i.test(url)) return url;
  }
  return withBasePath(src.startsWith("/") ? src : `/${src}`);
}

/**
 * HTML5 video from R2 with a large centered play button (Wix-style).
 */
export function R2Video({
  src,
  poster,
  fromR2 = true,
  controls = true,
  preload = "metadata",
  playsInline = true,
  className,
  "aria-label": ariaLabel,
  ...rest
}: R2VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const videoSrc = resolveMediaSrc(src, fromR2);
  const posterSrc = poster ? resolveMediaSrc(poster, fromR2) : undefined;

  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    void el.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const onPlay = useCallback(() => setPlaying(true), []);
  const onPause = useCallback(() => setPlaying(false), []);
  const onEnded = useCallback(() => setPlaying(false), []);

  return (
    <div className={`r2-video ${playing ? "is-playing" : ""}`}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        controls={controls && playing}
        preload={preload}
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
