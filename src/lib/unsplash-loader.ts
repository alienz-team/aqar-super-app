import type { ImageLoaderProps } from "next/image";

/**
 * Lets Unsplash's CDN (imgix) do the resizing and AVIF/WebP negotiation, so next/image
 * still emits a responsive srcset but no Vercel image-optimization requests are spent.
 */
export function unsplashLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}
