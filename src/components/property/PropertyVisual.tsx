import { Building, Building2, House, LandPlot, PartyPopper, Store, TreePalm, Waves, type LucideIcon } from "lucide-react";
import { Crossfade } from "@/components/ui/Crossfade";
import type { PropertyCategory } from "@/lib/types";

export const categoryIcons: Record<PropertyCategory, LucideIcon> = {
  APARTMENT: Building2,
  VILLA: House,
  LAND: LandPlot,
  COMMERCIAL: Store,
  ISTIRAHA: TreePalm,
  CHALET: Waves,
  EVENT_HALL: PartyPopper,
};

// Matches the PropertyGrid columns: 1 / 2 / 3 across, capped by the 80rem container.
const SIZES = "(min-width: 1280px) 416px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

interface PropertyVisualProps {
  category: PropertyCategory;
  images: string[];
  alt: string;
  /** Spreads the photo changes across a grid of cards. */
  offsetMs?: number;
}

/** Listing photos that dissolve into one another; falls back to a blueprint grid + category mark. */
export function PropertyVisual({ category, images, alt, offsetMs = 0 }: PropertyVisualProps) {
  if (images.length > 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <Crossfade
          images={images}
          alt={alt}
          sizes={SIZES}
          intervalMs={5000}
          offsetMs={offsetMs}
          className="transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-[1.03]"
        />
        {/* A light top shade so the badges stay legible; the rest of the photo is left clean. */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.35),transparent_30%)]" />
      </div>
    );
  }

  const Icon = categoryIcons[category] ?? Building;
  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-surface-2"
      style={{
        backgroundImage:
          "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <Icon className="size-14 text-muted/60" strokeWidth={1.25} aria-hidden />
    </div>
  );
}
