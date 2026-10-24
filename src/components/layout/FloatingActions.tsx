"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { whatsappUrl } from "@/lib/contact";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 600;

/** WhatsApp chat on every page, plus a back-to-top button once the visitor has scrolled. */
export function FloatingActions() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  // Mobile: clears the dock (action bar + tab bar) and leaves WhatsApp to the action bar. Desktop: corner.
  return (
    <div className="fixed bottom-44 end-4 z-30 flex flex-col items-center gap-3 md:bottom-6">
      <button
        type="button"
        onClick={toTop}
        aria-label={t.contact.backToTop}
        tabIndex={scrolled ? 0 : -1}
        className={cn(
          "flex size-11 items-center justify-center rounded-full border border-gold-line bg-surface text-ink shadow-lg transition-[opacity,transform] hover:border-gold",
          scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowUp className="size-5" aria-hidden />
      </button>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.contact.chatWhatsapp}
        className="hidden size-14 items-center justify-center rounded-full bg-[#25D366] md:flex text-white shadow-lg transition-transform hover:scale-105"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  );
}
