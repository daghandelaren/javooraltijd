import Image from "next/image";

/**
 * Image-based Portuguese tile background for the Riviera template.
 * Uses the blue tile pattern with arch frame and kissing doves as hero image.
 */

export function RivieraBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Tile pattern hero — landscape, covers both desktop and mobile */}
      <Image
        src="/images/riviera/hero-tiles.png"
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
            "radial-gradient(ellipse 50% 35% at 50% 55%, rgba(253,252,250,0.55) 0%, rgba(253,252,250,0.2) 65%, transparent 100%)",
        }}
      />
    </div>
  );
}
