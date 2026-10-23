"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal, TextReveal } from "@/components/ui/motion";
import { heroSlides } from "@/lib/mock-data";
import { unsplashLoader } from "@/lib/unsplash-loader";
import { useLivePrices } from "@/lib/use-live-prices";
import { BourseTable } from "./BourseTable";
import { CostCalculator } from "./CostCalculator";

const bandImage = heroSlides.find((s) => s.id === "construction")?.image ?? heroSlides[0].image;

export function BourseView() {
  const { t, lang } = useLanguage();
  // One feed drives both the table and the calculator so their numbers always agree.
  const prices = useLivePrices();

  return (
    <div className="relative isolate">
      {/* Site photo that dissolves into the page colour; the price board floats over it as glass. */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[36rem] overflow-hidden bg-black">
        <Image src={bandImage} alt="" fill priority sizes="100vw" loader={unsplashLoader} className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.6),rgb(0_0_0/0.4)_45%,var(--bg))]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
        <header className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-white/80">
            <span className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-up opacity-75 motion-safe:animate-ping" />
              <span className="relative size-2 rounded-full bg-up" />
            </span>
            {t.bourse.live}
          </p>
          <TextReveal
            key={lang}
            as="h1"
            immediate
            text={t.bourse.title}
            className="mt-4 font-serif text-5xl leading-[1.05] text-white sm:text-7xl rtl:leading-[1.3]"
          />
          <p className="mt-5 max-w-2xl text-white/75">{t.bourse.subtitle}</p>
        </header>

        <Reveal delay={0.4} className="mt-12">
          <BourseTable prices={prices} />
        </Reveal>

        <section aria-labelledby="calc-title" className="mt-24 sm:mt-32">
          <div className="mb-10 grid gap-4 border-b border-line pb-8 lg:grid-cols-2 lg:items-end">
            <h2 id="calc-title" className="font-serif text-4xl leading-tight sm:text-5xl">
              {t.calc.title}
            </h2>
            <p className="max-w-xl text-muted">{t.calc.subtitle}</p>
          </div>
          <CostCalculator prices={prices} />
        </section>
      </div>
    </div>
  );
}
