import { type Template } from "@/lib/templates";

export const stdTemplates: Template[] = [
  {
    id: "std-1",
    slug: "std-watercolor-villa",
    name: "Watercolor Villa",
    nameEn: "Watercolor Villa",
    description:
      "Elegante aquarelbloemen in een boogkader met zachte blauwtinten. Perfect als Save the Date voor een kustbruiloft.",
    descriptionEn:
      "Elegant watercolor florals in an arch frame with soft blue tones. Perfect as a Save the Date for a coastal wedding.",
    style: "coastal",
    sealColor: "#7B95A5",
    colors: {
      primary: "#6B9CC3",
      secondary: "#D4A0A0",
      accent: "#EEF4F9",
      background: "#FDFCFA",
      backgroundGradient: "linear-gradient(180deg, #FDFCFA 0%, #FDFCFA 100%)",
      text: "#2C3E50",
      textMuted: "#6B8299",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lora",
      accent: "Dancing Script",
    },
    dividerStyle: "shell",
  },
  {
    id: "std-2",
    slug: "std-limoncello",
    name: "Limoncello",
    nameEn: "Limoncello",
    description:
      "Mediterraans design met olijfgroen en citroenen op een donkere achtergrond. Een opvallende Save the Date.",
    descriptionEn:
      "Mediterranean design with olive green and lemons on a dark background. A striking Save the Date.",
    style: "mediterranean",
    sealColor: "#8EA870",
    colors: {
      primary: "#C9A84C",
      secondary: "#E8A735",
      accent: "#F5F0E0",
      background: "#4d583f",
      backgroundGradient: "linear-gradient(180deg, #4d583f 0%, #4d583f 100%)",
      text: "#F5F0E0",
      textMuted: "#D0D4B8",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lora",
      accent: "Dancing Script",
    },
    dividerStyle: "citrus",
  },
  {
    id: "std-3",
    slug: "std-minimalist",
    name: "Minimalist",
    nameEn: "Minimalist",
    description:
      "Puur en elegant met grote serif letters op een strak wit canvas. De perfecte minimalistische Save the Date.",
    descriptionEn:
      "Pure and elegant with large serif letters on a clean white canvas. The perfect minimalist Save the Date.",
    style: "minimalist",
    sealColor: "#2C2C2C",
    colors: {
      primary: "#2C2C2C",
      secondary: "#999999",
      accent: "#F5F5F5",
      background: "#FFFFFF",
      backgroundGradient: "#FFFFFF",
      text: "#3D3D3D",
      textMuted: "#999999",
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Cormorant Garamond",
      accent: "Lavishly Yours",
    },
    dividerStyle: "line",
  },
];

export function getStdTemplateBySlug(slug: string): Template | undefined {
  return stdTemplates.find((t) => t.slug === slug);
}

export function getStdTemplateById(id: string): Template | undefined {
  return stdTemplates.find((t) => t.id === id);
}

export function getStdTemplateColors(templateId: string | null) {
  const template = templateId ? getStdTemplateById(templateId) : null;
  return template?.colors || stdTemplates[0].colors;
}

export function getStdTemplateFonts(templateId: string | null) {
  const template = templateId ? getStdTemplateById(templateId) : null;
  return template?.fonts || stdTemplates[0].fonts;
}
