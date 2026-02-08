import { DEFAULT_SEAL_COLOR } from "@/lib/wax-colors";

export interface Template {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  style: "romantic" | "modern" | "rustic";
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
  dividerStyle: "floral" | "geometric" | "botanical";
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
    slug: "modern",
    name: "Modern",
    nameEn: "Modern",
    description:
      "Strak en minimalistisch design met clean lijnen en gouden accenten. Ideaal voor een moderne, verfijnde bruiloft.",
    descriptionEn:
      "Clean and minimalist design with sleek lines and golden accents. Ideal for a modern, sophisticated wedding.",
    style: "modern",
    sealColor: "#2C3E50", // Slate/navy
    colors: {
      primary: "#1A1A1A", // Near black
      secondary: "#C9A86C", // Warm gold
      accent: "#F5F5F5", // Light gray
      background: "#FFFFFF", // Pure white
      backgroundGradient: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 50%, #F5F5F5 100%)",
      text: "#1A1A1A", // Near black
      textMuted: "#6B6B6B", // Medium gray
    },
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      accent: "Inter",
    },
    dividerStyle: "geometric",
  },
  {
    id: "3",
    slug: "rustiek",
    name: "Rustiek",
    nameEn: "Rustic",
    description:
      "Natuurlijk en warm design met aardse tinten en organische elementen. Perfect voor een boerderij- of buitenbruiloft.",
    descriptionEn:
      "Natural and warm design with earthy tones and organic elements. Perfect for a farm or outdoor wedding.",
    style: "rustic",
    sealColor: "#5C4033", // Warm brown
    colors: {
      primary: "#5C7C5C", // Sage green
      secondary: "#C67B5C", // Terracotta
      accent: "#E8DDD0", // Kraft/natural paper
      background: "#F9F6F1", // Warm off-white
      backgroundGradient: "linear-gradient(180deg, #F9F6F1 0%, #F5F0E6 50%, #EDE5D8 100%)",
      text: "#3D3D3D", // Dark charcoal
      textMuted: "#6B6B6B", // Medium gray
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
