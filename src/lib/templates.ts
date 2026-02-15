import { DEFAULT_SEAL_COLOR } from "@/lib/wax-colors";

export interface Template {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  style: "romantic" | "modern" | "botanical" | "mediterranean";
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
  dividerStyle: "floral" | "geometric" | "botanical" | "citrus";
}

export const templates: Template[] = [
  {
    id: "1",
    slug: "romantisch",
    name: "Romantisch",
    nameEn: "Romantic",
    description:
      "Zacht en elegant design met blush tinten en rose goud accenten. Perfect voor een dromerige, romantische bruiloft.",
    descriptionEn:
      "Soft and elegant design with blush tones and rose gold accents. Perfect for a dreamy, romantic wedding.",
    style: "romantic",
    sealColor: DEFAULT_SEAL_COLOR, // Olijfgaard
    colors: {
      primary: "#9AAB8C", // Sage olive
      secondary: "#D4AF37", // Champagne gold
      accent: "#F8E8E8", // Soft blush
      background: "#FDF8F6", // Warm cream
      backgroundGradient: "linear-gradient(180deg, #FDF8F6 0%, #F9F0ED 50%, #F5E6E0 100%)",
      text: "#4A3C3C", // Warm dark brown
      textMuted: "#8B7B7B", // Muted mauve
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Cormorant Garamond",
      accent: "Great Vibes",
    },
    dividerStyle: "floral",
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
    sealColor: "#1B3A5F", // Navy
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
