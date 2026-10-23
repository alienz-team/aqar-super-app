import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "AQAR | عقار - Super App",
    short_name: "AQAR",
    description: "Properties, construction services and live building material prices in one app.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0A0A0A",
    theme_color: "#D4AF37",
    lang: "en",
    dir: "auto",
    categories: ["business", "lifestyle", "shopping"],
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Properties", url: "/properties", icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }] },
      { name: "Services", url: "/services", icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }] },
      { name: "Bourse & Calculator", url: "/bourse", icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }] },
    ],
  };
}
