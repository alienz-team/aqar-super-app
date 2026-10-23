"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { buttonStyles } from "@/components/ui/primitives";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallAppButton({ className }: { className?: string }) {
  const { t } = useLanguage();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep Chrome's mini-infobar quiet; we show our own button
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function handleClick() {
    if (!deferred) {
      setHelpOpen(true);
      return;
    }
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={cn(buttonStyles.secondary, "px-3 py-2", className)}>
        <Download className="size-4 text-gold-text" aria-hidden />
        <span className="hidden lg:inline">{t.actions.install}</span>
        <span className="sr-only lg:hidden">{t.actions.install}</span>
      </button>
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title={t.actions.installTitle}>
        <p className="text-muted">{isIos ? t.actions.installIos : t.actions.installOther}</p>
        <button type="button" onClick={() => setHelpOpen(false)} className={cn(buttonStyles.primary, "mt-6 w-full")}>
          {t.booking.done}
        </button>
      </Modal>
    </>
  );
}
