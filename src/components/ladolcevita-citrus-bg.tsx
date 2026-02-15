import Image from "next/image";
import { LaDolceVitaHeroAnimations } from "./ladolcevita-hero-animations";

/**
 * Image-based Mediterranean citrus background for the La Dolce Vita template.
 * Uses the watercolor citrus illustration instead of SVG shapes.
 */

export function LaDolceVitaCitrusBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Image
        src="/images/ladolcevita/hero-citrus.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Centered radial vignette for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 30% at 50% 55%, rgba(255,252,245,0.5) 0%, rgba(255,252,245,0.2) 65%, transparent 100%)",
        }}
      />
      {/* Falling blossoms & floating citrus animations */}
      <LaDolceVitaHeroAnimations />
    </div>
  );
}

export function LaDolceVitaSectionAccent({
  className,
  position = "bottom",
}: {
  className?: string;
  position?: "bottom" | "top";
}) {
  return (
    <div
      className={`absolute inset-x-0 ${position === "bottom" ? "bottom-0" : "top-0"} h-28 sm:h-32 pointer-events-none overflow-hidden ${className ?? ""}`}
    >
      {/* Left side citrus scatter */}
      <svg
        className="absolute left-0 bottom-0 w-24 h-24 sm:w-32 sm:h-32"
        viewBox="0 0 120 120"
        fill="none"
      >
        {/* Lemon */}
        <ellipse cx="30" cy="70" rx="22" ry="15" fill="#F9E547" opacity="0.6" transform="rotate(-20 30 70)" />
        <ellipse cx="30" cy="70" rx="14" ry="9" fill="#FFF176" opacity="0.3" transform="rotate(-20 30 70)" />
        {/* Leaf */}
        <path d="M48 58 Q58 48 62 55 Q55 62 48 58Z" fill="#4A7C59" opacity="0.5" />
        {/* Orange */}
        <circle cx="75" cy="95" r="16" fill="#FF8C42" opacity="0.5" />
        <circle cx="75" cy="95" r="10" fill="#FFA726" opacity="0.25" />
        {/* Small leaf */}
        <path d="M85 80 Q92 72 95 78 Q89 84 85 80Z" fill="#4A7C59" opacity="0.4" />
      </svg>

      {/* Right side citrus scatter */}
      <svg
        className="absolute right-0 bottom-0 w-28 h-28 sm:w-36 sm:h-36"
        viewBox="0 0 140 140"
        fill="none"
      >
        {/* Orange */}
        <circle cx="100" cy="80" r="20" fill="#FF8C42" opacity="0.55" />
        <circle cx="100" cy="80" r="13" fill="#FFA726" opacity="0.25" />
        {/* Leaf on orange */}
        <path d="M85 64 Q78 54 75 62 Q80 68 85 64Z" fill="#4A7C59" opacity="0.5" />
        {/* Lemon */}
        <ellipse cx="55" cy="110" rx="20" ry="13" fill="#F9E547" opacity="0.55" transform="rotate(15 55 110)" />
        <ellipse cx="55" cy="110" rx="13" ry="8" fill="#FFF176" opacity="0.3" transform="rotate(15 55 110)" />
        {/* Small leaf */}
        <path d="M70 100 Q76 92 79 98 Q74 104 70 100Z" fill="#4A7C59" opacity="0.45" />
      </svg>
    </div>
  );
}
