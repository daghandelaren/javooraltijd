"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Heart, Sparkles, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { cn } from "@/lib/utils";

const values = [
  { id: "tradition", icon: Heart },
  { id: "personal", icon: Sparkles },
  { id: "quality", icon: Shield },
  { id: "together", icon: Users },
];

export default function OverOnsPage() {
  const t = useTranslations("aboutPage");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <main className="relative overflow-hidden">
      {/* Decorative background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section - Editorial Style */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[5%] w-[500px] h-[500px] bg-gradient-to-bl from-champagne-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] bg-gradient-to-tr from-olive-100/20 to-transparent rounded-full blur-3xl" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="container-wide relative z-10 py-24 md:py-32"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className="w-12 h-px bg-olive-300" />
                <span className="text-olive-700 font-medium tracking-wider text-sm uppercase">
                  {t("hero.label")}
                </span>
              </motion.div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-stone-900 leading-[1.1] mb-8">
                {t("hero.title")}
              </h1>

              <p className="text-xl text-stone-600 leading-relaxed max-w-xl">
                {t("hero.subtitle")}
              </p>
            </motion.div>

            {/* Visual - Wax Seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Decorative envelope */}
              <div className="relative">
                <div className="w-72 h-80 sm:w-80 sm:h-96 bg-gradient-to-br from-champagne-100 via-champagne-50 to-white rounded-lg shadow-2xl transform rotate-3 border border-champagne-200">
                  {/* Envelope flap lines */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 320 384"
                    fill="none"
                  >
                    <path
                      d="M0 0 L160 100 L320 0"
                      stroke="rgb(232 193 157 / 0.3)"
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>

                  {/* Decorative lines */}
                  <div className="absolute bottom-12 left-10 right-10 space-y-3">
                    <div className="h-1 bg-champagne-200/60 rounded" />
                    <div className="h-1 bg-champagne-200/60 rounded w-3/4" />
                    <div className="h-1 bg-champagne-200/60 rounded w-1/2" />
                  </div>
                </div>

                {/* Wax seal positioned on envelope */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <WaxSeal
                    initials="JA"
                    color="#8EA870"
                    size="xl"
                    interactive={false}
                  />
                </div>

                {/* Floating decorative elements */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 w-16 h-16 bg-olive-100 rounded-full opacity-60"
                />
                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-champagne-300 rounded-full opacity-50"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* The Story Section - Editorial Layout */}
      <section className="relative py-24 md:py-32 bg-champagne-50">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(212 165 116 / 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container-wide relative">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <span className="font-accent text-2xl text-olive-600 mb-4 block">
              {t("story.eyebrow")}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 leading-tight">
              {t("story.title")}
            </h2>
          </motion.div>

          {/* Story content - Magazine style layout */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-7 space-y-6"
            >
              {(t.raw("story.paragraphs") as string[]).map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    "text-stone-600 leading-relaxed",
                    index === 0 && "text-lg first-letter:text-5xl first-letter:font-heading first-letter:font-semibold first-letter:text-olive-700 first-letter:float-left first-letter:mr-3 first-letter:mt-1"
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Sidebar with pull quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="sticky top-32">
                <blockquote className="relative pl-6 border-l-4 border-olive-300">
                  <p className="font-heading text-2xl sm:text-3xl text-stone-800 italic leading-relaxed">
                    "{t("story.quote")}"
                  </p>
                </blockquote>

                {/* Decorative seal */}
                <div className="mt-12 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-olive-100 rounded-full blur-xl opacity-50 scale-150" />
                    <WaxSeal
                      initials="♥"
                      color="#D08088"
                      size="xl"
                      interactive={false}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-24 md:py-32">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="font-accent text-2xl text-olive-600 mb-4 block">
              {t("mission.eyebrow")}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 leading-tight mb-6">
              {t("mission.title")}
            </h2>
            <p className="text-xl text-stone-600 leading-relaxed">
              {t("mission.description")}
            </p>
          </motion.div>

          {/* Values grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-white rounded-2xl p-8 border-2 border-champagne-200 hover:border-olive-200 transition-colors h-full">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-olive-50 flex items-center justify-center mb-6 group-hover:bg-olive-100 transition-colors">
                      <Icon className="w-7 h-7 text-olive-700" />
                    </div>

                    <h3 className="font-heading text-xl font-semibold text-stone-900 mb-3">
                      {t(`mission.values.${value.id}.title`)}
                    </h3>

                    <p className="text-stone-600 leading-relaxed">
                      {t(`mission.values.${value.id}.description`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-champagne-50 to-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Decorative wax seals */}
            <div className="flex justify-center gap-2 md:gap-6 mb-10 scale-[0.8] md:scale-100">
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <WaxSeal
                  initials="E&L"
                  color="#C09878"
                  size="lg"
                  interactive={false}
                />
              </motion.div>
              <motion.div
                animate={{ rotate: [3, -3, 3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <WaxSeal
                  initials="JA"
                  color="#8EA870"
                  size="xl"
                  interactive={false}
                />
              </motion.div>
              <motion.div
                animate={{ rotate: [-3, 5, -3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <WaxSeal
                  initials="S&D"
                  color="#9B89B6"
                  size="lg"
                  interactive={false}
                />
              </motion.div>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 leading-tight mb-6">
              {t("cta.title")}
            </h2>

            <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto mb-10">
              {t("cta.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-olive-700 hover:bg-olive-800">
                <Link href="/builder/package">
                  {t("cta.primaryButton")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/templates">
                  {t("cta.secondaryButton")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
