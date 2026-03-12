import Image from "next/image";

/**
 * Image-based watercolor floral background for the STD Watercolor Villa template.
 * Uses the arch + florals illustration as hero image.
 */

export function StdWatercolorVillaBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#FDFCFA]">
      {/* Watercolor villa hero — portrait arch with florals */}
      <Image
        src="/images/std/watercolor-villa/hero.png"
        alt=""
        fill
        className="object-contain object-top scale-[2] origin-top translate-y-[10%] sm:scale-[1.35] sm:translate-y-[3%] lg:scale-100 lg:translate-y-0"
        priority
        sizes="100vw"
      />
      {/* Centered radial vignette for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 65%, rgba(253,252,250,0.55) 0%, rgba(253,252,250,0.2) 65%, transparent 100%)",
        }}
      />
    </div>
  );
}
