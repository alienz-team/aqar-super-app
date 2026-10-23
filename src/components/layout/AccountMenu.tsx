"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { getNavViewer, signOut, type NavViewer } from "@/actions/auth";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { buttonStyles } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/** Loads the signed-in user after mount, again on every route change and on auth events. */
function useViewer() {
  const pathname = usePathname();
  const [state, setState] = useState<{ ready: boolean; viewer: NavViewer | null }>({ ready: false, viewer: null });

  useEffect(() => {
    let active = true;
    const load = () =>
      getNavViewer()
        .then((viewer) => active && setState({ ready: true, viewer }))
        .catch(() => active && setState({ ready: true, viewer: null }));
    load();
    const sub = createClient()?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") load();
    });
    return () => {
      active = false;
      sub?.data.subscription.unsubscribe();
    };
  }, [pathname]);

  return state;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

export function AccountMenu() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { ready, viewer } = useViewer();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on navigation, outside click and Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Reserve the space while loading so the header does not jump.
  if (!ready) return <span aria-hidden className="block h-9 w-9 sm:w-40" />;

  if (!viewer) {
    const next = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return (
      <div className="flex items-center gap-1.5">
        <Link href={`/login${next}`} className={cn(buttonStyles.ghost, "text-ink")}>
          {t.auth.login}
        </Link>
        <Link href={`/signup${next}`} className={cn(buttonStyles.gold, "hidden px-3.5 py-2 sm:inline-flex")}>
          {t.auth.signup}
        </Link>
      </div>
    );
  }

  const itemStyles = "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-ink transition-colors hover:bg-surface-2";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t.auth.accountMenu}
        className="flex items-center gap-2 rounded-sm p-1 transition-colors hover:bg-surface-2"
      >
        <span className="gold-metal flex size-8 items-center justify-center rounded-full text-xs font-bold">{initials(viewer.name)}</span>
        <span className="hidden max-w-32 truncate text-sm font-medium lg:block">{viewer.name}</span>
        <ChevronDown className={cn("hidden size-4 text-muted transition-transform lg:block", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute end-0 top-full z-50 mt-2 w-64 rounded-md border border-line border-t-2 border-t-gold bg-surface p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)]"
        >
          <div className="border-b border-line px-3 pb-3 pt-2">
            <p className="truncate font-semibold">{viewer.name}</p>
            <p className="truncate text-xs text-muted" dir="ltr">
              {viewer.email}
            </p>
          </div>
          <ul className="py-1.5">
            <li>
              <Link href="/account" className={itemStyles}>
                <CalendarCheck className="size-4 text-muted" aria-hidden />
                {t.auth.myActivity}
              </Link>
            </li>
            {viewer.role === "ADMIN" && (
              <li>
                <Link href="/admin" className={itemStyles}>
                  <LayoutDashboard className="size-4 text-gold-text" aria-hidden />
                  {t.auth.adminDashboard}
                </Link>
              </li>
            )}
          </ul>
          <form action={signOut} className="border-t border-line pt-1.5">
            <button type="submit" className={cn(itemStyles, "w-full text-start")}>
              <LogOut className="size-4 text-muted" aria-hidden />
              {t.auth.signOut}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
