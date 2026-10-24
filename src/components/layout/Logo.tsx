import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The gold mark always sits on its own black tile: its white and gold hairlines need a dark
 * ground, so the tile keeps it identical on dark and light navbars.
 */
export function BrandTile({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-lg border border-gold/45 bg-[#0A0A0A] p-1",
        className,
      )}
    >
      <Image
        src="/brand/mark.png"
        alt=""
        // Intrinsic size of the largest tile; next/image serves 1x/2x of it.
        width={42}
        height={48}
        priority={priority}
        className="h-full w-auto"
      />
    </span>
  );
}

export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const lg = size === "lg";
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="عقـــار | Aqaar">
      <BrandTile className={lg ? "size-14" : "size-10"} priority={!lg} />
      {/* Same order as the logo artwork: Arabic name over the spaced Latin one. */}
      <span aria-hidden className="flex flex-col items-center leading-none">
        <span lang="ar" className={cn("font-semibold text-gold-text", lg ? "text-2xl" : "text-lg")}>
          عقـــار
        </span>
        <span dir="ltr" className={cn("font-medium tracking-[0.22em] text-ink ps-[0.22em]", lg ? "mt-1.5 text-sm" : "mt-1 text-[11px]")}>
          Aqaar
        </span>
      </span>
    </Link>
  );
}
