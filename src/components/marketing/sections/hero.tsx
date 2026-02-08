"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaxSeal, DEFAULT_SEAL_COLOR } from "@/components/wax-seal";

export function HeroSection() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 sm:pt-24 lg:pt-0">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(212 165 116 / 0.3) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-champagne-50/50 via-transparent to-white" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 leading-tight whitespace-pre-line">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg text-stone-600 max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/builder/template">
                  {t("cta_primary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/demo/romantisch">
                  <Play className="mr-2 h-4 w-4" />
                  {t("cta_secondary")}
                </Link>
              </Button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-sm text-stone-500"
            >
              {t("social_proof", { count: "500" })}
            </motion.p>
          </motion.div>

          {/* Wax seal visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative envelope background */}
              <div className="relative w-64 h-80 sm:w-80 sm:h-96 bg-gradient-to-br from-champagne-100 to-champagne-200 rounded-lg shadow-2xl transform rotate-2">
                {/* Envelope flap */}
                <div
                  className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-champagne-200 to-champagne-300 rounded-t-lg"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 60%, 0 100%)",
                  }}
                />

                {/* Envelope body lines */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="h-2 bg-champagne-300/50 rounded mb-3" />
                  <div className="h-2 bg-champagne-300/50 rounded mb-3 w-3/4" />
                  <div className="h-2 bg-champagne-300/50 rounded w-1/2" />
                </div>

                {/* Wax seal on envelope */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
                  <WaxSeal initials="J&B" color={DEFAULT_SEAL_COLOR} size="xl" interactive={false} />
                </div>
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-burgundy-100 opacity-60"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-champagne-300 opacity-60"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
