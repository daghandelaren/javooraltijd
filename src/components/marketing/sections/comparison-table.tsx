"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  FileText,
  Smartphone,
  Euro,
  Users,
  Clock,
  Monitor,
} from "lucide-react";

const DiamondIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 3h12l4 6-10 13L2 9z" />
    <path d="M2 9h20" />
    <path d="M12 22L6 9l6-6 6 6z" />
  </svg>
);

const benefitIcons = [Euro, Users, Monitor, Clock];

export function ComparisonTableSection() {
  const t = useTranslations("home.comparison");

  const costs = t.raw("paper.costs") as Array<{
    label: string;
    price: string;
  }>;
  const benefits = t.raw("digital.benefits") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section className="section-padding overflow-hidden relative">
      {/* Warm champagne background with subtle dot texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-champagne-50/30 via-champagne-50/50 to-champagne-50/30" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(212 165 116 / 0.15) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container-wide relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-champagne-100 text-olive-700 text-sm font-medium rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Two-card layout */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ── Left Card — Paper ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col rounded-2xl border border-stone-200/80 bg-white/80 backdrop-blur-sm shadow-sm p-6 lg:p-8 relative overflow-hidden"
          >
            {/* Faint pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(168 162 158 / 0.15) 1px, transparent 0)`,
                backgroundSize: "18px 18px",
              }}
            />

            <div className="relative flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-stone-500" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-stone-800">
                    {t("paper.title")}
                  </h3>
                  <p className="text-sm text-stone-400">
                    {t("paper.subtitle")}
                  </p>
                </div>
              </div>

              {/* Cost ledger */}
              <div className="flex-1 rounded-xl bg-stone-50/80 border border-stone-100 p-4">
                {costs.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.1 }}
                    className={`flex justify-between items-center py-2.5 ${
                      index < costs.length - 1
                        ? "border-b border-stone-100/80"
                        : ""
                    }`}
                  >
                    <span className="text-stone-500 text-sm">{item.label}</span>
                    <span className="text-stone-700 font-medium text-sm tabular-nums">
                      {item.price}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-5 mt-auto">
                <div className="h-px bg-gradient-to-r from-transparent via-stone-300/60 to-transparent mb-4" />
                <div className="flex justify-between items-center">
                  <span className="font-heading font-semibold text-stone-600 text-sm uppercase tracking-wide">
                    {t("paper.totalLabel")}
                  </span>
                  {/* Elegant strikethrough — custom diagonal slash */}
                  <span className="relative inline-block">
                    <span className="font-heading text-2xl font-bold text-rose-400/80 tabular-nums">
                      {t("paper.totalPrice")}
                    </span>
                    {/* Hand-drawn style diagonal line */}
                    <svg
                      className="absolute inset-0 w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <line
                        x1="-4"
                        y1="65%"
                        x2="104%"
                        y2="30%"
                        stroke="rgb(244 63 94 / 0.45)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Footnote */}
              <p className="text-[11px] text-stone-400 italic mt-3">
                {t("paper.footnote")}
              </p>
            </div>
          </motion.div>

          {/* ── Right Card — Digital ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col rounded-2xl border border-olive-200/80 bg-gradient-to-br from-olive-50/80 via-white to-champagne-50/40 shadow-lg shadow-olive-100/40 ring-1 ring-olive-100/60 p-6 lg:p-8 relative overflow-hidden"
          >
            {/* "Populair" badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: 0.55,
                type: "spring",
                stiffness: 260,
                damping: 14,
              }}
              className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-olive-700 text-white text-xs font-medium px-3 py-1 rounded-full z-10 shadow-sm"
            >
              <DiamondIcon className="w-3.5 h-3.5" />
              {t("digital.popularBadge")}
            </motion.span>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-olive-100 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-olive-700" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-stone-800">
                  {t("digital.title")}
                </h3>
                <p className="text-sm text-stone-400">
                  {t("digital.subtitle")}
                </p>
              </div>
            </div>

            {/* 2×2 benefit grid — horizontal icon + text in each tile */}
            <div className="grid grid-cols-2 gap-2.5 flex-1">
              {benefits.map((benefit, index) => {
                const Icon = benefitIcons[index];
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: 0.25 + index * 0.08,
                    }}
                    className="flex items-center gap-3 rounded-xl bg-white/70 backdrop-blur-sm border border-olive-100/40 p-3.5 shadow-sm h-full"
                  >
                    <div className="w-9 h-9 rounded-lg bg-olive-100/80 flex items-center justify-center shrink-0">
                      <Icon className="w-[18px] h-[18px] text-olive-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-heading text-[15px] font-semibold text-stone-800 block leading-tight">
                        {benefit.title}
                      </span>
                      <span className="text-xs text-stone-400 leading-snug block mt-0.5">
                        {benefit.description}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Price footer — vertically centered price between prefix and suffix */}
            <div className="mt-auto pt-6 text-center">
              <div className="h-px bg-gradient-to-r from-transparent via-olive-300/50 to-transparent mb-4" />
              <div className="flex flex-col items-center justify-center gap-0">
                <p className="font-accent text-base text-stone-500 leading-none">
                  {t("digital.pricePrefix")}
                </p>
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="inline-block font-heading text-5xl font-bold text-olive-700 leading-none -mt-1"
                >
                  {t("digital.price")}
                </motion.span>
                <p className="text-xs text-stone-400 tracking-widest uppercase leading-none mt-3">
                  {t("digital.priceSuffix")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
