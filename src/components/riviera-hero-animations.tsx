"use client";

/**
 * Flying bird silhouettes for the Riviera hero section.
 * Pure CSS animations for 60fps performance.
 *
 * Values are deterministic (no Math.random) to avoid SSR hydration mismatches.
 */

const birds = [
  { left: 12, top: 15, size: 14, duration: 12, delay: 0, opacity: 0.35 },
  { left: 65, top: 8, size: 11, duration: 15, delay: 2, opacity: 0.25 },
  { left: 35, top: 22, size: 16, duration: 10, delay: 4, opacity: 0.3 },
  { left: 80, top: 18, size: 12, duration: 14, delay: 1.5, opacity: 0.2 },
  { left: 50, top: 10, size: 13, duration: 11, delay: 6, opacity: 0.3 },
  { left: 20, top: 25, size: 10, duration: 13, delay: 3.5, opacity: 0.25 },
];

function BirdShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 24 12" fill="none">
      {/* Simple bird silhouette — two curved wings */}
      <path
        d="M12 8 C9 3, 4 0, 0 2 C4 2, 8 4, 12 8Z"
        fill="#2C3E50"
        opacity="0.8"
      />
      <path
        d="M12 8 C15 3, 20 0, 24 2 C20 2, 16 4, 12 8Z"
        fill="#2C3E50"
        opacity="0.8"
      />
    </svg>
  );
}

function FlyingBirds() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {birds.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            opacity: b.opacity,
            animation: `riviera-bird-fly ${b.duration}s ${b.delay}s ease-in-out infinite`,
          }}
        >
          <BirdShape size={b.size} />
        </div>
      ))}
    </div>
  );
}

export function RivieraHeroAnimations() {
  return (
    <>
      <FlyingBirds />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes riviera-bird-fly {
          0% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(30px) translateY(-8px);
          }
          50% {
            transform: translateX(60px) translateY(4px);
          }
          75% {
            transform: translateX(90px) translateY(-6px);
          }
          100% {
            transform: translateX(0) translateY(0);
          }
        }
      `}} />
    </>
  );
}
