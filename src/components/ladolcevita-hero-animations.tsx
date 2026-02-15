"use client";

/**
 * Falling orange blossoms and floating citrus for the La Dolce Vita hero section.
 * Pure CSS animations for 60fps performance.
 *
 * Values are deterministic (no Math.random) to avoid SSR hydration mismatches.
 */

const blossoms = [
  { left: 8, size: 12, duration: 8, delay: 0, sway: 25, rotate: 240, opacity: 0.7 },
  { left: 18, size: 10, duration: 10, delay: 1.2, sway: 35, rotate: 320, opacity: 0.6 },
  { left: 28, size: 14, duration: 7, delay: 2.5, sway: 20, rotate: 180, opacity: 0.65 },
  { left: 42, size: 11, duration: 9, delay: 0.8, sway: 30, rotate: 400, opacity: 0.55 },
  { left: 58, size: 13, duration: 11, delay: 3.5, sway: 22, rotate: 290, opacity: 0.6 },
  { left: 72, size: 9, duration: 8.5, delay: 1.8, sway: 28, rotate: 350, opacity: 0.7 },
  { left: 85, size: 12, duration: 10.5, delay: 4, sway: 32, rotate: 220, opacity: 0.5 },
  { left: 92, size: 10, duration: 7.5, delay: 2, sway: 18, rotate: 270, opacity: 0.65 },
];

const floatingCitrus = [
  { left: 3, top: 20, size: 22, duration: 12, delay: 0, type: "lemon" as const, opacity: 0.5 },
  { left: 90, top: 35, size: 18, duration: 14, delay: 1.5, type: "orange" as const, opacity: 0.45 },
  { left: 5, top: 65, size: 20, duration: 11, delay: 3, type: "orange" as const, opacity: 0.4 },
  { left: 92, top: 15, size: 16, duration: 13, delay: 2, type: "lemon" as const, opacity: 0.5 },
  { left: 88, top: 70, size: 19, duration: 15, delay: 4, type: "lemon" as const, opacity: 0.35 },
];

function BlossomShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* 5-petal white blossom */}
      <ellipse cx="10" cy="5" rx="3" ry="4.5" fill="white" opacity="0.9" />
      <ellipse cx="14.5" cy="8.5" rx="3" ry="4.5" fill="white" opacity="0.85" transform="rotate(72 14.5 8.5)" />
      <ellipse cx="13" cy="14" rx="3" ry="4.5" fill="white" opacity="0.8" transform="rotate(144 13 14)" />
      <ellipse cx="7" cy="14" rx="3" ry="4.5" fill="white" opacity="0.8" transform="rotate(216 7 14)" />
      <ellipse cx="5.5" cy="8.5" rx="3" ry="4.5" fill="white" opacity="0.85" transform="rotate(288 5.5 8.5)" />
      {/* Center */}
      <circle cx="10" cy="10" r="2.5" fill="#E8A735" opacity="0.8" />
    </svg>
  );
}

function FallingBlossoms() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {blossoms.map((b, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${b.left}%`,
            opacity: b.opacity,
            animation: `dolcevita-blossom-fall ${b.duration}s ${b.delay}s ease-in-out infinite`,
            ["--sway" as string]: `${b.sway}px`,
            ["--rotate-end" as string]: `${b.rotate}deg`,
          }}
        >
          <BlossomShape size={b.size} />
        </div>
      ))}
    </div>
  );
}

function FloatingCitrus() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {floatingCitrus.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            opacity: c.opacity,
            animation: `dolcevita-bob ${c.duration}s ${c.delay}s ease-in-out infinite`,
          }}
        >
          {c.type === "lemon" ? (
            <svg width={c.size} height={c.size * 0.7} viewBox="0 0 30 21" fill="none">
              <ellipse cx="15" cy="10.5" rx="13" ry="9" fill="#F9E547" />
              <ellipse cx="15" cy="10.5" rx="9" ry="6" fill="#FFF176" opacity="0.5" />
              <ellipse cx="11" cy="8" rx="2" ry="1.2" fill="#FFEB3B" opacity="0.3" />
            </svg>
          ) : (
            <svg width={c.size} height={c.size} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FF8C42" />
              <circle cx="12" cy="12" r="7" fill="#FFA726" opacity="0.5" />
              <circle cx="9" cy="9" r="1.5" fill="#FFB74D" opacity="0.3" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export function LaDolceVitaHeroAnimations() {
  return (
    <>
      <FallingBlossoms />
      <FloatingCitrus />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dolcevita-blossom-fall {
          0% {
            transform: translateY(-10%) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          65% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--sway)) rotate(var(--rotate-end));
            opacity: 0;
          }
        }

        @keyframes dolcevita-bob {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(5px, -8px) rotate(3deg);
          }
          50% {
            transform: translate(-4px, 4px) rotate(-2deg);
          }
          75% {
            transform: translate(6px, -3px) rotate(2deg);
          }
        }
      `}} />
    </>
  );
}
