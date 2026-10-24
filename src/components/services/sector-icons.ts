import { Cctv, HardHat, KeyRound, PaintRoller, Smartphone, Waves, type LucideIcon } from "lucide-react";
import type { ServiceSectorId } from "@/lib/types";

export const sectorIcons: Record<ServiceSectorId, LucideIcon> = {
  marketing: KeyRound,
  contracting: HardHat,
  interior: PaintRoller,
  pools: Waves,
  security: Cctv,
  smartHome: Smartphone,
};
