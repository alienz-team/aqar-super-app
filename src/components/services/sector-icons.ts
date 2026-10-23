import { Box, HardHat, ShieldCheck, Sun, Waves, Wrench, type LucideIcon } from "lucide-react";
import type { ServiceSectorId } from "@/lib/types";

export const sectorIcons: Record<ServiceSectorId, LucideIcon> = {
  contracting: HardHat,
  design3d: Box,
  poolsLandscape: Waves,
  solarWater: Sun,
  smartHome: ShieldCheck,
  maintenance: Wrench,
};
