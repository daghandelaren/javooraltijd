"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, Suspense } from "react";
import { ArrowRight, Sparkles, Lightbulb, Send, CheckCircle, Loader2, CalendarHeart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { templates, type Template } from "@/lib/templates";
import { stdTemplates } from "@/lib/std-templates";
import { cn } from "@/lib/utils";

// Card visual config per template
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
    demoNames: { name1: string; name2: string };
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
    demoNames: { name1: "Thomas", name2: "Suzanna" },
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
    demoNames: { name1: "Jarno", name2: "Bryonie" },
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
    demoNames: { name1: "Matthew", name2: "Evelyn" },
    namePreview: (
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-[28%]" style={{ textShadow: "0 1px 10px rgba(255,255,255,0.9)" }}>
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700 }} className="text-[#2C2C2C] text-base sm:text-2xl leading-tight">
          Matthew
        </span>
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400 }} className="text-[#2C2C2C] text-sm sm:text-xl leading-tight">
          &amp;
        </span>
        <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700 }} className="text-[#2C2C2C] text-base sm:text-2xl leading-tight">
          Evelyn
        </span>
        <span style={{ fontFamily: "'Amatic SC', cursive", fontWeight: 400 }} className="text-[#7A7A6A] text-[10px] sm:text-sm tracking-widest uppercase mt-1">
          Wij gaan trouwen!
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
    demoNames: { name1: "Ian", name2: "Indy" },
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

