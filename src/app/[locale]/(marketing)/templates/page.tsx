"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Sparkles, Lightbulb, Send, CheckCircle, Loader2 } from "lucide-react";
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
    bgGradient: "linear-gradient(160deg, #F0EBE3 0%, #E2DDD2 40%, #D4CFBF 100%)",
    textColor: "text-[#3D3D3D]",
    mutedColor: "text-[#7A7A6E]",
    buttonClass: "bg-[#6B8F6B] text-white hover:bg-[#5A7E5A] border-0",
    badgeClass: "bg-[#6B8F6B]/15 text-[#6B8F6B]",
    bottomGradient: "linear-gradient(to top, rgba(253,251,247,0.97) 0%, rgba(240,235,227,0.8) 40%, transparent 100%)",
    demoNames: { name1: "Matthew", name2: "Evelyn" },
    namePreview: (
      <div className="flex flex-col items-center -translate-y-4 sm:-translate-y-6" style={{ textShadow: "0 1px 8px rgba(255,255,255,0.6)" }}>
        <span style={{ fontFamily: "'Amatic SC', cursive", fontWeight: 700 }} className="text-[#6B8F6B] text-xl sm:text-3xl tracking-widest uppercase">
          Wij gaan trouwen
        </span>
        <span style={{ fontFamily: "'Libre Baskerville', serif" }} className="text-[#3D3D3D] text-base sm:text-lg mt-0.5">
          Matthew &amp; Evelyn
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

export default function TemplatesPage() {
  const t = useTranslations("templates");
  const locale = useLocale();
  const [ideaOpen, setIdeaOpen] = useState(false);

  return (
    <div className="section-padding !pt-8 md:!pt-12 lg:!pt-16">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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

      {/* Idea submission dialog */}
      <IdeaDialog open={ideaOpen} onOpenChange={setIdeaOpen} />
    </div>
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
  const description =
    locale === "en" ? template.descriptionEn : template.description;
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
            <p
              className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${style.mutedColor}`}
            >
              {description}
            </p>
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
