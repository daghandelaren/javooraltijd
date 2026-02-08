"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { templates, type Template } from "@/lib/templates";
import { cn } from "@/lib/utils";

type StyleFilter = "all" | "romantic" | "modern" | "minimal";

export default function TemplatesPage() {
  const t = useTranslations("templates");
  const locale = useLocale();
  const [filter, setFilter] = useState<StyleFilter>("all");

  const filteredTemplates =
    filter === "all"
      ? templates
      : templates.filter((template) => template.style === filter);

  const filters: { value: StyleFilter; label: string }[] = [
    { value: "all", label: t("filter.all") },
    { value: "romantic", label: t("filter.romantic") },
    { value: "modern", label: t("filter.modern") },
    { value: "minimal", label: t("filter.minimal") },
  ];

  return (
    <div className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-stone-900">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-olive-700 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Templates grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              locale={locale}
              index={index}
              viewDemoLabel={t("view_demo")}
              selectLabel={t("select")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  locale,
  index,
  viewDemoLabel,
  selectLabel,
}: {
  template: Template;
  locale: string;
  index: number;
  viewDemoLabel: string;
  selectLabel: string;
}) {
  const name = locale === "en" ? template.nameEn : template.name;
  const description =
    locale === "en" ? template.descriptionEn : template.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden h-full flex flex-col">
        {/* Preview area */}
        <div
          className="aspect-[3/4] relative flex items-center justify-center p-4 sm:p-6"
          style={{ background: template.colors.backgroundGradient }}
        >
          <div className="w-full h-full bg-white/80 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
            <WaxSeal
              initials="J&B"
              color={template.sealColor}
              size="lg"
              interactive={false}
            />
            <div className="mt-6 text-center">
              <p
                className="font-accent text-xl"
                style={{ color: template.colors.primary }}
              >
                Jullie namen hier
              </p>
              <p
                className="text-sm mt-2"
                style={{ color: template.colors.textMuted }}
              >
                15 juni 2025
              </p>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
            <Button asChild size="sm" variant="secondary">
              <Link href={`/demo/${template.slug}`}>{viewDemoLabel}</Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading text-xl font-semibold text-stone-900">
              {name}
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600 capitalize">
              {template.style}
            </span>
          </div>
          <p className="text-stone-600 text-sm flex-1">{description}</p>
          <div className="mt-4 pt-4 border-t border-stone-100">
            <Button asChild className="w-full">
              <Link href={`/builder/template?selected=${template.slug}`}>
                {selectLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
