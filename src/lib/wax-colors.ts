/**
 * Wax seal color utilities
 *
 * Provides functions for color manipulation and generating
 * color palettes for the wax seal component.
 */

// Default wax seal color (Olijfgaard)
export const DEFAULT_SEAL_COLOR = "#8EA870";

// Fixed wax seal color options
export const SEAL_COLOR_PRESETS = [
  { hex: "#A89088", label: "Kasjmier" },
  { hex: "#9B89B6", label: "Lavendel" },
  { hex: "#8B9E98", label: "Eucalyptus" },
  { hex: "#B0AEB0", label: "Parelsteen" },
  { hex: "#7B95A5", label: "Leisteen" },
  { hex: "#C09878", label: "Koperkaramel" },
  { hex: "#8EA870", label: "Olijfgaard" },
  { hex: "#D08088", label: "Rozen" },
] as const;

/**
 * Seal color configuration with pre-rendered PNG images and hand-tuned palettes.
 * Using separate PNGs for each color gives pixel-perfect visual quality
 * without CSS filter artifacts (especially for light/pastel colors).
 */
export interface SealColorConfig {
  image: string;
  palette: WaxColorPalette;
}

export const SEAL_COLOR_CONFIG: Record<string, SealColorConfig> = {
  "#A89088": {
    // Kasjmier
    image: "/images/seals/seal-Kasjmier.png",
    palette: {
      base: "#C0A8A0",
      lighter: "#D8C0B8",
      darker: "#887068",
      emboss: "#786058",
    },
  },
  "#9B89B6": {
    // Lavendel
    image: "/images/seals/seal-Lavendel.png",
    palette: {
      base: "#B0A0C8",
      lighter: "#C8B8D8",
      darker: "#786898",
      emboss: "#685888",
    },
  },
  "#8B9E98": {
    // Eucalyptus
    image: "/images/seals/seal-Eucalyptus.png",
    palette: {
      base: "#A0B8B0",
      lighter: "#B8D0C8",
      darker: "#708880",
      emboss: "#607870",
    },
  },
  "#B0AEB0": {
    // Parelsteen
    image: "/images/seals/seal-Parelsteen.png",
    palette: {
      base: "#C8C6C8",
      lighter: "#D8D6D8",
      darker: "#989698",
      emboss: "#888688",
    },
  },
  "#7B95A5": {
    // Leisteen
    image: "/images/seals/seal-Leisteen.png",
    palette: {
      base: "#98B0C0",
      lighter: "#B0C8D8",
      darker: "#607888",
      emboss: "#506878",
    },
  },
  "#C09878": {
    // Koperkaramel
    image: "/images/seals/seal-Koperkaramel.png",
    palette: {
      base: "#D8B090",
      lighter: "#E8C8A8",
      darker: "#A88060",
      emboss: "#987050",
    },
  },
  "#8EA870": {
    // Olijfgaard
    image: "/images/seals/seal-Olijfgaard.png",
    palette: {
      base: "#A8C088",
      lighter: "#C0D8A0",
      darker: "#789060",
      emboss: "#688050",
    },
  },
  "#D08088": {
    // Rozen
    image: "/images/seals/seal-Rozen.png",
    palette: {
      base: "#E098A0",
      lighter: "#F0B0B8",
      darker: "#B06870",
      emboss: "#A05860",
    },
  },
};

/**
 * Get the seal image path for a given color.
 * Returns the matching pre-rendered PNG, or falls back to Rozen.
 */
export function getSealImage(color: string): string {
  const normalized = color.toUpperCase();
  const config = SEAL_COLOR_CONFIG[normalized];
  return config?.image || "/images/seals/seal-Olijfgaard.png";
}

/**
 * Get the seal configuration for a given color.
 * Returns the config with image path and palette, or undefined if not found.
 */
export function getSealConfig(color: string): SealColorConfig | undefined {
  const normalized = color.toUpperCase();
  return SEAL_COLOR_CONFIG[normalized];
}

// HSL color interface
interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Convert hex color to HSL
 */
