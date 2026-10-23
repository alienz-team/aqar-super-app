import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the user's home dir otherwise makes Turbopack pick the wrong root.
  turbopack: { root: __dirname },
  images: {
    // Listing photos come from Unsplash (resized by its CDN via src/lib/unsplash-loader.ts).
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*" }],
    qualities: [75, 80],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
