"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BourseTicker } from "@/components/bourse/BourseTicker";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { Reveal, SLOW_EASE, TextReveal } from "@/components/ui/motion";
import { buttonStyles, SectionHeading } from "@/components/ui/primitives";
import { featuredProperties } from "@/lib/mock-data";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroSearch } from "./HeroSearch";

export function HomeView() {
  const { t, lang } = useLanguage();

  return (
    <>
      {/* isolate: keeps the backdrop's -z-10 layer inside this section. */}
      <section className="relative isolate flex min-h-[min(88svh,880px)] flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="max-w-3xl">
              {/* key: replays the rise when the language switches. */}
              <TextReveal
                key={lang}
                as="h1"
                immediate
                text={`${t.hero.titleLead} ${t.hero.titleAccent}`}
                className="text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl rtl:leading-[1.25] rtl:tracking-normal"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: SLOW_EASE }}
                className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
              >
                {t.hero.subtitle}
              </motion.p>
            </div>
            <HeroBackdrop />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: SLOW_EASE }}
            className="mt-10 max-w-4xl"
          >
            <HeroSearch />
          </motion.div>
        </div>
      </section>

      <BourseTicker />

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24">
        <SectionHeading
          title={t.home.featuredTitle}
          subtitle={t.home.featuredSub}
          action={
            <Link href="/properties" className={buttonStyles.secondary}>
              {t.home.viewAll}
            </Link>
          }
        />
        <Reveal>
          {/* Three across on desktop; the third hides on two-column tablets so no row is left half-full. */}
          <PropertyGrid items={featuredProperties.slice(0, 3)} className="sm:max-lg:[&>*:nth-child(3)]:hidden" />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24">
        <SectionHeading
          title={t.home.servicesTitle}
          subtitle={t.home.servicesSub}
          action={
            <Link href="/services" className={buttonStyles.secondary}>
              {t.home.allServices}
            </Link>
          }
        />
        <Reveal>
          <ServicesGrid variant="compact" />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24">
        <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-sm border border-gold-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          {/* Grid fades in toward the button side so it never runs under the copy. */}
          <div
            aria-hidden
            className="blueprint absolute inset-0 -z-10 [mask-image:linear-gradient(to_left,black,transparent_55%)] rtl:[mask-image:linear-gradient(to_right,black,transparent_55%)]"
          />
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">{t.home.bourseTitle}</h2>
            <p className="mt-3 text-muted">{t.home.bourseSub}</p>
          </div>
          <Link href="/bourse" className={buttonStyles.primary}>
            {t.home.openCalculator}
          </Link>
        </div>
      </section>
    </>
  );
}
