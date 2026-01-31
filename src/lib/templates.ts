import { DEFAULT_SEAL_COLOR } from "@/lib/wax-colors";

export interface Template {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  style: "romantic" | "modern" | "minimal";
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
}

export const templates: Template[] = [
  {
    id: "1",
    slug: "eeuwige-elegantie",
    name: "Eeuwige Elegantie",
    nameEn: "Eternal Elegance",
    description:
      "Klassiek romantisch design met gouden accenten. Perfect voor traditionele bruiloften in kastelen of landhuizen.",
    descriptionEn:
      "Classic romantic design with golden accents. Perfect for traditional weddings in castles or country estates.",
    style: "romantic",
    sealColor: DEFAULT_SEAL_COLOR, // Bordeaux red
    colors: {
      primary: "#722F37",
      secondary: "#D4AF37",
      accent: "#8B8589",
      background: "#FFFFF0",
      backgroundGradient: "linear-gradient(135deg, #FFFFF0 0%, #FFF8E7 100%)",
      text: "#1C1917",
      textMuted: "#57534E",
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "EB Garamond",
      accent: "Great Vibes",
    },
  },
  {
    id: "2",
    slug: "modern-minimaal",
    name: "Modern Minimaal",
    nameEn: "Modern Minimal",
    description:
      "Strak en contemporary design met clean lijnen. Ideaal voor design-minded koppels en stedelijke locaties.",
    descriptionEn:
      "Sleek and contemporary design with clean lines. Ideal for design-minded couples and urban venues.",
    style: "modern",
    sealColor: "#2F4F4F", // Slate
    colors: {
      primary: "#1A1A1A",
      secondary: "#9CAF88",
      accent: "#FFE4E1",
      background: "#FFFFFF",
      backgroundGradient: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F4 100%)",
      text: "#1A1A1A",
      textMuted: "#78716C",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      accent: "Inter",
    },
  },
  {
    id: "3",
    slug: "botanische-droom",
    name: "Botanische Droom",
    nameEn: "Botanical Dream",
    description:
      "Organisch en natuurlijk design met botanische elementen. Perfect voor tuinfeesten en vineyard weddings.",
    descriptionEn:
      "Organic and natural design with botanical elements. Perfect for garden parties and vineyard weddings.",
    style: "romantic",
    sealColor: "#5C4033", // Chocolate
    colors: {
      primary: "#C67B5C",
      secondary: "#84A98C",
      accent: "#D4A5A5",
      background: "#FFF8E7",
      backgroundGradient: "linear-gradient(135deg, #FFF8E7 0%, #F5F0E6 100%)",
      text: "#292524",
      textMuted: "#57534E",
    },
    fonts: {
      heading: "Libre Baskerville",
      body: "Lora",
      accent: "Tangerine",
    },
  },
];

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
