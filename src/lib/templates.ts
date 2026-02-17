import { DEFAULT_SEAL_COLOR } from "@/lib/wax-colors";

export interface Template {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  style: "romantic" | "modern" | "botanical" | "mediterranean" | "coastal" | "minimalist";
  sealColor: string; // Hex color
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundGradient: string;
    text: string;
    textMuted: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  // Section divider style
  dividerStyle: "floral" | "geometric" | "botanical" | "citrus" | "shell" | "line";
}

export const templates: Template[] = [
  {
    id: "1",
    slug: "riviera",
    name: "Riviera",
    nameEn: "Riviera",
    description:
      "Portugees tegelpatroon met boogkader en duiven. Perfect voor een kustbruiloft met mediterrane invloeden.",
    descriptionEn:
      "Portuguese tile pattern with arch frame and doves. Perfect for a coastal wedding with Mediterranean influences.",
    style: "coastal",
    sealColor: "#A89088", // Kasjmier
    colors: {
      primary: "#6B9CC3", // Blue tile
      secondary: "#D4A0A0", // Shell pink
      accent: "#EEF4F9", // Light blue tint
      background: "#FDFCFA", // Off-white
      backgroundGradient: "linear-gradient(180deg, #FDFCFA 0%, #F5F8FB 50%, #EEF4F9 100%)",
      text: "#2C3E50", // Dark navy
      textMuted: "#6B8299", // Muted blue-gray
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lora",
      accent: "Dancing Script",
    },
    dividerStyle: "shell",
  },
  {
    id: "2",
    slug: "la-dolce-vita",
    name: "La Dolce Vita",
    nameEn: "La Dolce Vita",
    description:
      "Mediterraans en zonnig design met citrus accenten en warme crème tinten. Perfect voor een Italiaanse, zomerse bruiloft.",
    descriptionEn:
      "Mediterranean and sunny design with citrus accents and warm cream tones. Perfect for an Italian-inspired, summery wedding.",
    style: "mediterranean",
    sealColor: "#B0AEB0", // Parelsteen
    colors: {
      primary: "#1B3A5F", // Navy blue
      secondary: "#E8A735", // Golden orange
      accent: "#FFF8E7", // Warm cream
      background: "#FFFCF5", // Off-white base
      backgroundGradient: "linear-gradient(180deg, #FFFCF5 0%, #FFF8E7 50%, #FFF3D6 100%)",
      text: "#1B3A5F", // Navy blue
      textMuted: "#5F7896", // Muted blue-gray
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lora",
      accent: "Dancing Script",
    },
    dividerStyle: "citrus",
  },
  {
    id: "3",
    slug: "bloementuin",
    name: "Bloementuin",
    nameEn: "Flower Garden",
    description:
      "Romantische bloementuin met aquarel-wildbloemillustraties en zachte botanische tinten. Perfect voor een tuinfeest of natuurlijke bruiloft.",
    descriptionEn:
      "Romantic flower garden with watercolor wildflower illustrations and soft botanical tones. Perfect for a garden party or natural wedding.",
    style: "botanical",
    sealColor: "#5C7C5C", // Sage green
    colors: {
      primary: "#6B8F6B", // Soft garden green
      secondary: "#D4A0A0", // Blush pink
      accent: "#F0EBE3", // Warm ivory
      background: "#FDFBF7", // Ivory
      backgroundGradient: "linear-gradient(180deg, #FDFBF7 0%, #F8F4EC 50%, #F0EBE3 100%)",
      text: "#3D3D3D", // Dark charcoal
      textMuted: "#7A7A6E", // Warm gray
    },
    fonts: {
      heading: "Libre Baskerville",
      body: "Libre Baskerville",
      accent: "Amatic SC",
    },
    dividerStyle: "botanical",
  },
  {
    id: "4",
    slug: "minimalist",
    name: "Minimalist",
    nameEn: "Minimalist",
    description:
      "Puur en elegant ontwerp met grote serif namen op een strak wit canvas. Geen decoraties, alleen typografie. Perfect voor een moderne, minimalistische bruiloft.",
    descriptionEn:
      "Pure and elegant design with large serif names on a clean white canvas. No decorations, just typography. Perfect for a modern, minimalist wedding.",
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

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

// Helper to get template colors with fallback
export function getTemplateColors(templateId: string | null) {
  const template = templateId ? getTemplateById(templateId) : null;
  return template?.colors || templates[0].colors;
}

// Helper to get template fonts with fallback
export function getTemplateFonts(templateId: string | null) {
  const template = templateId ? getTemplateById(templateId) : null;
  return template?.fonts || templates[0].fonts;
}