export function hexToHSL(hex: string): HSL {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 50, l: 50 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Wax color palette for embossing effects
 */
export interface WaxColorPalette {
  base: string;
  lighter: string;
  darker: string;
  emboss: string;
}

/**
 * Create a color palette from a base color for wax seal embossing
 *
 * The initials need to be BRIGHTER than the seal color to be visible
 * against the wax texture. We increase lightness significantly and
 * ensure minimum thresholds so dark colors don't become black.
 */
export function createWaxColorPalette(baseColor: string): WaxColorPalette {
  // Use hand-tuned palettes from config when available
  const config = getSealConfig(baseColor);
  if (config) {
    return config.palette;
  }

  const hsl = hexToHSL(baseColor);

  // For embossed initials, we need brighter colors that stand out
  // Original red seal used #C83A5A (L~45) for base text on #9E1F3F (L~37) seal
  // So we boost lightness by ~20-25% and ensure minimum values

  const baseLightness = Math.max(40, hsl.l + 20); // Brighter base for visibility
  const lightLightness = Math.max(55, hsl.l + 35); // Even brighter for highlights
  const darkLightness = Math.max(25, hsl.l - 10); // Darker but not black for shadows

  return {
    base: hslToHex(hsl.h, Math.min(85, hsl.s), baseLightness),
    lighter: hslToHex(hsl.h, Math.max(0, hsl.s - 10), lightLightness),
    darker: hslToHex(hsl.h, Math.min(100, hsl.s + 5), darkLightness),
    emboss: hslToHex(hsl.h, Math.min(100, hsl.s + 5), Math.max(20, hsl.l - 15)),
  };
}

/**
 * Calculate CSS hue-rotate degrees needed to transform the red base seal
 * to a target color.
 *
 * The base red seal (#9E1F3F) has a hue of approximately 347 degrees.
 * This function calculates the rotation needed to reach the target hue.
 */
export function calculateHueRotation(targetHex: string): number {
  const baseHsl = hexToHSL(DEFAULT_SEAL_COLOR); // Red base ~347 hue
  const targetHsl = hexToHSL(targetHex);

  // Calculate the hue difference
  let hueDiff = targetHsl.h - baseHsl.h;

  // Normalize to -180 to 180 range for shortest rotation path
  if (hueDiff > 180) hueDiff -= 360;
  if (hueDiff < -180) hueDiff += 360;

  return Math.round(hueDiff);
}

/**
 * Calculate CSS saturation adjustment (as multiplier) to match target color
 */
export function calculateSaturationAdjustment(targetHex: string): number {
  const baseHsl = hexToHSL(DEFAULT_SEAL_COLOR);
  const targetHsl = hexToHSL(targetHex);

  // Return ratio of target to base saturation
  if (baseHsl.s === 0) return 1;
  return targetHsl.s / baseHsl.s;
}

/**
 * Calculate CSS brightness adjustment to match target color
 */
export function calculateBrightnessAdjustment(targetHex: string): number {
  const baseHsl = hexToHSL(DEFAULT_SEAL_COLOR);
  const targetHsl = hexToHSL(targetHex);

  // Return ratio of target to base lightness
  if (baseHsl.l === 0) return 1;
  return targetHsl.l / baseHsl.l;
}

/**
 * Get CSS filter string to transform red seal to target color
 */
export function getSealColorFilter(targetHex: string): string {
  // If it's the default red, no filter needed
  if (targetHex.toLowerCase() === DEFAULT_SEAL_COLOR.toLowerCase()) {
    return "none";
  }

  const hueRotate = calculateHueRotation(targetHex);
  const saturation = calculateSaturationAdjustment(targetHex);
  const brightness = calculateBrightnessAdjustment(targetHex);

  return `hue-rotate(${hueRotate}deg) saturate(${saturation.toFixed(2)}) brightness(${brightness.toFixed(2)})`;
}

/**
 * Validate if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Normalize hex color to 6-digit format with #
 */
export function normalizeHexColor(color: string): string {
  let hex = color.replace("#", "");

  // Expand 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  return `#${hex.toUpperCase()}`;
}
