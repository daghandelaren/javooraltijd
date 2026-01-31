// Wax seal font configuration
// Similar pattern to wax-colors.ts

export type SealFontId = "lora" | "marcellus" | "permanent-marker";

export interface SealFontConfig {
  id: SealFontId;
  label: string;
  labelNl: string;
  cssFamily: string;
  threejsPath: string;
  fallbackCss: string;
  style: "script" | "serif" | "display";
  verticalOffset?: number; // Adjustment for visual centering (positive = up)
  sizeMultiplier?: number; // Font size multiplier (default 1.0)
}

export const SEAL_FONT_PRESETS: readonly SealFontConfig[] = [
  {
    id: "lora",
    label: "Lora",
    labelNl: "Elegant",
    cssFamily: "'Lora'",
    threejsPath: "/fonts/Lora-SemiBold.json",
    fallbackCss: "Georgia, serif",
    style: "serif",
    sizeMultiplier: 1.05,
  },
  {
    id: "permanent-marker",
    label: "Permanent Marker",
    labelNl: "Handgeschreven",
    cssFamily: "'Permanent Marker'",
    threejsPath: "/fonts/PermanentMarker-Regular.json",
    fallbackCss: "'Comic Sans MS', cursive",
    style: "display",
  },
  {
    id: "marcellus",
    label: "Marcellus",
    labelNl: "Klassiek",
    cssFamily: "'Marcellus'",
    threejsPath: "/fonts/Marcellus-Regular.json",
    fallbackCss: "Georgia, serif",
    style: "serif",
  },
] as const;

export const DEFAULT_SEAL_FONT: SealFontId = "lora";

export function getSealFontConfig(fontId: SealFontId): SealFontConfig {
  return (
    SEAL_FONT_PRESETS.find((f) => f.id === fontId) || SEAL_FONT_PRESETS[0]
  );
}

export function getSealFontCss(fontId: SealFontId): string {
  const config = getSealFontConfig(fontId);
  return `${config.cssFamily}, ${config.fallbackCss}`;
}

export function getSealFont3DPath(fontId: SealFontId): string {
  const config = getSealFontConfig(fontId);
  return config.threejsPath;
}
