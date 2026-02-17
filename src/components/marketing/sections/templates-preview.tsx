"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Per-card config with dedicated label colors and frosted name panels
const templateCards: Array<{
  slug: string;
  nameNl: string;
  nameEn: string;
  bgImage: string | null;
  bgGradient: string;
  bottomGradient: string;
  labelColor: string;
  labelMuted: string;
  namePreview: React.ReactNode;
}> = [
  {
    slug: "riviera",
    nameNl: "Riviera",
    nameEn: "Riviera",
    bgImage: "/images/riviera/hero-tiles.png",
    bgGradient: "linear-gradient(160deg, #6B9CC3 0%, #4A7FA8 40%, #3A6F98 100%)",
    bottomGradient: "linear-gradient(to top, rgba(58,111,152,0.9) 0%, rgba(58,111,152,0.5) 35%, transparent 70%)",
    labelColor: "text-white",
    labelMuted: "text-white/60",
    namePreview: (
      <div className="flex flex-col items-center px-5 py-3 sm:px-7 sm:py-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
        <span
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.18em" }}
          className="text-sm sm:text-lg text-[#2C3E50] uppercase"
        >
          Thomas
        </span>
        <span
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-xl sm:text-3xl text-[#2C3E50] -my-1 sm:-my-1.5"
        >
          &amp;
        </span>
        <span
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.18em" }}
          className="text-sm sm:text-lg text-[#2C3E50] uppercase"
        >
          Suzanna
        </span>
      </div>
    ),
  },
  {
    slug: "la-dolce-vita",
    nameNl: "La Dolce Vita",
    nameEn: "La Dolce Vita",
    bgImage: "/images/ladolcevita/hero-citrus.png",
    bgGradient: "linear-gradient(160deg, #FFFCF5 0%, #FFF3D6 40%, #F5E6B8 100%)",
    bottomGradient: "linear-gradient(to top, rgba(245,230,184,0.95) 0%, rgba(255,243,214,0.75) 40%, transparent 100%)",
    labelColor: "text-[#1B3A5F]",
    labelMuted: "text-[#1B3A5F]/50",
    namePreview: (
      <div className="flex flex-col items-start -translate-y-3 sm:-translate-y-5">
        <span
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.08em" }}
          className="text-lg sm:text-2xl text-[#1B3A5F] uppercase"
        >
          Jarno
        </span>
        <span
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.08em" }}
          className="text-lg sm:text-2xl text-[#1B3A5F] uppercase"
        >
          &amp; Bryonie
        </span>
      </div>
    ),
  },
  {
    slug: "bloementuin",
    nameNl: "Bloementuin",
    nameEn: "Flower Garden",
    bgImage: "/images/bloementuin/hero-garden.png",
    bgGradient: "linear-gradient(160deg, #F0EBE3 0%, #E2DDD2 40%, #D4CFBF 100%)",
    bottomGradient: "linear-gradient(to top, rgba(253,251,247,0.97) 0%, rgba(240,235,227,0.85) 40%, transparent 100%)",
    labelColor: "text-[#3D3D3D]",
    labelMuted: "text-[#3D3D3D]/50",
    namePreview: (
      <div className="flex flex-col items-center -translate-y-3 sm:-translate-y-5" style={{ textShadow: "0 1px 8px rgba(255,255,255,0.6)" }}>
        <span
          style={{ fontFamily: "'Amatic SC', cursive", fontWeight: 700 }}
          className="text-[#6B8F6B] text-xl sm:text-3xl tracking-widest uppercase"
        >
          Wij gaan trouwen
        </span>
        <span
          style={{ fontFamily: "'Libre Baskerville', serif" }}
          className="text-[#3D3D3D] text-base sm:text-lg mt-0.5"
        >
          Matthew &amp; Evelyn
        </span>
      </div>
    ),
  },
  {
    slug: "minimalist",
    nameNl: "Minimalist",
    nameEn: "Minimalist",
    bgImage: null,
    bgGradient: "linear-gradient(160deg, #FFFFFF 0%, #FAFAFA 40%, #F5F5F5 100%)",
    bottomGradient: "linear-gradient(to top, rgba(120,120,120,0.8) 0%, rgba(150,150,150,0.35) 40%, transparent 100%)",
    labelColor: "text-white",
    labelMuted: "text-white/60",
    namePreview: (
      <div className="flex flex-col items-center -translate-y-3 sm:-translate-y-5 text-[#2C2C2C]">
        <span
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }}
          className="text-lg sm:text-2xl uppercase"
        >
          Ian
        </span>
        <span
          style={{ fontFamily: "'Lavishly Yours', cursive" }}
          className="text-2xl sm:text-4xl -my-0.5"
        >
          &amp;
        </span>
        <span
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }}
          className="text-lg sm:text-2xl uppercase"
        >
          Indy
        </span>
      </div>
    ),
  },
];

export function TemplatesPreviewSection() {
  const t = useTranslations("templates");
  const tCta = useTranslations("cta");
  const locale = useLocale();

  return (
    <section className="section-padding bg-stone-50 overflow-hidden">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
            <span className="h-px w-8 sm:w-12 bg-stone-300" />
            <span
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-base sm:text-lg text-stone-400 tracking-wide"
            >
              {locale === "en" ? "curated collection" : "onze collectie"}
            </span>
            <span className="h-px w-8 sm:w-12 bg-stone-300" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-stone-600 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {templateCards.map((card, index) => (
            <motion.div
              key={card.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/demo/${card.slug}`} className="block group">
                <div
                  className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300"
                  style={{ background: card.bgGradient }}
                >
                  {/* Layer 1 — Background hero image */}
                  {card.bgImage && (
                    <Image
                      src={card.bgImage}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}

                  {/* Layer 2 — Styled names with frosted panel */}
                  <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
                    {card.namePreview}
                  </div>

                  {/* Layer 3 — Bottom gradient overlay */}
                  <div
                    className="absolute inset-0 z-[2] pointer-events-none"
                    style={{ background: card.bottomGradient }}
                  />

                  {/* Layer 4 — Bottom label */}
                  <div className="relative z-[3] flex flex-col justify-end h-full p-4 sm:p-5">
                    <div>
                      <h3 className={`font-heading text-base sm:text-lg font-semibold leading-tight ${card.labelColor}`}>
                        {locale === "en" ? card.nameEn : card.nameNl}
                      </h3>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 z-[4] bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center rounded-2xl">
                    <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                      {t("view_demo")}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 text-center"
        >
          <Button asChild size="lg" className="rounded-full px-8">
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
