"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, X, Leaf, Zap, Euro, Sparkles, Users, PenLine } from "lucide-react";

const icons = [Euro, Leaf, Zap, PenLine, Sparkles, Users];

export function ComparisonTableSection() {
  const t = useTranslations("home.comparison");

  const items = t.raw("items") as Array<{
    aspect: string;
    traditional: string;
    digital: string;
  }>;

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-wide">
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

        {/* Desktop Table View */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:block"
        >
          <div className="relative rounded-2xl border border-stone-200 overflow-hidden bg-gradient-to-b from-champagne-50/50 to-white">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-stone-200">
              <div className="p-6 bg-stone-50/50" />
              <div className="p-6 text-center border-l border-stone-200 bg-stone-100/50">
                <span className="font-heading text-lg font-semibold text-stone-600">
                  {t("traditional")}
                </span>
              </div>
              <div className="p-6 text-center border-l border-stone-200 bg-gradient-to-br from-olive-600 to-olive-700">
                <span className="font-heading text-lg font-semibold text-white">
                  {t("digital")}
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {items.map((row, index) => {
              const Icon = icons[index];
              return (
                <motion.div
                  key={row.aspect}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  className={`grid grid-cols-3 ${
                    index !== items.length - 1 ? "border-b border-stone-200" : ""
                  }`}
                >
                  {/* Aspect */}
                  <div className="p-5 flex items-center gap-3 bg-stone-50/30">
                    <div className="w-10 h-10 rounded-lg bg-champagne-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-olive-700" />
                    </div>
                    <span className="font-medium text-stone-800">{row.aspect}</span>
                  </div>

                  {/* Traditional */}
                  <div className="p-5 flex items-center justify-center gap-2 border-l border-stone-200 bg-stone-50/20">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-stone-500 text-sm">{row.traditional}</span>
                  </div>

                  {/* Digital */}
                  <div className="p-5 flex items-center justify-center gap-2 border-l border-stone-200 bg-olive-50/30">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-stone-700 text-sm font-medium">{row.digital}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {items.map((row, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={row.aspect}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm"
              >
                {/* Aspect Header */}
                <div className="p-4 bg-champagne-50 border-b border-stone-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-olive-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-olive-700" />
                  </div>
                  <span className="font-heading font-semibold text-stone-800">{row.aspect}</span>
                </div>

                {/* Comparison Content */}
                <div className="divide-y divide-stone-100">
                  {/* Traditional */}
                  <div className="p-4 flex items-start gap-3 bg-stone-50/50">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                        {t("traditional")}
                      </span>
                      <p className="text-stone-600 text-sm mt-0.5">{row.traditional}</p>
                    </div>
                  </div>

                  {/* Digital */}
                  <div className="p-4 flex items-start gap-3 bg-olive-50/40">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-olive-600 uppercase tracking-wide">
                        {t("digital")}
                      </span>
                      <p className="text-stone-800 text-sm font-medium mt-0.5">{row.digital}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
