"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { stdTemplates, getStdTemplateById } from "@/lib/std-templates";
import { type Template } from "@/lib/templates";
import { useStdBuilderStore } from "@/stores/std-builder-store";
import { cn } from "@/lib/utils";

const stdCardStyles: Record<
  string,
  {
    bgImage: string | null;
    bgGradient: string;
    textColor: string;
    namePreview: React.ReactNode;
    bottomGradient: string;
  }
> = {
  "std-watercolor-villa": {
    bgImage: "/images/std/watercolor-villa/hero.png",
    bgGradient: "#FDFCFA",
    textColor: "text-[#2C3E50]",
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
        <span className="text-xs mt-2 tracking-widest uppercase text-[#6B8299]">Save the Date</span>
      </div>
    ),
    bottomGradient: "linear-gradient(to top, rgba(253,252,250,0.85) 0%, rgba(253,252,250,0.4) 35%, transparent 70%)",
  },
  "std-limoncello": {
    bgImage: "/images/std/limoncello/hero.png",
    bgGradient: "#4d583f",
    textColor: "text-[#F5F0E0]",
    namePreview: (
      <div className="flex flex-col items-center text-[#F5F0E0]">
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-sm sm:text-lg uppercase">
          Jarno
        </span>
        <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-xl sm:text-3xl -my-1 sm:-my-2">
          &amp;
        </span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-sm sm:text-lg uppercase">
          Bryonie
        </span>
        <span className="text-xs mt-2 tracking-widest uppercase text-[#B8C4A8]">Save the Date</span>
      </div>
    ),
    bottomGradient: "linear-gradient(to top, rgba(77,88,63,0.9) 0%, rgba(77,88,63,0.45) 35%, transparent 70%)",
  },
  "std-minimalist": {
    bgImage: null,
    bgGradient: "linear-gradient(160deg, #FFFFFF 0%, #FAFAFA 40%, #F5F5F5 100%)",
    textColor: "text-[#2C2C2C]",
    namePreview: (
      <div className="flex flex-col items-center text-[#2C2C2C]">
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }} className="text-sm sm:text-lg uppercase">
          Ian
        </span>
        <span style={{ fontFamily: "'Lavishly Yours', cursive" }} className="text-xl sm:text-3xl -my-0.5">
          &amp;
        </span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }} className="text-sm sm:text-lg uppercase">
          Indy
        </span>
        <span className="text-xs mt-2 tracking-widest uppercase text-[#999]">Save the Date</span>
      </div>
    ),
    bottomGradient: "linear-gradient(to top, rgba(120,120,120,0.7) 0%, rgba(150,150,150,0.3) 40%, transparent 100%)",
  },
};

function StdTemplateCard({
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
  const style = stdCardStyles[template.slug] || stdCardStyles["std-minimalist"];

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
        {/* Background hero image */}
        {style.bgImage && (
          <Image
            src={style.bgImage}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        )}

        {/* Names preview */}
        <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
          {style.namePreview}
        </div>

        {/* Bottom gradient */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ background: style.bottomGradient }}
        />

        {/* Bottom label */}
        <div className="relative z-[3] flex flex-col justify-end h-full p-4 sm:p-5">
          <h3 className={`font-heading text-base sm:text-lg font-semibold leading-tight ${style.textColor}`}>
            {template.name}
          </h3>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 z-[4] bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center rounded-2xl pointer-events-none">
          <Link
            href={`/demo-std/${template.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto flex items-center gap-2 text-white font-medium text-sm bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full hover:bg-white/30"
          >
            Bekijk demo
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Selected checkmark */}
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

      <div className="px-1">
        <p className="font-heading font-semibold text-sm text-stone-900 leading-tight">
          {template.name}
        </p>
        <p className="text-xs text-stone-500 capitalize mt-0.5">{template.style}</p>
      </div>
    </motion.div>
  );
}

function StdTemplateSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { templateId, setTemplateId, setStyling, setCurrentStep } = useStdBuilderStore();

  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected) {
      const template = stdTemplates.find((t) => t.slug === selected);
      if (template) {
        setTemplateId(template.id);
        setStyling({ sealColor: template.sealColor });
      }
    }
    setCurrentStep(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setTemplateId, setCurrentStep]);

  const handleSelect = (id: string) => {
    setTemplateId(id);
    const template = getStdTemplateById(id);
    if (template) {
      setStyling({ sealColor: template.sealColor });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Kies een template
        </h1>
        <p className="mt-2 text-stone-600">
          Selecteer een stijl voor jullie Save the Date
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto">
        {stdTemplates.map((template, index) => (
          <StdTemplateCard
            key={template.id}
            template={template}
            index={index}
            isSelected={templateId === template.id}
            onSelect={() => handleSelect(template.id)}
          />
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t border-stone-200">
        <Button
          onClick={() => templateId && router.push("/std-builder/details")}
          disabled={!templateId}
          className="min-w-[140px]"
        >
          Volgende
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default function StdTemplateSelectionPage() {
  return (
    <Suspense fallback={<StdTemplateLoading />}>
      <StdTemplateSelectionContent />
    </Suspense>
  );
}

function StdTemplateLoading() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="h-10 w-64 bg-stone-200 rounded animate-pulse mx-auto" />
        <div className="h-5 w-48 bg-stone-100 rounded animate-pulse mx-auto mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] bg-stone-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
