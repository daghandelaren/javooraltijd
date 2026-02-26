"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { templates, getTemplateById, type Template } from "@/lib/templates";
import { useBuilderStore } from "@/stores/builder-store";
import { useBuilderGuard } from "@/hooks/use-builder-guard";
import { cn } from "@/lib/utils";

// Card visual config per template — matches marketing templates page
const cardStyles: Record<
  string,
  {
    bgImage: string | null;
    bgGradient: string;
    textColor: string;
    mutedColor: string;
    buttonClass: string;
    badgeClass: string;
    bottomGradient: string;
    namePreview: React.ReactNode;
  }
> = {
  riviera: {
    bgImage: "/images/riviera/hero-tiles.png",
    bgGradient: "linear-gradient(160deg, #6B9CC3 0%, #4A7FA8 40%, #3A6F98 100%)",
    textColor: "text-white",
    mutedColor: "text-white/75",
    buttonClass: "bg-white text-[#3A6F98] hover:bg-white/90 border-0",
    badgeClass: "bg-white/20 text-white/90",
    bottomGradient: "linear-gradient(to top, rgba(58,111,152,0.85) 0%, rgba(58,111,152,0.45) 35%, transparent 70%)",
    namePreview: (
      <div className="flex flex-col items-center text-[#2C3E50] drop-shadow-[0_1px_3px_rgba(255,255,255,0.5)]">
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-sm sm:text-lg uppercase">
          Thomas
        </span>
        <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-xl sm:text-3xl -my-1 sm:-my-2">
          &amp;
        </span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-sm sm:text-lg uppercase">
          Suzanna
        </span>
      </div>
    ),
  },
  "la-dolce-vita": {
    bgImage: "/images/ladolcevita/hero-citrus.png",
    bgGradient: "linear-gradient(160deg, #FFFCF5 0%, #FFF3D6 40%, #F5E6B8 100%)",
    textColor: "text-[#1B3A5F]",
    mutedColor: "text-[#5F7896]",
    buttonClass: "bg-[#1B3A5F] text-white hover:bg-[#152E4D] border-0",
    badgeClass: "bg-[#1B3A5F]/10 text-[#1B3A5F]/70",
    bottomGradient: "linear-gradient(to top, rgba(245,230,184,0.95) 0%, rgba(255,243,214,0.7) 40%, transparent 100%)",
    namePreview: (
      <div className="flex flex-col items-start text-[#1B3A5F] -translate-y-4 sm:-translate-y-6">
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.08em" }} className="text-lg sm:text-2xl uppercase">
          Jarno
        </span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.08em" }} className="text-lg sm:text-2xl uppercase">
          &amp; Bryonie
        </span>
      </div>
    ),
  },
  bloementuin: {
    bgImage: "/images/bloementuin/hero-garden.png",
    bgGradient: "linear-gradient(160deg, #FDFBF7 0%, #F8F4EC 40%, #F0EBE3 100%)",
    textColor: "text-[#3D3D3D]",
    mutedColor: "text-[#7A7A6E]",
    buttonClass: "bg-[#6B8F6B] text-white hover:bg-[#5A7E5A] border-0",
    badgeClass: "bg-[#6B8F6B]/15 text-[#6B8F6B]",
    bottomGradient: "linear-gradient(to top, rgba(253,251,247,0.75) 0%, rgba(253,251,247,0.3) 45%, transparent 80%)",
    namePreview: (
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-[18%]" style={{ textShadow: "0 1px 10px rgba(255,255,255,0.9)" }}>
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700 }} className="text-[#2C2C2C] text-sm sm:text-lg leading-tight">
          Matthew
        </span>
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }} className="text-[#2C2C2C] text-xs sm:text-base leading-tight">
          &amp;
        </span>
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700 }} className="text-[#2C2C2C] text-sm sm:text-lg leading-tight">
          Evelyn
        </span>
        <span style={{ fontFamily: "'Amatic SC', cursive", fontWeight: 400 }} className="text-[#7A7A6A] text-[9px] sm:text-[11px] tracking-widest uppercase mt-1">
          wij gaan trouwen
        </span>
      </div>
    ),
  },
  minimalist: {
    bgImage: null,
    bgGradient: "linear-gradient(160deg, #FFFFFF 0%, #FAFAFA 40%, #F5F5F5 100%)",
    textColor: "text-white",
    mutedColor: "text-white/70",
    buttonClass: "bg-white text-[#2C2C2C] hover:bg-white/90 border-0",
    badgeClass: "bg-stone-100 text-stone-500",
    bottomGradient: "linear-gradient(to top, rgba(120,120,120,0.8) 0%, rgba(150,150,150,0.35) 40%, transparent 100%)",
    namePreview: (
      <div className="flex flex-col items-center text-[#2C2C2C] -translate-y-4 sm:-translate-y-6">
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }} className="text-lg sm:text-2xl uppercase">
          Ian
        </span>
        <span style={{ fontFamily: "'Lavishly Yours', cursive" }} className="text-2xl sm:text-4xl -my-0.5">
          &amp;
        </span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }} className="text-lg sm:text-2xl uppercase">
          Indy
        </span>
      </div>
    ),
  },
};

