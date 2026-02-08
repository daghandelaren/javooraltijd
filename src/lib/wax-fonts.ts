// Wax seal font configuration
// Similar pattern to wax-colors.ts

export type SealFontId = "lavishly-yours" | "rouge-script" | "updock";

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
    id: "lavishly-yours",
    label: "Lavishly Yours",
    labelNl: "Sierlijk",
    cssFamily: "'Lavishly Yours'",
    threejsPath: "/fonts/LavishlyYours-Regular.json",
    fallbackCss: "cursive",
    style: "script",
    sizeMultiplier: 1.1,
  },
  {
    id: "rouge-script",
    label: "Rouge Script",
    labelNl: "Kalligrafie",
    cssFamily: "'Rouge Script'",
    threejsPath: "/fonts/RougeScript-Regular.json",
    fallbackCss: "cursive",
    style: "script",
    sizeMultiplier: 1.4,
  },
  {
    id: "updock",
    label: "Updock",
    labelNl: "Handgeschreven",
    cssFamily: "'Updock'",
    threejsPath: "/fonts/Updock-Regular.json",
    fallbackCss: "cursive",
    style: "script",
    sizeMultiplier: 1.47,
  },
] as const;

export const DEFAULT_SEAL_FONT: SealFontId = "lavishly-yours";

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