function TemplatesPageContent() {
  const t = useTranslations("templates");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ideaOpen, setIdeaOpen] = useState(false);

  const activeTab = searchParams.get("tab") === "save-the-date" ? "save-the-date" : "invitations";

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "invitations") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.push(`/templates${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="section-padding !pt-8 md:!pt-12 lg:!pt-16">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
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
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-stone-900">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-stone-100 rounded-full p-1">
            <button
              onClick={() => setTab("invitations")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                activeTab === "invitations"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              <Mail className="w-4 h-4" />
              Uitnodigingen
            </button>
            <button
              onClick={() => setTab("save-the-date")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                activeTab === "save-the-date"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              <CalendarHeart className="w-4 h-4" />
              Save the Date
            </button>
          </div>
        </div>

        {activeTab === "invitations" ? (
          <>
            {/* Templates grid — 2 col mobile, 4 col desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {templates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  locale={locale}
                  index={index}
                  viewDemoLabel={t("view_demo")}
                />
              ))}

              {/* Coming Soon card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: templates.length * 0.1 }}
              >
                <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-stone-400" />
                  </div>
                  <p className="font-heading font-semibold text-stone-400 text-sm sm:text-base">
                    {t("coming_soon")}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 hidden sm:block">
                    {t("coming_soon_sub")}
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          /* Save the Date grid — 2 col mobile, 3 col desktop */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {stdTemplates.map((template, index) => (
              <StdTemplateCard
                key={template.id}
                template={template}
                locale={locale}
                index={index}
              />
            ))}
          </div>
        )}

        {/* "Can't find your style?" section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl bg-stone-50 border border-stone-100">
            <Lightbulb className="w-6 h-6 text-stone-400" />
            <p className="font-heading text-lg font-semibold text-stone-800">
              {t("cant_find.title")}
            </p>
            <p className="text-sm text-stone-500 max-w-md">
              {t("cant_find.description")}
            </p>
            <Button
              variant="outline"
              onClick={() => setIdeaOpen(true)}
              className="mt-2"
            >
              {t("cant_find.cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      <IdeaDialog open={ideaOpen} onOpenChange={setIdeaOpen} />
    </div>
  );
}

// STD template card styles
const stdCardStyles: Record<string, { bgGradient: string; textColor: string; namePreview: React.ReactNode; bottomGradient: string; decoration: React.ReactNode }> = {
  "std-watercolor-villa": {
    bgGradient: "linear-gradient(160deg, #EEF4F9 0%, #D4E4F0 40%, #B8D4E8 100%)",
    textColor: "text-[#2C3E50]",
    namePreview: (
      <div className="flex flex-col items-center text-[#2C3E50]">
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-sm sm:text-lg uppercase">Thomas</span>
        <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-xl sm:text-3xl -my-1">&amp;</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-sm sm:text-lg uppercase">Suzanna</span>
        <span className="text-[10px] sm:text-xs mt-2 tracking-widest uppercase text-[#6B8299]">Save the Date</span>
      </div>
    ),
    bottomGradient: "linear-gradient(to top, rgba(184,212,232,0.9) 0%, rgba(212,228,240,0.5) 35%, transparent 70%)",
    decoration: (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="std-wv-wc"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="8" /></filter>
        </defs>
        <g filter="url(#std-wv-wc)" opacity="0.5">
          <ellipse cx="40" cy="50" rx="35" ry="28" fill="#D4A0A0" opacity="0.3" />
          <ellipse cx="260" cy="40" rx="30" ry="24" fill="#D4A0A0" opacity="0.25" />
          <ellipse cx="20" cy="35" rx="22" ry="7" fill="#A8C0A0" opacity="0.3" transform="rotate(-20,20,35)" />
          <ellipse cx="280" cy="60" rx="20" ry="6" fill="#A8C0A0" opacity="0.3" transform="rotate(15,280,60)" />
          <ellipse cx="30" cy="360" rx="28" ry="22" fill="#6B9CC3" opacity="0.2" />
          <ellipse cx="270" cy="370" rx="25" ry="20" fill="#D4A0A0" opacity="0.2" />
          <ellipse cx="15" cy="340" rx="18" ry="6" fill="#A8C0A0" opacity="0.25" transform="rotate(-30,15,340)" />
          <ellipse cx="285" cy="350" rx="16" ry="5" fill="#A8C0A0" opacity="0.25" transform="rotate(25,285,350)" />
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
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-sm sm:text-lg uppercase">Jarno</span>
        <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-xl sm:text-3xl -my-1">&amp;</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-sm sm:text-lg uppercase">Bryonie</span>
        <span className="text-[10px] sm:text-xs mt-2 tracking-widest uppercase text-[#B8C4A8]">Save the Date</span>
      </div>
    ),
    bottomGradient: "linear-gradient(to top, rgba(26,46,26,0.9) 0%, rgba(36,53,36,0.5) 35%, transparent 70%)",
    decoration: (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="std-lc-wc"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="6" /></filter>
          <radialGradient id="std-lc-lm" cx="45%" cy="40%" r="50%"><stop offset="0%" stopColor="#F5D55A" stopOpacity="0.5" /><stop offset="100%" stopColor="#D4A820" stopOpacity="0.1" /></radialGradient>
        </defs>
        <g filter="url(#std-lc-wc)" opacity="0.6">
          <ellipse cx="35" cy="45" rx="20" ry="15" fill="url(#std-lc-lm)" transform="rotate(-15,35,45)" />
          <ellipse cx="265" cy="35" rx="18" ry="13" fill="url(#std-lc-lm)" transform="rotate(20,265,35)" />
          <ellipse cx="55" cy="30" rx="18" ry="5" fill="#6B8B5E" opacity="0.4" transform="rotate(-25,55,30)" />
          <ellipse cx="245" cy="55" rx="16" ry="5" fill="#6B8B5E" opacity="0.4" transform="rotate(15,245,55)" />
          <ellipse cx="30" cy="365" rx="16" ry="12" fill="url(#std-lc-lm)" transform="rotate(10,30,365)" />
          <ellipse cx="270" cy="355" rx="15" ry="11" fill="url(#std-lc-lm)" transform="rotate(-15,270,355)" />
          <ellipse cx="50" cy="350" rx="15" ry="4" fill="#6B8B5E" opacity="0.35" transform="rotate(-20,50,350)" />
          <ellipse cx="250" cy="375" rx="14" ry="4" fill="#6B8B5E" opacity="0.35" transform="rotate(20,250,375)" />
        </g>
      </svg>
    ),
  },
  "std-minimalist": {
    bgGradient: "linear-gradient(160deg, #FFFFFF 0%, #FAFAFA 40%, #F5F5F5 100%)",
    textColor: "text-[#2C2C2C]",
    namePreview: (
      <div className="flex flex-col items-center text-[#2C2C2C]">
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }} className="text-sm sm:text-lg uppercase">Ian</span>
        <span style={{ fontFamily: "'Lavishly Yours', cursive" }} className="text-xl sm:text-3xl -my-0.5">&amp;</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }} className="text-sm sm:text-lg uppercase">Indy</span>
        <span className="text-[10px] sm:text-xs mt-2 tracking-widest uppercase text-[#999]">Save the Date</span>
      </div>
    ),
    bottomGradient: "linear-gradient(to top, rgba(120,120,120,0.7) 0%, rgba(150,150,150,0.3) 40%, transparent 100%)",
    decoration: null,
  },
};

function StdTemplateCard({
  template,
  locale,
  index,
}: {
  template: Template;
  locale: string;
  index: number;
}) {
  const name = locale === "en" ? template.nameEn : template.name;
  const style = stdCardStyles[template.slug] || stdCardStyles["std-minimalist"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="group aspect-[3/4] rounded-2xl overflow-hidden relative shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        style={{ background: style.bgGradient }}
      >
        {/* Layer 0 — SVG decoration */}
        {style.decoration && (
          <div className="absolute inset-0 pointer-events-none">
            {style.decoration}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
          {style.namePreview}
        </div>

        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ background: style.bottomGradient }}
        />

        <div className="relative z-[3] flex flex-col justify-between h-full p-5 sm:p-6">
          <div>
            <span className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-olive-100 text-olive-700">
              Vanaf &euro;75
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            <h3 className={`font-heading text-lg sm:text-xl font-semibold leading-tight ${style.textColor}`}>
              {name}
            </h3>
            <Button
              asChild
              size="sm"
              className="w-full mt-1 sm:mt-2 rounded-lg text-xs sm:text-sm bg-olive-600 text-white hover:bg-olive-700 border-0"
            >
              <Link href={`/demo-std/${template.slug}`}>
                Bekijk demo
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <TemplatesPageContent />
    </Suspense>
  );
}

function TemplateCard({
  template,
  locale,
  index,
  viewDemoLabel,
}: {
  template: Template;
  locale: string;
  index: number;
  viewDemoLabel: string;
}) {
  const name = locale === "en" ? template.nameEn : template.name;
  const style = cardStyles[template.slug] || cardStyles.minimalist;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="group aspect-[3/4] rounded-2xl overflow-hidden relative shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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

        {/* Layer 4 — Card content */}
        <div className="relative z-[3] flex flex-col justify-between h-full p-5 sm:p-6">
          {/* Number badge */}
          <div>
            <span
              className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full ${style.badgeClass}`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Bottom content */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <h3
              className={`font-heading text-lg sm:text-xl font-semibold leading-tight ${style.textColor}`}
            >
              {name}
            </h3>
            <Button
              asChild
              size="sm"
              className={`w-full mt-1 sm:mt-2 rounded-lg text-xs sm:text-sm ${style.buttonClass}`}
            >
              <Link href={`/demo/${template.slug}`}>
                {viewDemoLabel}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function IdeaDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("templates.idea_form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: "Template idee",
          message,
        }),
      });

      if (!response.ok) throw new Error("Failed to send");

      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Reset form on close
      setTimeout(() => {
        setIsSuccess(false);
        setError(null);
      }, 200);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <p className="font-heading text-lg font-semibold text-stone-900 mb-1">
              {t("success_title")}
            </p>
            <p className="text-sm text-stone-500">{t("success_message")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea-name">{t("name")}</Label>
              <Input
                id="idea-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("name_placeholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-email">{t("email")}</Label>
              <Input
                id="idea-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email_placeholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-message">{t("message")}</Label>
              <textarea
                id="idea-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("message_placeholder")}
                required
                rows={4}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-500 focus-visible:border-champagne-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t("submit")}
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
