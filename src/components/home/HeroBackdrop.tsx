"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { interpolate } from "@/dictionaries";
import { heroSlides } from "@/lib/mock-data";
import { unsplashLoader } from "@/lib/unsplash-loader";
import { cn, formatNumber } from "@/lib/utils";

// Matches the 6 s Ken Burns settle in globals.css, so each photo finishes its zoom before the next fades in.
const INTERVAL_MS = 6000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Cross-fading full-bleed photos behind the hero, one per stage of a home's life. */
export function HeroBackdrop() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  // Re-arms after every change, so picking a slide restarts the 6 s countdown.
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % heroSlides.length), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [active, reducedMotion]);

  const pad = (n: number) => formatNumber(n, lang).padStart(2, formatNumber(0, lang));

  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10 bg-black">
        {heroSlides.map((slide, i) => (
          <Image
            key={slide.id}
            src={slide.image}
            alt=""
            fill
            sizes="100vw"
            quality={90}
            priority={i === 0}
            loader={unsplashLoader}
            className={cn(
              "object-cover transition-opacity duration-[1400ms] ease-out",
              // Re-applying .kenburns on each activation restarts the zoom from 105%.
              i === active ? "kenburns opacity-100" : "scale-105 opacity-0",
            )}
          />
        ))}
        {/* Light veil: darkest where the headline and search bar sit, nearly clear above so the photo stays vivid. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.72),rgb(0_0_0/0.38)_35%,rgb(0_0_0/0.06)_65%,rgb(0_0_0/0.2))]" />
      </div>

      <div className="w-full text-white lg:w-72" role="group" aria-label={t.hero.slidesLabel}>
        <p className="tabular flex items-baseline justify-between gap-4 text-sm">
          <span className="font-medium">{t.hero.slides[heroSlides[active].id]}</span>
          <span dir="ltr" className="text-white/60">
            <span className="text-white">{pad(active + 1)}</span> / {pad(heroSlides.length)}
          </span>
        </p>
        <div className="mt-3 flex gap-1.5">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={interpolate(t.hero.showSlide, { name: t.hero.slides[slide.id] })}
              aria-current={i === active}
              className="group flex h-6 flex-1 items-center"
            >
              <span className="relative block h-0.5 w-full overflow-hidden bg-white/25 transition-colors group-hover:bg-white/45">
                {i < active && <span className="absolute inset-0 bg-white/70" />}
                {i === active && (
                  // Fills over the slide's 6 s so the countdown is visible.
                  <motion.span
                    key={`${active}-${reducedMotion}`}
                    className="absolute inset-0 origin-left bg-gold rtl:origin-right"
                    initial={{ scaleX: reducedMotion ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
