import type { NextConfig } from "next";

const repo = "lara-site";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? `/${repo}` : "";

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
        // Keep any path prefix from the public URL (e.g. /bucket)
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
  output: "export",
  // GitHub project Pages lives at /lara-site — local/dev stays at /
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    // Static export / GitHub Pages cannot run the Image Optimization server.
    // Keep unoptimized for now; remotePatterns still validates remote src hosts.
    unoptimized: true,
    remotePatterns: r2RemotePatterns(),
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
