"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { unsplashLoader } from "@/lib/unsplash-loader";
import { cn } from "@/lib/utils";

interface CrossfadeProps {
  images: string[];
  /** Accessible description; leave empty for decorative backdrops. */
  alt?: string;
  sizes: string;
  /** Preloads the first photo (for above-the-fold intros). */
  priority?: boolean;
  intervalMs?: number;
  /** Delays the first change so neighbouring instances do not all flip together. */
  offsetMs?: number;
  className?: string;
}

/**
 * Stacked photos that dissolve into one another. It fills its positioned parent, only runs while
 * on screen, and holds on the first photo for visitors who prefer reduced motion.
 */
export function Crossfade({ images, alt = "", sizes, priority = false, intervalMs = 4000, offsetMs = 0, className }: CrossfadeProps) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const count = images.length;
  const running = count > 1 && visible && !reduce;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Re-arms after every change; the first tick waits an extra `offsetMs`.
  const first = useRef(true);
  useEffect(() => {
    if (!running) return;
    const delay = first.current ? intervalMs + offsetMs : intervalMs;
    const id = window.setTimeout(() => {
      first.current = false;
      setActive((i) => (i + 1) % count);
    }, delay);
    return () => window.clearTimeout(id);
  }, [active, running, count, intervalMs, offsetMs]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === active ? alt : ""}
          aria-hidden={i !== active || undefined}
          fill
          sizes={sizes}
          priority={priority && i === 0}
          loader={unsplashLoader}
          className={cn(
            "object-cover transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none",
            i === active ? "opacity-100" : "opacity-0",
            className,
          )}
        />
      ))}
    </div>
  );
}
