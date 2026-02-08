"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaxSeal } from "@/components/wax-seal/wax-seal";

export function WaxSealStorySection() {
  const t = useTranslations("home.wax_seal_story");

  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <section className="section-padding bg-stone-900 text-white overflow-hidden">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Wax seal visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center order-2 lg:order-1"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full bg-burgundy-700/20 blur-3xl" />
            </div>

            {/* Multiple seals composition */}
            <div className="relative">
              {/* Background seal - top left */}
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -left-8 opacity-60 z-0"
              >
                <WaxSeal
                  initials="E&L"
                  color="gold"
                  size="md"
                  interactive={false}
                />
              </motion.div>

              {/* Main seal - center (in front) */}
              <div className="relative z-20">
                <WaxSeal
                  initials="J&M"
                  color="red"
                  size="xl"
                  interactive={false}
                />
              </div>

              {/* Background seal - bottom right */}
              <motion.div
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 opacity-60 z-10"
              >
                <WaxSeal
                  initials="S&D"
                  color="green"
                  size="md"
                  interactive={false}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold">
              {t("title")}
            </h2>

            <div className="mt-6 space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-stone-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild variant="secondary" size="lg">
                <Link href="/demo/romantisch">
                  {t("cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
