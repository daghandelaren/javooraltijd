// Envelope color presets
export interface EnvelopeColor {
  hex: string;
  label: string;
}

export const ENVELOPE_COLORS: EnvelopeColor[] = [
  { hex: "#FFFFFF", label: "Wit" },
  { hex: "#FDF8F3", label: "Crème" },
  { hex: "#F5E6D3", label: "Champagne" },
  { hex: "#E8DDD4", label: "Taupe" },
  { hex: "#D4C4B5", label: "Kraft" },
  { hex: "#2C3E50", label: "Donkerblauw" },
  { hex: "#722F37", label: "Bordeaux" },
  { hex: "#355E3B", label: "Bosgroen" },
];

export const DEFAULT_ENVELOPE_COLOR = "#FDF8F3"; // Crème

// Envelope liner patterns
export interface EnvelopeLiner {
  id: string;
  label: string;
}

export const ENVELOPE_LINERS: EnvelopeLiner[] = [
  { id: "none", label: "Geen" },
  { id: "floral", label: "Bloemen" },
  { id: "geometric", label: "Geometrisch" },
  { id: "marble", label: "Marmer" },
  { id: "botanical", label: "Botanisch" },
];

export const DEFAULT_ENVELOPE_LINER = "floral";

// Helper to check if a color is valid
export function isValidEnvelopeColor(hex: string): boolean {
  return ENVELOPE_COLORS.some(
    (color) => color.hex.toLowerCase() === hex.toLowerCase()
  );
}

// Helper to get envelope color label
export function getEnvelopeColorLabel(hex: string): string {
  const color = ENVELOPE_COLORS.find(
    (c) => c.hex.toLowerCase() === hex.toLowerCase()
  );
  return color?.label || "Custom";
}

// Helper to get liner label
export function getLinerLabel(id: string): string {
  const liner = ENVELOPE_LINERS.find((l) => l.id === id);
  return liner?.label || "Geen";
}
