import type { NextConfig } from "next";

// Sent on every response. The CSP only sets directives that need no script/style allow list,
// so it blocks framing, <base> hijacking, plugins and off-site form posts without breaking Next.js.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // A stray lockfile in the user's home dir otherwise makes Turbopack pick the wrong root.
  turbopack: { root: __dirname },
  images: {
    // Listing photos come from Unsplash (resized by its CDN via src/lib/unsplash-loader.ts).
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*" }],
    qualities: [75, 80],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
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
