import { Building2, Calculator, House, Wrench, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: "/" | "/properties" | "/services" | "/bourse";
  key: "home" | "properties" | "services" | "bourse";
  mobileKey: "home" | "properties" | "services" | "bourseShort";
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", key: "home", mobileKey: "home", icon: House },
  { href: "/properties", key: "properties", mobileKey: "properties", icon: Building2 },
  { href: "/services", key: "services", mobileKey: "services", icon: Wrench },
  { href: "/bourse", key: "bourse", mobileKey: "bourseShort", icon: Calculator },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
