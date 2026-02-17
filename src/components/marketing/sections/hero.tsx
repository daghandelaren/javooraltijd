"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaxSeal, DEFAULT_SEAL_COLOR } from "@/components/wax-seal";
import { getSealFontCss } from "@/lib/wax-fonts";
import Image from "next/image";

export function HeroSection() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6 sm:px-4 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-0 lg:pb-0">
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
                <Link href="/demo/riviera">
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

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative max-w-full">
              {/* Phone frame */}
              <div className="relative w-[240px] h-[480px] sm:w-[300px] sm:h-[600px] bg-stone-900 rounded-[3rem] p-2.5 shadow-2xl">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-900 rounded-b-2xl z-20" />

                {/* Phone screen */}
                <div
                  className="relative w-full h-full rounded-[2.25rem] overflow-hidden"
                  style={{
                    backgroundColor: "#E8DFD4",
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    transform: "translateZ(0)",
                  }}
                >
                  {/* Combined envelope image */}
                  <Image
                    src="/images/envelope/envelope-mobile.png"
                    alt="Envelope preview"
                    fill
                    className="object-cover object-top lg:scale-[1.15] lg:origin-center"
                    priority
                  />


                  {/* Seal + text container */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center lg:scale-[1.15]"
                    style={{ top: "48%" }}
                  >
                    {/* Seal text */}
                    <p
                      style={{
                        fontFamily: getSealFontCss("lavishly-yours"),
                        fontSize: "1.15rem",
                        color: "rgba(90, 78, 65, 0.45)",
                        filter: "blur(0.3px)",
                        textShadow:
                          "0 1px 2px rgba(90, 78, 65, 0.2), 0 0 1px rgba(90, 78, 65, 0.1)",
                        letterSpacing: "0.02em",
                        marginBottom: "0.2rem",
                      }}
                    >
                      15 juni 2026
                    </p>
                    {/* Wax seal */}
                    <div
                      className="scale-75"
                      style={{
                        filter: "drop-shadow(5px 4px 8px rgba(0,0,0,0.7))",
                      }}
                    >
                      <WaxSeal
                        initials="J&B"
                        color={DEFAULT_SEAL_COLOR}
                        size="lg"
                        interactive={false}
                      />
                    </div>
                  </div>
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
                className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-olive-100 opacity-60"
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
