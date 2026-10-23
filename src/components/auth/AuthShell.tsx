"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { LanguageToggle, ThemeToggle } from "@/components/layout/Toggles";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SLOW_EASE } from "@/components/ui/motion";
import { heroSlides } from "@/lib/mock-data";
import { unsplashLoader } from "@/lib/unsplash-loader";

const photo = heroSlides.find((s) => s.id === "villa")?.image ?? heroSlides[0].image;

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <div aria-hidden className="absolute inset-0 -z-10 bg-black">
        <Image src={photo} alt="" fill priority sizes="100vw" loader={unsplashLoader} className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.85),rgb(0_0_0/0.35)_60%,rgb(0_0_0/0.55))] lg:bg-[linear-gradient(to_right,rgb(0_0_0/0.75),rgb(0_0_0/0.25))] rtl:lg:bg-[linear-gradient(to_left,rgb(0_0_0/0.75),rgb(0_0_0/0.25))]" />
      </div>

      {/* The toggles sit on the photo, so they are forced light in both themes. */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 text-white sm:px-6 [&_button]:text-white/80 [&_button:hover]:bg-white/10 [&_button:hover]:text-white">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: SLOW_EASE }}
          className="hidden max-w-lg font-serif text-5xl leading-[1.1] text-white lg:block rtl:leading-[1.4]"
        >
          {t.auth.photoCaption}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: SLOW_EASE }}
          className="glass relative rounded-md border-t-2 border-t-gold p-6 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] sm:p-9"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
