"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  const t = useTranslations("home.final_cta");

  return (
    <section className="section-padding bg-gradient-to-br from-olive-700 via-olive-800 to-olive-900 text-white">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-olive-100">{t("subtitle")}</p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-white text-olive-700 hover:bg-champagne-100"
            >
              <Link href="/builder/package">
                {t("cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
