import Image from "next/image";
import { BloementuinHeroAnimations } from "./bloementuin-hero-animations";

/**
 * Image-based watercolor garden background for the Bloementuin template.
 * Uses the hand-painted watercolor illustration instead of SVG shapes.
 */

export function BloementuinFloralBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Image
        src="/images/bloementuin/hero-garden.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Centered radial vignette for text readability — no white bar at top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 30% at 50% 55%, rgba(253,251,247,0.5) 0%, rgba(253,251,247,0.2) 65%, transparent 100%)",
        }}
      />
      {/* Falling petals & floating butterflies — z-[5], behind content at z-10 */}
      <BloementuinHeroAnimations />
    </div>
  );
}

export function BloementuinSectionAccent({
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
          src="/images/bloementuin/garden-accent.png"
          alt=""
          fill
          className="object-cover object-top-left"
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
        src="/images/bloementuin/garden-accent.png"
        alt=""
        fill
        className={`object-cover ${position === "bottom" ? "object-bottom" : "object-top"}`}
        sizes="100vw"
      />
    </div>
  );
}
