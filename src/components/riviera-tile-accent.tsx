/**
 * Azulejo tile-inspired decorative accents for the Riviera template.
 * SVG motifs echo the Portuguese tile pattern from the hero image.
 * Uses the template's primary blue (#6B9CC3).
 */

const TILE_BLUE = "#6B9CC3";

/** Single azulejo tile motif — central flower with curling scrollwork and petals */
function AzulejoMotif({ size = 48, opacity = 0.18 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Central four-petal flower */}
      <path
        d="M24 18 C26 20, 28 22, 28 24 C28 26, 26 28, 24 30 C22 28, 20 26, 20 24 C20 22, 22 20, 24 18Z"
        fill={TILE_BLUE}
      />
      <path
        d="M18 24 C20 22, 22 20, 24 20 C26 20, 28 22, 30 24 C28 26, 26 28, 24 28 C22 28, 20 26, 18 24Z"
        fill={TILE_BLUE}
      />
      {/* Center dot */}
      <circle cx="24" cy="24" r="2" fill="white" />
      <circle cx="24" cy="24" r="1.2" fill={TILE_BLUE} />
      {/* Top petal */}
      <path d="M24 6 C26 10, 26 14, 24 17 C22 14, 22 10, 24 6Z" fill={TILE_BLUE} />
      {/* Bottom petal */}
      <path d="M24 42 C26 38, 26 34, 24 31 C22 34, 22 38, 24 42Z" fill={TILE_BLUE} />
      {/* Left petal */}
      <path d="M6 24 C10 22, 14 22, 17 24 C14 26, 10 26, 6 24Z" fill={TILE_BLUE} />
      {/* Right petal */}
      <path d="M42 24 C38 22, 34 22, 31 24 C34 26, 38 26, 42 24Z" fill={TILE_BLUE} />
      {/* Diagonal teardrops */}
      <path d="M12 12 C14 13, 16 15, 16 17 C14 16, 13 14, 12 12Z" fill={TILE_BLUE} />
      <path d="M36 12 C34 13, 32 15, 32 17 C34 16, 35 14, 36 12Z" fill={TILE_BLUE} />
      <path d="M12 36 C14 35, 16 33, 16 31 C14 32, 13 34, 12 36Z" fill={TILE_BLUE} />
      <path d="M36 36 C34 35, 32 33, 32 31 C34 32, 35 34, 36 36Z" fill={TILE_BLUE} />
      {/* Corner scrollwork curls */}
      <path d="M8 8 C10 8, 12 9, 12 11 C11 10, 9 10, 8 8Z" fill={TILE_BLUE} opacity="0.6" />
      <path d="M40 8 C38 8, 36 9, 36 11 C37 10, 39 10, 40 8Z" fill={TILE_BLUE} opacity="0.6" />
      <path d="M8 40 C10 40, 12 39, 12 37 C11 38, 9 38, 8 40Z" fill={TILE_BLUE} opacity="0.6" />
      <path d="M40 40 C38 40, 36 39, 36 37 C37 38, 39 38, 40 40Z" fill={TILE_BLUE} opacity="0.6" />
    </svg>
  );
}

/** Repeating tile background that fills the entire location section */
export function RivieraTileAccent() {
  // The SVG is defined once as a pattern tile that repeats seamlessly
  const tileSize = 92;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="azulejo-pattern"
            x="0"
            y="0"
            width={tileSize}
            height={tileSize}
            patternUnits="userSpaceOnUse"
          >
            {/* Central four-petal flower */}
            <path
              d="M46 40 C48 42, 50 44, 50 46 C50 48, 48 50, 46 52 C44 50, 42 48, 42 46 C42 44, 44 42, 46 40Z"
              fill={TILE_BLUE}
            />
            <path
              d="M40 46 C42 44, 44 42, 46 42 C48 42, 50 44, 52 46 C50 48, 48 50, 46 50 C44 50, 42 48, 40 46Z"
              fill={TILE_BLUE}
            />
            {/* Center dot */}
            <circle cx="46" cy="46" r="2.2" fill="white" />
            <circle cx="46" cy="46" r="1.3" fill={TILE_BLUE} />
            {/* Cardinal petals */}
            <path d="M46 26 C48 30, 48 36, 46 39 C44 36, 44 30, 46 26Z" fill={TILE_BLUE} />
            <path d="M46 66 C48 62, 48 56, 46 53 C44 56, 44 62, 46 66Z" fill={TILE_BLUE} />
            <path d="M26 46 C30 44, 36 44, 39 46 C36 48, 30 48, 26 46Z" fill={TILE_BLUE} />
            <path d="M66 46 C62 44, 56 44, 53 46 C56 48, 62 48, 66 46Z" fill={TILE_BLUE} />
            {/* Diagonal teardrops */}
            <path d="M34 34 C36 35, 38 37, 38 39 C36 38, 35 36, 34 34Z" fill={TILE_BLUE} />
            <path d="M58 34 C56 35, 54 37, 54 39 C56 38, 57 36, 58 34Z" fill={TILE_BLUE} />
            <path d="M34 58 C36 57, 38 55, 38 53 C36 54, 35 56, 34 58Z" fill={TILE_BLUE} />
            <path d="M58 58 C56 57, 54 55, 54 53 C56 54, 57 56, 58 58Z" fill={TILE_BLUE} />
            {/* Corner curls */}
            <path d="M30 30 C32 30, 34 31, 34 33 C33 32, 31 32, 30 30Z" fill={TILE_BLUE} opacity="0.6" />
            <path d="M62 30 C60 30, 58 31, 58 33 C59 32, 61 32, 62 30Z" fill={TILE_BLUE} opacity="0.6" />
            <path d="M30 62 C32 62, 34 61, 34 59 C33 60, 31 60, 30 62Z" fill={TILE_BLUE} opacity="0.6" />
            <path d="M62 62 C60 62, 58 61, 58 59 C59 60, 61 60, 62 62Z" fill={TILE_BLUE} opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#azulejo-pattern)" opacity="0.10" />
      </svg>
    </div>
  );
}
