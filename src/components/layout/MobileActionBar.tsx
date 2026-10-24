"use client";

import Link from "next/link";
import { Building2, Phone } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { generalWhatsappUrl, telUrl } from "@/lib/contact";
import { cn } from "@/lib/utils";

const action = "flex h-11 flex-1 items-center justify-center gap-2 rounded-sm text-sm font-semibold transition-opacity active:opacity-80";

/** Three one-tap ways to reach Aqaar on a phone. Rendered inside the mobile dock in the site layout. */
export function MobileActionBar() {
  const { t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.mobileBar.label}
      className="flex items-center justify-around gap-2 border-t border-line bg-bg/95 p-3 shadow-lg backdrop-blur-md"
    >
      <a href={telUrl} className={cn(action, "bg-brand text-brand-ink")}>
        <Phone className="size-4" aria-hidden />
        {t.mobileBar.call}
      </a>
      <a
        href={generalWhatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(action, "bg-[#25D366] text-[#06210f]")}
      >
        <WhatsAppIcon className="size-5" />
        {t.mobileBar.whatsapp}
      </a>
      <Link href="/properties" className={cn(action, "border border-line bg-surface text-ink")}>
        <Building2 className="size-4" aria-hidden />
        {t.mobileBar.browse}
      </Link>
    </div>
  );
}
