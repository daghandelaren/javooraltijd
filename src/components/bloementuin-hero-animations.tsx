"use client";

/**
 * Falling blossom petals (top-left) and floating butterflies (bottom-right)
 * for the Bloementuin hero section. Pure CSS animations for 60fps performance.
 *
 * Values are deterministic (no Math.random) to avoid SSR hydration mismatches.
 */

const PETAL_COLORS = ["#E8B4B8", "#D4A0A0", "#F0C6C9", "#E0A8AC", "#F2D0D3"];

const petals = [
  { left: 5, size: 10, duration: 7, delay: 0, sway: 20, rotate: 220, opacity: 0.6 },
  { left: 12, size: 14, duration: 9, delay: 1.5, sway: 35, rotate: 310, opacity: 0.7 },
  { left: 22, size: 9, duration: 11, delay: 3, sway: 25, rotate: 450, opacity: 0.55 },
  { left: 8, size: 12, duration: 8, delay: 4.5, sway: 40, rotate: 280, opacity: 0.65 },
  { left: 30, size: 11, duration: 10, delay: 2, sway: 18, rotate: 380, opacity: 0.7 },
  { left: 18, size: 15, duration: 6.5, delay: 6, sway: 30, rotate: 200, opacity: 0.5 },
  { left: 35, size: 8, duration: 12, delay: 0.8, sway: 22, rotate: 520, opacity: 0.6 },
  { left: 26, size: 13, duration: 7.5, delay: 5, sway: 38, rotate: 260, opacity: 0.75 },
  { left: 3, size: 10, duration: 9.5, delay: 7, sway: 28, rotate: 340, opacity: 0.55 },
  { left: 15, size: 16, duration: 8.5, delay: 3.5, sway: 42, rotate: 190, opacity: 0.8 },
];

const butterflies = [
  { size: 32, bottom: 18, right: 10, duration: 10, delay: 0, flapSpeed: 0.45, color: "#D4A0A0", float: "bloementuin-float" },
  { size: 25, bottom: 30, right: 30, duration: 13, delay: 2, flapSpeed: 0.5, color: "#6B8F6B", float: "bloementuin-float" },
  { size: 28, bottom: 12, right: 20, duration: 11, delay: 5, flapSpeed: 0.4, color: "#C49BBB", float: "bloementuin-float-down" },
  { size: 22, bottom: 35, right: 8, duration: 14, delay: 1, flapSpeed: 0.48, color: "#B8D4B8", float: "bloementuin-float-down" },
  { size: 30, bottom: 22, right: 35, duration: 9, delay: 3.5, flapSpeed: 0.42, color: "#D4A0A0", float: "bloementuin-float" },
  { size: 20, bottom: 28, right: 15, duration: 12, delay: 6, flapSpeed: 0.52, color: "#C49BBB", float: "bloementuin-float-down" },
  { size: 26, bottom: 8, right: 25, duration: 15, delay: 4, flapSpeed: 0.46, color: "#6B8F6B", float: "bloementuin-float-down" },
];

function FallingPetals() {
  return (
    <div className="absolute top-0 left-0 w-1/2 h-full pointer-events-none z-[5] overflow-hidden">
      {petals.map((p, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            animation: `bloementuin-petal-fall ${p.duration}s ${p.delay}s ease-in-out infinite both`,
            ["--sway" as string]: `${p.sway}px`,
            ["--rotate-end" as string]: `${p.rotate}deg`,
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.4}
            viewBox="0 0 10 14"
            fill="none"
            style={{ opacity: p.opacity }}
          >
            <ellipse cx="5" cy="7" rx="4" ry="6.5" fill={PETAL_COLORS[i % PETAL_COLORS.length]} />
            <ellipse cx="5" cy="7" rx="2.5" ry="5" fill={PETAL_COLORS[i % PETAL_COLORS.length]} opacity="0.6" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function ButterflyShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 24 18" fill="none">
      {/* Left wing */}
      <path
        d="M12 9 C8 2, 1 1, 2 8 C3 12, 8 13, 12 9Z"
        fill={color}
        opacity="0.7"
        className="origin-right"
        style={{ animation: `bloementuin-flap var(--flap-speed) ease-in-out infinite` }}
      />
      {/* Right wing */}
      <path
        d="M12 9 C16 2, 23 1, 22 8 C21 12, 16 13, 12 9Z"
        fill={color}
        opacity="0.7"
        className="origin-left"
        style={{ animation: `bloementuin-flap var(--flap-speed) ease-in-out infinite` }}
      />
      {/* Body */}
      <line x1="12" y1="4" x2="12" y2="14" stroke="#5A4A42" strokeWidth="0.8" opacity="0.6" />
      {/* Antennae */}
      <path d="M12 5 Q10 2 9 1" stroke="#5A4A42" strokeWidth="0.4" fill="none" opacity="0.5" />
      <path d="M12 5 Q14 2 15 1" stroke="#5A4A42" strokeWidth="0.4" fill="none" opacity="0.5" />
    </svg>
  );
}

function FloatingButterflies() {
  return (
    <div className="absolute bottom-0 right-0 w-1/2 h-full pointer-events-none z-[5] overflow-hidden">
      {butterflies.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            bottom: `${b.bottom}%`,
            right: `${b.right}%`,
            animation: `${b.float} ${b.duration}s ${b.delay}s ease-in-out infinite`,
            ["--flap-speed" as string]: `${b.flapSpeed}s`,
          }}
        >
          <ButterflyShape size={b.size} color={b.color} />
        </div>
      ))}
    </div>
  );
}

export function BloementuinHeroAnimations() {
  return (
    <>
      <FallingPetals />
      <FloatingButterflies />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bloementuin-petal-fall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 0;
          }
          15% {
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

        @keyframes bloementuin-flap {
          0%, 100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(0.3);
          }
        }

        @keyframes bloementuin-float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(12px, -18px);
          }
          50% {
            transform: translate(-8px, -10px);
          }
          75% {
            transform: translate(15px, 8px);
          }
        }

        @keyframes bloementuin-float-down {
          0%, 100% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-10px, 15px);
          }
          45% {
            transform: translate(8px, 30px);
          }
          70% {
            transform: translate(-15px, 20px);
          }
          85% {
            transform: translate(5px, 8px);
          }
        }
      `}} />
    </>
  );
}
