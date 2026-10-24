"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Crossfade } from "@/components/ui/Crossfade";
import { Reveal, SLOW_EASE, TextReveal } from "@/components/ui/motion";
import { buttonStyles } from "@/components/ui/primitives";
import { sectionImages, serviceSectors } from "@/lib/mock-data";
import type { ServiceSector, ServiceSectorId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ServiceRequestModal } from "./ServiceRequestModal";

export function ServicesView({ initialSector }: { initialSector?: ServiceSectorId }) {
  const [selected, setSelected] = useState<ServiceSector | null>(null);

  // Deep link (?sector=...): bring that chapter into view and open its form after mount.
  useEffect(() => {
    const match = serviceSectors.find((s) => s.id === initialSector);
    if (!match) return;
    document.getElementById(`sector-${match.id}`)?.scrollIntoView({ block: "start" });
    if (match.mode === "quote") setSelected(match);
  }, [initialSector]);

  return (
    <>
      <Intro />
      {serviceSectors.map((sector, i) =>
        // Every third chapter breaks the split rhythm with a full-bleed photograph.
        i % 3 === 2 ? (
          <FullBleedChapter key={sector.id} sector={sector} onRequest={setSelected} />
        ) : (
          <SplitChapter key={sector.id} sector={sector} onRequest={setSelected} flip={i % 3 === 1} />
        ),
      )}
      <Outro />
      <ServiceRequestModal sector={selected} onClose={() => setSelected(null)} />
    </>
  );
}

/** Full-height opening shot: slow parallax photo, the headline rising word by word. */
function Intro() {
  const { t, lang } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden">
      <motion.div aria-hidden className="absolute inset-0 -z-10 bg-black" style={{ y }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: SLOW_EASE }}
        >
          <Crossfade images={sectionImages.servicesIntro} sizes="100vw" priority />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.8),rgb(0_0_0/0.2)_60%,rgb(0_0_0/0.35))]" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <TextReveal
          key={lang}
          as="h1"
          immediate
          text={t.services.introTitle}
          className="max-w-4xl font-serif text-5xl leading-[1.05] text-white sm:text-7xl lg:text-8xl rtl:leading-[1.3]"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.1, ease: SLOW_EASE }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/75"
        >
          {t.services.subtitle}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          className="mt-14 inline-flex items-center gap-3 text-sm text-white/60"
        >
          <ArrowDown className="size-4 motion-safe:animate-bounce" aria-hidden />
          {t.services.introCue}
        </motion.p>
      </motion.div>
    </section>
  );
}

interface ChapterProps {
  sector: ServiceSector;
  onRequest: (sector: ServiceSector) => void;
}

/** The kinds of work a sector covers, as quiet hairline-separated labels. */
function SectorScope({ sector, onDark = false }: { sector: ServiceSector; onDark?: boolean }) {
  const { t } = useLanguage();
  if (sector.categories.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-sm", onDark ? "border-white/25 text-white/80" : "border-line text-muted")}>
      {sector.categories.map((c) => (
        <li key={c}>{t.services.categories[c]}</li>
      ))}
    </ul>
  );
}

function RequestButton({ sector, onRequest }: ChapterProps) {
  const { t } = useLanguage();
  if (sector.mode === "browse") {
    return (
      <Link href="/properties" className={cn(buttonStyles.primary, "px-6 py-3")}>
        {t.services.browseListings}
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => onRequest(sector)} className={cn(buttonStyles.primary, "px-6 py-3")}>
      {t.services.requestQuote}
    </button>
  );
}

/** Image on one side bleeding to the viewport edge, story on the other. */
function SplitChapter({ sector, onRequest, flip }: ChapterProps & { flip: boolean }) {
  const { t } = useLanguage();
  const copy = t.services.sectors[sector.id];

  return (
    <section id={`sector-${sector.id}`} aria-labelledby={`sector-${sector.id}-title`} className="scroll-mt-16 border-b border-line">
      <div className="grid lg:min-h-[88svh] lg:grid-cols-12">
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:col-span-7 lg:aspect-auto",
            flip && "lg:order-last",
          )}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 2.2, ease: SLOW_EASE }}
          >
            <Crossfade images={sector.images} alt={copy.name} sizes="(min-width: 1024px) 58vw, 100vw" />
          </motion.div>
        </div>

        <div className="flex flex-col justify-center px-4 py-16 sm:px-10 lg:col-span-5 lg:px-14 xl:px-20">
          <TextReveal
            id={`sector-${sector.id}-title`}
            text={copy.name}
            className="font-serif text-4xl leading-[1.1] sm:text-5xl rtl:leading-[1.4]"
          />
          <Reveal delay={0.3} y={0}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{copy.desc}</p>
          </Reveal>
          <Reveal delay={0.5} y={0} className="mt-10">
            <SectorScope sector={sector} />
          </Reveal>
          <Reveal delay={0.7} y={0} className="mt-10">
            <RequestButton sector={sector} onRequest={onRequest} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** A full-width photograph with the story set into its lower edge. */
function FullBleedChapter({ sector, onRequest }: ChapterProps) {
  const { t } = useLanguage();
  const copy = t.services.sectors[sector.id];
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      id={`sector-${sector.id}`}
      aria-labelledby={`sector-${sector.id}-title`}
      className="relative isolate flex min-h-[92svh] scroll-mt-16 items-end overflow-hidden"
    >
      <motion.div aria-hidden className="absolute -inset-y-[10%] inset-x-0 -z-10 bg-black" style={{ y }}>
        <Crossfade images={sector.images} sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.85),rgb(0_0_0/0.15)_65%)]" />
      </motion.div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <TextReveal
            id={`sector-${sector.id}-title`}
            text={copy.name}
            className="font-serif text-4xl leading-[1.1] text-white sm:text-6xl rtl:leading-[1.4]"
          />
          <Reveal delay={0.3} y={0}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">{copy.desc}</p>
          </Reveal>
        </div>
        <Reveal delay={0.5} y={0} className="lg:col-span-6">
          <SectorScope sector={sector} onDark />
          <div className="mt-8">
            <RequestButton sector={sector} onRequest={onRequest} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Closing beat: sends people who are still pricing their build to the calculator. */
function Outro() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
      <Reveal>
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{t.home.bourseTitle}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">{t.home.bourseSub}</p>
        <Link href="/bourse" className={cn(buttonStyles.secondary, "mt-10 px-6 py-3")}>
          {t.home.openCalculator}
        </Link>
      </Reveal>
    </section>
  );
}
