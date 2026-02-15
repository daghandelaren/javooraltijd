import Image from "next/image";
import { LaDolceVitaHeroAnimations } from "./ladolcevita-hero-animations";

/**
 * Image-based Mediterranean citrus background for the La Dolce Vita template.
 * Uses the striped watercolor citrus illustration as base, with a transparent
 * citrus overlay to ensure fruits are visible on mobile (portrait) viewports.
 */

export function LaDolceVitaCitrusBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Striped background — always visible */}
      <Image
        src="/images/ladolcevita/hero-citrus.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Portrait citrus overlay — mobile only */}
      <Image
        src="/images/ladolcevita/hero-citrus-mobile.png"
        alt=""
        fill
        className="sm:hidden object-cover object-center"
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
      {/* Falling blossoms animations */}
      <LaDolceVitaHeroAnimations />
    </div>
  );
}

export function LaDolceVitaSectionAccent({
  className,
  position = "bottom",
  side,
}: {
  className?: string;
  position?: "bottom" | "top";
  side?: "left" | "right";
}) {
  if (side === "left") {
    return (
      <div
        className={`absolute top-0 left-0 w-48 sm:w-64 h-full pointer-events-none overflow-hidden ${className ?? ""}`}
      >
        <Image
          src="/images/ladolcevita/citrus-accent.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "top left" }}
          sizes="33vw"
        />
      </div>
    );
  }

  if (side === "right") {
    return (
      <div
        className={`absolute top-0 right-0 w-48 sm:w-64 h-full pointer-events-none overflow-hidden ${className ?? ""}`}
        style={{ transform: "scaleX(-1)" }}
      >
        <Image
          src="/images/ladolcevita/citrus-accent.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "top left" }}
          sizes="33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-x-0 ${position === "bottom" ? "bottom-0" : "top-0"} h-[28rem] pointer-events-none overflow-hidden ${className ?? ""}`}
      style={{
        maskImage:
          position === "bottom"
            ? "linear-gradient(to bottom, transparent 0%, black 8%, black 100%)"
            : "linear-gradient(to top, transparent 0%, black 8%, black 100%)",
        WebkitMaskImage:
          position === "bottom"
            ? "linear-gradient(to bottom, transparent 0%, black 8%, black 100%)"
            : "linear-gradient(to top, transparent 0%, black 8%, black 100%)",
      }}
    >
      <Image
        src="/images/ladolcevita/hero-citrus-mobile.png"
        alt=""
        fill
        className={`object-cover ${position === "bottom" ? "object-bottom" : "object-top"}`}
        sizes="100vw"
      />
    </div>
  );
}
