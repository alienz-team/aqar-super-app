import type { Metadata, Viewport } from "next";
import { Amiri, Cairo, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { LanguageProvider, langBootScript } from "@/components/providers/LanguageProvider";
import { ServiceWorkerRegister } from "@/components/providers/ServiceWorkerRegister";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

// Sans for UI and body: Plus Jakarta Sans in English, Cairo in Arabic (globals.css swaps on :lang).
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
// Serif for display headings: Playfair Display has no Arabic, so Amiri carries the Arabic side.
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });

const fontVars = [jakarta.variable, cairo.variable, playfair.variable, amiri.variable].join(" ");

export const metadata: Metadata = {
  title: { default: "عقـــار | Aqaar", template: "%s | عقـــار | Aqaar" },
  description: "Buy, rent and book properties, hire contractors and technicians, and track live building material prices.",
  applicationName: "Aqaar",
  appleWebApp: { capable: true, title: "Aqaar", statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: langBootScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <MotionProvider>
              {children}
              <ServiceWorkerRegister />
            </MotionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
