"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WaxSeal, DEFAULT_SEAL_COLOR } from "@/components/wax-seal/wax-seal";

const templates: Array<{
  id: string;
  nameKey: string;
  sealColor: string; // Hex color
  colors: {
    bg: string;
    accent: string;
  };
}> = [
  {
    id: "eeuwige-elegantie",
    nameKey: "elegance",
    sealColor: "#9E1F3F", // Bordeaux
    colors: {
      bg: "from-[#FFFFF0] to-[#FFF8E7]",
      accent: "#D4AF37",
    },
  },
  {
    id: "modern-minimaal",
    nameKey: "modern",
    sealColor: "#F2E6D6", // Champagne
    colors: {
      bg: "from-white to-[#F5F5F4]",
      accent: "#9CAF88",
    },
  },
  {
    id: "botanische-droom",
    nameKey: "botanical",
    sealColor: "#3E5C76", // Dusty Blue
    colors: {
      bg: "from-[#FFF8E7] to-[#F5F0E6]",
      accent: "#84A98C",
    },
  },
];

const templateNames = {
  elegance: { nl: "Eeuwige Elegantie", en: "Eternal Elegance" },
  modern: { nl: "Modern Minimaal", en: "Modern Minimal" },
  botanical: { nl: "Botanische Droom", en: "Botanical Dream" },
};

export function TemplatesPreviewSection() {
  const t = useTranslations("templates");
  const tCta = useTranslations("cta");

  return (
    <section className="section-padding bg-stone-50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-stone-600">{t("subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/demo/${template.id}`} className="block group">
                <Card className="overflow-hidden hover:-translate-y-2 transition-all duration-300">
                  <div
                    className={`aspect-[3/4] bg-gradient-to-br ${template.colors.bg} relative flex items-center justify-center p-8`}
                  >
                    {/* Template preview */}
                    <div className="w-full h-full bg-white/80 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
                      <WaxSeal
                        initials="J&M"
                        color={template.sealColor}
                        size="lg"
                        interactive={false}
                      />
                      <div className="mt-6 text-center">
                        <p
                          className="font-accent text-xl"
                          style={{ color: template.sealColor }}
                        >
                          Jullie initialen hier
                        </p>
                        <p className="text-stone-400 text-sm mt-2">
                          15 juni 2025
                        </p>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-burgundy-900/0 group-hover:bg-burgundy-900/60 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                        {t("view_demo")}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-heading text-lg font-semibold text-stone-900">
                      {templateNames[template.nameKey as keyof typeof templateNames].nl}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/templates">
              {tCta("templates")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
