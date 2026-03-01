"use client";

/**
 * SVG-based watercolor floral background for the STD Watercolor Villa template.
 * Renders delicate floral arch elements with soft blue/rose tones.
 * Can be replaced with a raster image at public/images/std/watercolor-villa/hero.png.
 */

export function StdWatercolorVillaBackground() {
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
          <filter id="wv-watercolor" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="wv-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Color gradients */}
          <linearGradient id="wv-blue1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8D4E8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D4E4F0" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="wv-rose1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4A0A0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E8C4C4" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="wv-sage" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#A8C0A0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C4D8BC" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="wv-bloom1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A0A0" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#E0B8B8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E8C4C4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wv-bloom2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6B9CC3" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#8FB4D4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#B8D4E8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Top-left floral cluster */}
        <g filter="url(#wv-watercolor)" opacity="0.7">
          {/* Large rose bloom */}
          <ellipse cx="120" cy="180" rx="110" ry="100" fill="url(#wv-bloom1)" />
          <ellipse cx="80" cy="140" rx="70" ry="60" fill="url(#wv-bloom1)" />
          {/* Leaves */}
          <ellipse cx="30" cy="250" rx="55" ry="18" fill="url(#wv-sage)" transform="rotate(-30, 30, 250)" />
          <ellipse cx="180" cy="100" rx="45" ry="14" fill="url(#wv-sage)" transform="rotate(20, 180, 100)" />
          <ellipse cx="60" cy="80" rx="40" ry="12" fill="url(#wv-sage)" transform="rotate(-15, 60, 80)" />
          {/* Blue accent flowers */}
          <circle cx="200" cy="160" r="35" fill="url(#wv-bloom2)" />
          <circle cx="50" cy="300" r="25" fill="url(#wv-bloom2)" />
        </g>

        {/* Top-right floral cluster */}
        <g filter="url(#wv-watercolor)" opacity="0.7">
          <ellipse cx="880" cy="160" rx="100" ry="90" fill="url(#wv-bloom1)" />
          <ellipse cx="920" cy="120" rx="65" ry="55" fill="url(#wv-bloom2)" />
          <ellipse cx="970" cy="230" rx="50" ry="15" fill="url(#wv-sage)" transform="rotate(25, 970, 230)" />
          <ellipse cx="810" cy="90" rx="40" ry="13" fill="url(#wv-sage)" transform="rotate(-20, 810, 90)" />
          <circle cx="800" cy="180" r="30" fill="url(#wv-bloom1)" />
        </g>

        {/* Decorative arch outline */}
        <path
          d="M 200 1400 L 200 500 Q 200 200 500 200 Q 800 200 800 500 L 800 1400"
          fill="none"
          stroke="#B8D4E8"
          strokeWidth="1"
          opacity="0.25"
          filter="url(#wv-soft)"
        />

        {/* Bottom-left floral elements */}
        <g filter="url(#wv-watercolor)" opacity="0.55">
          <ellipse cx="80" cy="1250" rx="90" ry="80" fill="url(#wv-bloom1)" />
          <ellipse cx="150" cy="1300" rx="60" ry="50" fill="url(#wv-bloom2)" />
          <ellipse cx="30" cy="1180" rx="50" ry="15" fill="url(#wv-sage)" transform="rotate(-35, 30, 1180)" />
          <ellipse cx="200" cy="1350" rx="45" ry="13" fill="url(#wv-sage)" transform="rotate(15, 200, 1350)" />
        </g>

        {/* Bottom-right floral elements */}
        <g filter="url(#wv-watercolor)" opacity="0.55">
          <ellipse cx="920" cy="1230" rx="85" ry="75" fill="url(#wv-bloom2)" />
          <ellipse cx="860" cy="1310" rx="55" ry="48" fill="url(#wv-bloom1)" />
          <ellipse cx="970" cy="1170" rx="45" ry="14" fill="url(#wv-sage)" transform="rotate(30, 970, 1170)" />
          <ellipse cx="800" cy="1370" rx="40" ry="12" fill="url(#wv-sage)" transform="rotate(-20, 800, 1370)" />
        </g>

        {/* Scattered petals */}
        <g filter="url(#wv-soft)" opacity="0.3">
          <ellipse cx="300" cy="350" rx="12" ry="8" fill="#D4A0A0" transform="rotate(45, 300, 350)" />
          <ellipse cx="700" cy="400" rx="10" ry="6" fill="#D4A0A0" transform="rotate(-30, 700, 400)" />
          <ellipse cx="150" cy="700" rx="8" ry="5" fill="#B8D4E8" transform="rotate(60, 150, 700)" />
          <ellipse cx="850" cy="650" rx="9" ry="6" fill="#B8D4E8" transform="rotate(-45, 850, 650)" />
          <ellipse cx="250" cy="1000" rx="10" ry="7" fill="#D4A0A0" transform="rotate(20, 250, 1000)" />
          <ellipse cx="750" cy="950" rx="8" ry="5" fill="#B8D4E8" transform="rotate(-55, 750, 950)" />
        </g>
      </svg>

      {/* Center vignette for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 50%, rgba(253,252,250,0.65) 0%, rgba(253,252,250,0.3) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
