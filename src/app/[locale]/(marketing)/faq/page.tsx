"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  CreditCard,
  Settings,
  Users,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  { id: "general", icon: HelpCircle },
  { id: "pricing", icon: CreditCard },
  { id: "technical", icon: Settings },
  { id: "rsvp", icon: Users },
];

export default function FAQPage() {
  const t = useTranslations("faqPage");
  const [activeCategory, setActiveCategory] = useState("general");

  const currentFaqs = t.raw(`categories.${activeCategory}.items`) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <main className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Decorative circles */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-gradient-to-bl from-champagne-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-burgundy-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[20%] w-64 h-64 bg-gradient-to-tl from-champagne-300/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Decorative element */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-burgundy-100 mb-6"
            >
              <HelpCircle className="w-8 h-8 text-burgundy-700" />
            </motion.div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 leading-tight mb-6">
              {t("title")}
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="relative pb-8">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-300",
                    isActive
                      ? "bg-burgundy-700 text-white shadow-lg shadow-burgundy-200"
                      : "bg-white text-stone-600 hover:bg-champagne-100 border border-champagne-200 hover:border-champagne-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {t(`categories.${category.id}.name`)}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="relative py-12 md:py-16">
        <div className="container-narrow">
          <div>
            {/* Category Header */}
            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
                {t(`categories.${activeCategory}.title`)}
              </h2>
              <p className="text-stone-500">
                {t(`categories.${activeCategory}.description`)}
              </p>
            </div>

            {/* FAQ Items */}
            <Accordion type="single" collapsible className="w-full">
              {currentFaqs.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-stone-900 text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-stone-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="relative py-24">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-champagne-100/50 via-white to-champagne-100/50 rounded-3xl" />

            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 md:p-14 border border-champagne-200 shadow-xl text-center">
              {/* Decorative dots */}
              <div className="absolute top-6 left-6 flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-burgundy-300" />
                <div className="w-2 h-2 rounded-full bg-champagne-400" />
                <div className="w-2 h-2 rounded-full bg-stone-300" />
              </div>

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-burgundy-100 mb-6">
                <MessageCircle className="w-7 h-7 text-burgundy-700" />
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-stone-900 mb-4">
                {t("contact.title")}
              </h2>

              <p className="text-stone-600 text-lg mb-8 max-w-lg mx-auto">
                {t("contact.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-burgundy-700 hover:bg-burgundy-800">
                  <Link href="/contact">
                    {t("contact.button")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:info@javooraltijd.nl">
                    info@javooraltijd.nl
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
