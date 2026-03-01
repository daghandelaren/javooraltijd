"use client";

/**
 * SVG-based Mediterranean citrus background for the STD Limoncello template.
 * Renders lemon/citrus shapes with olive leaves on a dark background.
 * Can be replaced with a raster image at public/images/std/limoncello/hero.png.
 */

export function StdLimoncelloBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1400"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Watercolor texture filter */}
          <filter id="lc-watercolor" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="lc-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          {/* Lemon gradient */}
          <radialGradient id="lc-lemon" cx="45%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#F5D55A" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#E8C435" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4A820" stopOpacity="0.15" />
          </radialGradient>
          {/* Olive leaf gradient */}
          <linearGradient id="lc-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6B8B5E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4A6741" stopOpacity="0.25" />
          </linearGradient>
          {/* Dark leaf gradient */}
          <linearGradient id="lc-leaf-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3D5A35" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2A4025" stopOpacity="0.3" />
          </linearGradient>
          {/* Blossom accent */}
          <radialGradient id="lc-blossom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5F0E0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F5F0E0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Top-left cluster: lemons with olive branches */}
        <g filter="url(#lc-watercolor)" opacity="0.8">
          {/* Branch stems */}
          <path d="M -20 120 Q 80 140 180 100 Q 250 70 280 50" fill="none" stroke="#4A6741" strokeWidth="2.5" opacity="0.35" />
          <path d="M -10 60 Q 60 80 130 50" fill="none" stroke="#4A6741" strokeWidth="2" opacity="0.3" />

          {/* Lemons */}
          <ellipse cx="100" cy="110" rx="40" ry="30" fill="url(#lc-lemon)" transform="rotate(-15, 100, 110)" />
          <ellipse cx="180" cy="80" rx="35" ry="26" fill="url(#lc-lemon)" transform="rotate(10, 180, 80)" />
          <ellipse cx="50" cy="60" rx="30" ry="22" fill="url(#lc-lemon)" transform="rotate(-25, 50, 60)" />

          {/* Olive leaves */}
          <ellipse cx="240" cy="60" rx="35" ry="10" fill="url(#lc-leaf)" transform="rotate(-20, 240, 60)" />
          <ellipse cx="220" cy="90" rx="30" ry="9" fill="url(#lc-leaf)" transform="rotate(15, 220, 90)" />
          <ellipse cx="30" cy="150" rx="28" ry="8" fill="url(#lc-leaf-dark)" transform="rotate(-40, 30, 150)" />
          <ellipse cx="140" cy="140" rx="32" ry="9" fill="url(#lc-leaf)" transform="rotate(25, 140, 140)" />
          <ellipse cx="70" cy="40" rx="25" ry="7" fill="url(#lc-leaf-dark)" transform="rotate(-10, 70, 40)" />

          {/* Tiny blossoms */}
          <circle cx="160" cy="55" r="8" fill="url(#lc-blossom)" />
          <circle cx="250" cy="100" r="6" fill="url(#lc-blossom)" />
        </g>

        {/* Top-right cluster */}
        <g filter="url(#lc-watercolor)" opacity="0.8">
          <path d="M 1020 100 Q 920 120 820 90 Q 760 70 730 55" fill="none" stroke="#4A6741" strokeWidth="2.5" opacity="0.35" />

          <ellipse cx="900" cy="95" rx="38" ry="28" fill="url(#lc-lemon)" transform="rotate(20, 900, 95)" />
          <ellipse cx="820" cy="70" rx="33" ry="24" fill="url(#lc-lemon)" transform="rotate(-10, 820, 70)" />
          <ellipse cx="960" cy="55" rx="28" ry="20" fill="url(#lc-lemon)" transform="rotate(30, 960, 55)" />

          <ellipse cx="760" cy="60" rx="32" ry="9" fill="url(#lc-leaf)" transform="rotate(25, 760, 60)" />
          <ellipse cx="780" cy="100" rx="28" ry="8" fill="url(#lc-leaf-dark)" transform="rotate(-15, 780, 100)" />
          <ellipse cx="950" cy="130" rx="30" ry="8" fill="url(#lc-leaf)" transform="rotate(35, 950, 130)" />
          <ellipse cx="870" cy="130" rx="26" ry="8" fill="url(#lc-leaf-dark)" transform="rotate(-25, 870, 130)" />

          <circle cx="840" cy="50" r="7" fill="url(#lc-blossom)" />
          <circle cx="740" cy="85" r="5" fill="url(#lc-blossom)" />
        </g>

        {/* Bottom-left cluster */}
        <g filter="url(#lc-watercolor)" opacity="0.65">
          <path d="M -15 1300 Q 80 1280 170 1310 Q 230 1330 260 1350" fill="none" stroke="#4A6741" strokeWidth="2" opacity="0.3" />

          <ellipse cx="90" cy="1290" rx="36" ry="27" fill="url(#lc-lemon)" transform="rotate(-20, 90, 1290)" />
          <ellipse cx="170" cy="1320" rx="30" ry="22" fill="url(#lc-lemon)" transform="rotate(15, 170, 1320)" />

          <ellipse cx="40" cy="1260" rx="30" ry="9" fill="url(#lc-leaf)" transform="rotate(-30, 40, 1260)" />
          <ellipse cx="230" cy="1340" rx="28" ry="8" fill="url(#lc-leaf-dark)" transform="rotate(20, 230, 1340)" />
          <ellipse cx="130" cy="1355" rx="25" ry="7" fill="url(#lc-leaf)" transform="rotate(-15, 130, 1355)" />

          <circle cx="200" cy="1300" r="6" fill="url(#lc-blossom)" />
        </g>

        {/* Bottom-right cluster */}
        <g filter="url(#lc-watercolor)" opacity="0.65">
          <path d="M 1015 1280 Q 930 1260 840 1290 Q 780 1310 750 1340" fill="none" stroke="#4A6741" strokeWidth="2" opacity="0.3" />

          <ellipse cx="910" cy="1270" rx="34" ry="25" fill="url(#lc-lemon)" transform="rotate(25, 910, 1270)" />
          <ellipse cx="830" cy="1300" rx="28" ry="21" fill="url(#lc-lemon)" transform="rotate(-10, 830, 1300)" />

          <ellipse cx="960" cy="1240" rx="28" ry="8" fill="url(#lc-leaf-dark)" transform="rotate(30, 960, 1240)" />
          <ellipse cx="770" cy="1325" rx="26" ry="8" fill="url(#lc-leaf)" transform="rotate(-25, 770, 1325)" />
          <ellipse cx="870" cy="1340" rx="24" ry="7" fill="url(#lc-leaf)" transform="rotate(10, 870, 1340)" />

          <circle cx="800" cy="1280" r="5" fill="url(#lc-blossom)" />
        </g>

        {/* Scattered single leaves */}
        <g filter="url(#lc-watercolor)" opacity="0.25">
          <ellipse cx="150" cy="600" rx="20" ry="6" fill="#4A6741" transform="rotate(45, 150, 600)" />
          <ellipse cx="850" cy="550" rx="18" ry="5" fill="#4A6741" transform="rotate(-35, 850, 550)" />
          <ellipse cx="100" cy="900" rx="16" ry="5" fill="#4A6741" transform="rotate(60, 100, 900)" />
          <ellipse cx="900" cy="850" rx="15" ry="5" fill="#4A6741" transform="rotate(-50, 900, 850)" />
        </g>
      </svg>

      {/* Center vignette for text readability on dark background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 50%, rgba(26,46,26,0.6) 0%, rgba(26,46,26,0.3) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
