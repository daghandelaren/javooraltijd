/**
 * Wax seal color utilities
 *
 * Provides functions for color manipulation and generating
 * color palettes for the wax seal component.
 */

// Default wax seal color (red/bordeaux)
export const DEFAULT_SEAL_COLOR = "#9E1F3F";

// Fixed wax seal color options
export const SEAL_COLOR_PRESETS = [
  { hex: "#9E1F3F", label: "Bordeaux" },
  { hex: "#F2E6D6", label: "Champagne" },
  { hex: "#0F5B3E", label: "Smaragd" },
  { hex: "#B9922E", label: "Goud" },
  { hex: "#3E5C76", label: "Dusty Blue" },
  { hex: "#9AA0A6", label: "Stone Grey" },
  { hex: "#4B2E24", label: "Chocolade" },
  { hex: "#B76E79", label: "Roze Wolk" },
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
  "#9E1F3F": {
    // Bordeaux
    image: "/images/seals/seal-bordeaux.png",
    palette: {
      base: "#C83A5A",
      lighter: "#E88898",
      darker: "#6A1A2A",
      emboss: "#6A1A2A",
    },
  },
  "#F2E6D6": {
    // Champagne - matching the seal's silvery-beige tones
    image: "/images/seals/seal-champagne.png",
    palette: {
      base: "#C8C0B8",
      lighter: "#E0D8D0",
      darker: "#807870",
      emboss: "#706860",
    },
  },
  "#0F5B3E": {
    // Smaragd - toned down highlight
    image: "/images/seals/seal-smaragd.png",
    palette: {
      base: "#70B088",
      lighter: "#72B08A",
      darker: "#60A080",
      emboss: "#60A080",
    },
  },
  "#B9922E": {
    // Goud - golden yellow shadows matching highlight
    image: "/images/seals/seal-goud.png",
    palette: {
      base: "#C8B848",
      lighter: "#E0D060",
      darker: "#B8B048",
      emboss: "#B8B048",
    },
  },
  "#3E5C76": {
    // Dusty Blue - bright muted gray-blue like Bordeaux approach
    image: "/images/seals/seal-dusty-blue.png",
    palette: {
      base: "#90A8B8",
      lighter: "#A8C0D0",
      darker: "#80A0B0",
      emboss: "#80A0B0",
    },
  },
  "#9AA0A6": {
    // Stone Grey - grey tones that blend with the seal
    image: "/images/seals/seal-stone-grey.png",
    palette: {
      base: "#B8BEC4",
      lighter: "#D0D4D8",
      darker: "#8A9098",
      emboss: "#6A7078",
    },
  },
  "#4B2E24": {
    // Chocolade - bright neutral, no red
    image: "/images/seals/seal-chocolade.png",
    palette: {
      base: "#A8A4A4",
      lighter: "#C0BCBC",
      darker: "#989494",
      emboss: "#989494",
    },
  },
  "#B76E79": {
    // Roze Wolk - bright dusty rose like Bordeaux
    image: "/images/seals/seal-roze-wolk.png",
    palette: {
      base: "#C8A0A8",
      lighter: "#E0B8C0",
      darker: "#B89098",
      emboss: "#B89098",
    },
  },
};

/**
 * Get the seal image path for a given color.
 * Returns the matching pre-rendered PNG, or falls back to bordeaux.
 */
export function getSealImage(color: string): string {
  const normalized = color.toUpperCase();
  const config = SEAL_COLOR_CONFIG[normalized];
  return config?.image || "/images/seals/seal-bordeaux.png";
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
