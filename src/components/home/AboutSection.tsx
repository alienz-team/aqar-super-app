"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/motion";
import { formatNumber } from "@/lib/utils";

const YEARS = 17;

/** "+17" that counts up once when it scrolls into view; reduced-motion visitors just see 17. */
function YearsCounter() {
  const { t, lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(YEARS);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, YEARS, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce]);

  return (
    <div ref={ref} className="inline-flex flex-col rounded-sm border border-gold-line bg-surface px-8 py-6">
      <p className="tabular font-serif text-7xl leading-none text-gold-text sm:text-8xl" aria-label={`+${YEARS}`}>
        <span aria-hidden dir="ltr">
          +{formatNumber(value, lang)}
        </span>
      </p>
      <p className="mt-3 text-sm font-medium text-muted">{t.about.yearsLabel}</p>
    </div>
  );
}

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-20 sm:px-6 sm:pt-24">
      <div className="grid items-center gap-10 border-y border-line py-12 sm:py-16 md:grid-cols-[auto_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <YearsCounter />
        </Reveal>
        <Reveal delay={0.15}>
          <h2 id="about-title" className="font-serif text-3xl leading-tight sm:text-4xl rtl:leading-snug">
            {t.about.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{t.about.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
