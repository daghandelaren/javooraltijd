"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Palette, Edit3, Send, BarChart3 } from "lucide-react";

const icons = [Palette, Edit3, Send, BarChart3];

export function HowItWorksSection() {
  const t = useTranslations("home.how_it_works");

  const steps = t.raw("steps") as Array<{
    number: string;
    title: string;
    description: string;
  }>;

  return (
    <section className="section-padding bg-champagne-50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-stone-600">{t("subtitle")}</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line - positioned at center of step circles */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-champagne-300 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = icons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative text-center"
                >
                  {/* Step number */}
                  <div className="relative inline-flex">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-champagne-200">
                      <Icon className="w-7 h-7 text-burgundy-700" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-burgundy-700 text-white text-sm font-semibold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-xl font-semibold text-stone-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-stone-600">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
