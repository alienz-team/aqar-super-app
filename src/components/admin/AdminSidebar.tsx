"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ExternalLink, HardHat, LayoutDashboard, LogOut, Settings, type LucideIcon } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { BrandTile } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/Toggles";
import { cn } from "@/lib/utils";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/services", label: "Services", icon: HardHat },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isCurrent(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/** Always matte black and gold, whatever the page theme: the console reads as one instrument. */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-30 flex flex-col border-b border-[#D4AF37]/20 bg-[#0A0A0A] text-white lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-e">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-6">
        <Link href="/admin" className="flex items-center gap-3">
          <BrandTile className="size-9" />
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-wide">AQAR Admin</span>
            <span className="block text-xs text-white/50">Listings & services</span>
          </span>
        </Link>
        {/* Sign out lives on the Settings page on small screens. */}
        <div className="flex items-center gap-1 lg:hidden [&_button]:text-white/65 [&_button:hover]:bg-white/5 [&_button:hover]:text-white">
          <ThemeToggle />
        </div>
      </div>

      <nav aria-label="Admin" className="overflow-x-auto px-2 pb-2 lg:flex-1 lg:px-3 lg:pb-0">
        <ul className="flex gap-1 lg:flex-col">
          {links.map(({ href, label, icon: Icon }) => {
            const current = isCurrent(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 whitespace-nowrap rounded-sm border-s-2 px-3 py-2.5 text-sm font-medium transition-colors",
                    current
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "border-transparent text-white/65 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden space-y-1 border-t border-white/10 p-3 lg:block">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" aria-hidden />
          View site
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </form>
        <div className="px-1 pt-1 text-white/65 [&_button]:text-white/65 [&_button:hover]:bg-white/5 [&_button:hover]:text-white">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
