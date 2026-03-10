import Image from "next/image";

export function StdLimoncelloBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#6B7548]">
      <Image
        src="/images/std/limoncello/hero.png"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Subtle centered vignette for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 50%, rgba(107,117,72,0.45) 0%, rgba(107,117,72,0.15) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
