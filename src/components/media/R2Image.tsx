import Image, { type ImageProps } from "next/image";
import { r2Url } from "@/lib/media";
import { withBasePath } from "@/lib/paths";

type R2ImageProps = Omit<ImageProps, "src"> & {
  /** R2 object key (e.g. "paintings/hawaii.png") or absolute URL, or local public path */
  src: string;
  /** When true (default), resolve through NEXT_PUBLIC_R2_PUBLIC_URL when not absolute/local */
  fromR2?: boolean;
};

/**
 * Image that can load from Cloudflare R2 (remote) or local `/public` paths.
 * Local paths still get the GitHub Pages basePath via `withBasePath`.
 */
export function R2Image({ src, fromR2 = true, alt, ...rest }: R2ImageProps) {
  const isAbsolute = /^https?:\/\//i.test(src);
  const isLocalPublic = src.startsWith("/") && !isAbsolute;

  let resolved = src;
  if (isAbsolute) {
    resolved = src;
  } else if (isLocalPublic && !fromR2) {
    resolved = withBasePath(src);
  } else if (fromR2) {
    resolved = r2Url(src);
    // If R2 public URL isn't configured, fall back to local public path
    if (!/^https?:\/\//i.test(resolved) && resolved.startsWith("/")) {
      resolved = withBasePath(resolved);
    }
  } else {
    resolved = withBasePath(src.startsWith("/") ? src : `/${src}`);
  }

  return <Image src={resolved} alt={alt} {...rest} />;
}
