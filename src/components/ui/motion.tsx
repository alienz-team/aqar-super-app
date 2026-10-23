"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/** Long, soft ease-out used by every reveal so the site moves at one tempo. */
export const SLOW_EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Starting offset in px; 0 gives a pure fade. */
  y?: number;
}

/** Fades content in the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.1, delay, ease: SLOW_EASE }}
    >
      {children}
    </motion.div>
  );
}

const line: Variants = {
  hidden: { y: "105%" },
  shown: (i: number) => ({ y: "0%", transition: { duration: 1.2, delay: 0.15 + i * 0.12, ease: SLOW_EASE } }),
};

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "p";
  id?: string;
  className?: string;
  /** Reveal on mount instead of on scroll. */
  immediate?: boolean;
}

/**
 * Splits text into words that rise out of a clipped baseline one after another.
 * Words, not letters, so Arabic keeps its joined letterforms.
 */
export function TextReveal({ text, as = "h2", id, className, immediate = false }: TextRevealProps) {
  const Tag = motion[as];
  const words = text.split(" ");
  const trigger = immediate ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag id={id} className={cn("flex flex-wrap gap-x-[0.25em]", className)} initial="hidden" {...trigger} aria-label={text}>
      {words.map((word, i) => (
        // pb/-mb: room for descenders inside the clip without shifting the line.
        <span key={`${word}-${i}`} aria-hidden className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em]">
          <motion.span className="inline-block" variants={line} custom={i}>
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
