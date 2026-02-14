"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import { useBuilderStore } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

function TemplateSelectionContent() {
  const t = useTranslations("templates");
  const tBuilder = useTranslations("builder");
  const tCta = useTranslations("cta");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { templateId, setTemplateId, setCurrentStep } = useBuilderStore();

  // Pre-select template from query param
  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected) {
      const template = templates.find((t) => t.slug === selected);
      if (template) {
        setTemplateId(template.id);
      }
    }
    setCurrentStep(2);
  }, [searchParams, setTemplateId, setCurrentStep]);

  const handleSelect = (id: string) => {
    setTemplateId(id);
  };

  const handleBack = () => {
    router.push("/builder/package");
  };

  const handleNext = () => {
    if (templateId) {
      router.push("/builder/details");
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

      {/* Template Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => {
          const isSelected = templateId === template.id;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                onClick={() => handleSelect(template.id)}
                className={cn(
                  "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
                  "border-2",
                  isSelected
                    ? "border-olive-700 shadow-lg ring-4 ring-olive-100"
                    : "border-stone-200 hover:border-stone-300 hover:shadow-md"
                )}
              >
                {/* Template Preview */}
                <div
                  className="aspect-[3/4] relative"
                  style={{ background: template.colors.backgroundGradient }}
                >
                  {/* Decorative content preview */}
                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center">
                    {/* Wax seal preview */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-heading text-xl shadow-lg mb-4"
                      style={{ backgroundColor: template.sealColor }}
                    >
                      J&J
                    </div>

                    {/* Names preview */}
                    <div
                      className="text-center font-heading text-lg"
                      style={{ color: template.colors.text }}
                    >
                      Partner 1 & Partner 2
                    </div>

                    {/* Date preview */}
                    <div
                      className="text-sm mt-1"
                      style={{ color: template.colors.textMuted }}
                    >
                      15 juni 2025
                    </div>
                  </div>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-8 h-8 bg-olive-700 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  {/* Hover overlay with demo link */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <Link
                      href={`/demo/${template.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 rounded-full text-sm font-medium text-stone-700 hover:bg-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {t("view_demo")}
                    </Link>
                  </div>
                </div>

                {/* Template info */}
                <div className="p-4 bg-white">
                  <h3 className="font-heading text-lg font-semibold text-stone-900">
                    {template.name}
                  </h3>
                  <p className="text-sm text-stone-600 mt-1">
                    {template.description}
                  </p>

                  {/* Style tag */}
                  <div className="mt-3">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded text-xs font-medium",
                        template.style === "romantic" &&
                          "bg-pink-100 text-pink-700",
                        template.style === "modern" &&
                          "bg-blue-100 text-blue-700",
                        template.style === "botanical" &&
                          "bg-emerald-100 text-emerald-700"
                      )}
                    >
                      {t(`filter.${template.style}`)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCta("back")}
        </Button>
        <Button
          onClick={handleNext}
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] bg-stone-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