function TemplateCard({
  template,
  index,
  isSelected,
  onSelect,
}: {
  template: Template;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations("templates");
  const style = cardStyles[template.slug] || cardStyles.minimalist;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col gap-2"
    >
      <div
        onClick={onSelect}
        className={cn(
          "group aspect-[3/4] rounded-2xl overflow-hidden relative shadow-sm cursor-pointer",
          "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
          isSelected && "ring-4 ring-olive-500 ring-offset-2 shadow-xl"
        )}
        style={{ background: style.bgGradient }}
      >
        {/* Layer 1 — Background hero image */}
        {style.bgImage && (
          <Image
            src={style.bgImage}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Layer 2 — Miniature styled names */}
        <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
          {style.namePreview}
        </div>

        {/* Layer 3 — Bottom gradient overlay */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ background: style.bottomGradient }}
        />

        {/* Layer 4 — Bottom label only */}
        <div className="relative z-[3] flex flex-col justify-end h-full p-4 sm:p-5">
          <h3 className={`font-heading text-base sm:text-lg font-semibold leading-tight ${style.textColor}`}>
            {template.name}
          </h3>
        </div>

        {/* Layer 5 — Hover overlay: "Bekijk demo" */}
        <div className="absolute inset-0 z-[4] bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center rounded-2xl pointer-events-none">
          <Link
            href={`/demo/${template.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto flex items-center gap-2 text-white font-medium text-sm bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full hover:bg-white/30"
          >
            {t("view_demo")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Layer 6 — Selected checkmark */}
        {isSelected && (
          <div className="absolute top-3 right-3 z-[5]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-7 h-7 bg-olive-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Label below card */}
      <div className="px-1">
        <p className="font-heading font-semibold text-sm text-stone-900 leading-tight">
          {template.name}
        </p>
        <p className="text-xs text-stone-500 capitalize mt-0.5">{template.style}</p>
      </div>
    </motion.div>
  );
}

function TemplateSelectionContent() {
  const t = useTranslations("templates");
  const tCta = useTranslations("cta");
  const router = useRouter();
  const searchParams = useSearchParams();

  useBuilderGuard(1);

  const { templateId, setTemplateId, setStyling, setCurrentStep } = useBuilderStore();

  const fontPairingMap: Record<string, "romantic" | "modern" | "elegant"> = {
    bloementuin: "romantic",
    riviera: "modern",
    "la-dolce-vita": "modern",
    minimalist: "elegant",
  };

  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected) {
      const template = templates.find((t) => t.slug === selected);
      if (template) {
        setTemplateId(template.id);
        setStyling({
          sealColor: template.sealColor,
          fontPairing: fontPairingMap[template.slug] ?? "elegant",
        });
      }
    }
    setCurrentStep(2);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setTemplateId, setCurrentStep]);

  const handleSelect = (id: string) => {
    setTemplateId(id);
    const template = getTemplateById(id);
    if (template) {
      setStyling({
        sealColor: template.sealColor,
        fontPairing: fontPairingMap[template.slug] ?? "elegant",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          {t("title")}
        </h1>
        <p className="mt-2 text-stone-600">{t("subtitle")}</p>
      </div>

      {/* Template Grid — 2 cols mobile, 4 cols lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            index={index}
            isSelected={templateId === template.id}
            onSelect={() => handleSelect(template.id)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={() => router.push("/builder/package")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCta("back")}
        </Button>
        <Button
          onClick={() => templateId && router.push("/builder/details")}
          disabled={!templateId}
          className="min-w-[140px]"
        >
          {tCta("next")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default function TemplateSelectionPage() {
  return (
    <Suspense fallback={<TemplateSelectionLoading />}>
      <TemplateSelectionContent />
    </Suspense>
  );
}

function TemplateSelectionLoading() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="h-10 w-64 bg-stone-200 rounded animate-pulse mx-auto" />
        <div className="h-5 w-48 bg-stone-100 rounded animate-pulse mx-auto mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[3/4] bg-stone-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
