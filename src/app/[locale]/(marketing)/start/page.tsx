"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, CalendarHeart, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const products = [
  {
    key: "invitation" as const,
    href: "/builder/package",
    icon: Mail,
    accentColor: "#8EA870",
    accentBg: "bg-olive-50",
    accentText: "text-olive-700",
  },
  {
    key: "saveTheDate" as const,
    href: "/std-builder/template",
    icon: CalendarHeart,
    accentColor: "#C09878",
    accentBg: "bg-champagne-50",
    accentText: "text-champagne-700",
  },
];

export default function StartPage() {
  const t = useTranslations("start");

  return (
    <div className="relative min-h-[80vh] flex items-center py-24 md:py-32">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(212 165 116 / 0.2) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-champagne-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-olive-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 leading-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-stone-600">{t("subtitle")}</p>
        </motion.div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * index + 0.2, duration: 0.5 }}
              >
                <Link href={product.href} className="block group h-full">
                  <Card className="relative h-full p-8 border-2 border-champagne-200 hover:border-olive-300 transition-all duration-300 hover:shadow-lg overflow-hidden">
                    {/* Decorative corner gradient */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 opacity-20 rounded-bl-full pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 100% 0%, ${product.accentColor} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${product.accentBg} mb-6`}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: product.accentColor }}
                      />
                    </div>

                    {/* Content */}
                    <h2 className="font-heading text-2xl font-semibold text-stone-900 mb-2">
                      {t(`${product.key}.title`)}
                    </h2>
                    <p className="text-stone-600 leading-relaxed mb-6">
                      {t(`${product.key}.description`)}
                    </p>

                    {/* Price hint */}
                    <p className="text-sm font-medium text-stone-500 mb-6">
                      {t(`${product.key}.price`)}
                    </p>

                    {/* CTA */}
                    <span
                      className={`inline-flex items-center text-sm font-medium ${product.accentText} group-hover:gap-2 transition-all`}
                    >
                      {t(`${product.key}.cta`)}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
