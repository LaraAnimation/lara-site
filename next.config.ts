import type { NextConfig } from "next";

/** Hostnames allowed for next/image remote assets (R2 / custom CDN). */
function r2RemotePatterns(): NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> {
  const patterns: NonNullable<
    NonNullable<NextConfig["images"]>["remotePatterns"]
  > = [];

  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (publicUrl) {
    try {
      const { protocol, hostname, pathname } = new URL(publicUrl);
      patterns.push({
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        pathname: pathname && pathname !== "/" ? `${pathname.replace(/\/$/, "")}/**` : "/**",
      });
    } catch {
      console.warn(
        "[next.config] NEXT_PUBLIC_R2_PUBLIC_URL is invalid; skipping remotePatterns entry.",
      );
    }
  }

  // Optional extra host (e.g. media.larareneerenaudanimation.com)
  const extraHost = process.env.NEXT_PUBLIC_R2_HOSTNAME;
  if (extraHost && !patterns.some((p) => p.hostname === extraHost)) {
    patterns.push({
      protocol: "https",
      hostname: extraHost,
      pathname: "/**",
    });
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: r2RemotePatterns(),
  },
};

export default nextConfig;
