"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { stdTemplates, getStdTemplateById } from "@/lib/std-templates";
import { type Template } from "@/lib/templates";
import { useStdBuilderStore } from "@/stores/std-builder-store";
import { cn } from "@/lib/utils";

const stdCardStyles: Record<
  string,
  {
    bgGradient: string;
    textColor: string;
    namePreview: React.ReactNode;
    bottomGradient: string;
    decoration: React.ReactNode;
  }
> = {
  "std-watercolor-villa": {
    bgGradient: "linear-gradient(160deg, #EEF4F9 0%, #D4E4F0 40%, #B8D4E8 100%)",
    textColor: "text-[#2C3E50]",
    namePreview: (
      <div className="flex flex-col items-center text-[#2C3E50]">
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
    bottomGradient: "linear-gradient(to top, rgba(184,212,232,0.9) 0%, rgba(212,228,240,0.5) 35%, transparent 70%)",
    decoration: (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="bld-wv-wc"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="8" /></filter></defs>
        <g filter="url(#bld-wv-wc)" opacity="0.5">
          <ellipse cx="40" cy="50" rx="35" ry="28" fill="#D4A0A0" opacity="0.3" />
          <ellipse cx="260" cy="40" rx="30" ry="24" fill="#D4A0A0" opacity="0.25" />
          <ellipse cx="20" cy="35" rx="22" ry="7" fill="#A8C0A0" opacity="0.3" transform="rotate(-20,20,35)" />
          <ellipse cx="280" cy="60" rx="20" ry="6" fill="#A8C0A0" opacity="0.3" transform="rotate(15,280,60)" />
          <ellipse cx="30" cy="360" rx="28" ry="22" fill="#6B9CC3" opacity="0.2" />
          <ellipse cx="270" cy="370" rx="25" ry="20" fill="#D4A0A0" opacity="0.2" />
        </g>
        <path d="M 60 400 L 60 160 Q 60 60 150 60 Q 240 60 240 160 L 240 400" fill="none" stroke="#B8D4E8" strokeWidth="0.8" opacity="0.3" />
      </svg>
    ),
  },
  "std-limoncello": {
    bgGradient: "linear-gradient(160deg, #1A2E1A 0%, #243524 40%, #1A2E1A 100%)",
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
    bottomGradient: "linear-gradient(to top, rgba(26,46,26,0.9) 0%, rgba(36,53,36,0.5) 35%, transparent 70%)",
    decoration: (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="bld-lc-wc"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="6" /></filter>
          <radialGradient id="bld-lc-lm" cx="45%" cy="40%" r="50%"><stop offset="0%" stopColor="#F5D55A" stopOpacity="0.5" /><stop offset="100%" stopColor="#D4A820" stopOpacity="0.1" /></radialGradient>
        </defs>
        <g filter="url(#bld-lc-wc)" opacity="0.6">
          <ellipse cx="35" cy="45" rx="20" ry="15" fill="url(#bld-lc-lm)" transform="rotate(-15,35,45)" />
          <ellipse cx="265" cy="35" rx="18" ry="13" fill="url(#bld-lc-lm)" transform="rotate(20,265,35)" />
          <ellipse cx="55" cy="30" rx="18" ry="5" fill="#6B8B5E" opacity="0.4" transform="rotate(-25,55,30)" />
          <ellipse cx="245" cy="55" rx="16" ry="5" fill="#6B8B5E" opacity="0.4" transform="rotate(15,245,55)" />
          <ellipse cx="30" cy="365" rx="16" ry="12" fill="url(#bld-lc-lm)" transform="rotate(10,30,365)" />
          <ellipse cx="270" cy="355" rx="15" ry="11" fill="url(#bld-lc-lm)" transform="rotate(-15,270,355)" />
        </g>
      </svg>
    ),
  },
  "std-minimalist": {
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
    decoration: null,
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
        {/* SVG decoration */}
        {style.decoration && (
          <div className="absolute inset-0 pointer-events-none">
            {style.decoration}
          </div>
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
