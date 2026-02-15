"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { type SealFontId } from "@/lib/wax-fonts";
import { type Template } from "@/lib/templates";
import { BloementuinFloralBackground } from "@/components/bloementuin-floral-bg";
import { LaDolceVitaCitrusBackground } from "@/components/ladolcevita-citrus-bg";
import { RivieraBackground } from "@/components/riviera-bg";

interface HeroSectionProps {
  partner1Name: string;
  partner2Name: string;
  headline?: string | null;
  weddingDate: Date;
  weddingTime?: string | null;
  sealColor: string;
  sealFont?: SealFontId;
  monogram?: string | null;
  template: Template;
  className?: string;
}

export function HeroSection({
  partner1Name,
  partner2Name,
  headline,
  weddingDate,
  weddingTime,
  sealColor,
  sealFont,
  monogram,
  template,
  className,
}: HeroSectionProps) {
  const formattedDate = weddingDate.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayMonogram = monogram || `${partner1Name.charAt(0)}&${partner2Name.charAt(0)}`;
  const isBotanical = template.style === "botanical";
  const isMediterranean = template.style === "mediterranean";
  const isCoastal = template.style === "coastal";
  const isBotanicalOrMedOrCoastal = isBotanical || isMediterranean || isCoastal;

  return (
    <section
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-4 py-12 relative",
        className
      )}
      style={{ background: template.colors.backgroundGradient }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {template.style === "modern" && <ModernBackground color={template.colors.secondary} />}
        {template.style === "botanical" && <BloementuinFloralBackground />}
        {template.style === "mediterranean" && <LaDolceVitaCitrusBackground />}
        {template.style === "coastal" && <RivieraBackground />}
      </div>

      <div className={cn("relative z-10 text-center max-w-2xl mx-auto", isCoastal ? "mt-8 sm:mt-12" : isBotanicalOrMedOrCoastal && "-mt-16")}>
        {/* Wax seal — hidden for botanical & mediterranean style */}
        {!isBotanical && !isMediterranean && !isCoastal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <WaxSeal
              initials={displayMonogram}
              color={sealColor}
              font={sealFont}
              size="lg"
              blur={0.5}
              interactive={false}
            />
          </motion.div>
        )}

        {/* Headline — above names for non-mediterranean, below for mediterranean */}
        {headline && !isMediterranean && !isCoastal && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-accent text-2xl sm:text-3xl mb-4"
            style={{
              color: template.colors.textMuted,
              fontFamily: `'${template.fonts.accent}', cursive`,
              ...(isBotanical && { textShadow: "0 0 20px rgba(253,251,247,1), 0 0 40px rgba(253,251,247,0.8), 0 0 60px rgba(253,251,247,0.5)" }),
            }}
          >
            {headline}
          </motion.p>
        )}

        {/* Botanical date — between headline and names */}
        {isBotanical && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12" style={{ backgroundColor: `${template.colors.primary}40` }} />
            <p
              className="text-xl sm:text-2xl capitalize"
              style={{
                color: template.colors.textMuted,
                fontFamily: `'${template.fonts.accent}', cursive`,
                textShadow: "0 0 20px rgba(253,251,247,1), 0 0 40px rgba(253,251,247,0.8), 0 0 60px rgba(253,251,247,0.5)",
              }}
            >
              {formattedDate}
            </p>
            <div className="h-px w-12" style={{ backgroundColor: `${template.colors.primary}40` }} />
          </motion.div>
        )}

        {/* Names */}
        {isCoastal ? (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="leading-tight text-center max-w-[58vw] sm:max-w-md mx-auto"
            style={{
              textShadow: "0 2px 12px rgba(253,252,250,0.9), 0 0px 4px rgba(253,252,250,0.6)",
            }}
          >
            <span
              className="text-[2.5rem] sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.08em]"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner1Name}
            </span>
            <span
              className="block text-2xl sm:text-4xl md:text-5xl my-0.5 sm:my-1"
              style={{
                color: template.colors.primary,
                fontFamily: `'${template.fonts.accent}', cursive`,
                fontWeight: 400,
              }}
            >
              &
            </span>
            <span
              className="text-[2.5rem] sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.08em]"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner2Name}
            </span>
          </motion.h1>
        ) : isMediterranean ? (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="leading-tight text-left"
            style={{
              textShadow: "0 2px 12px rgba(255,252,245,0.9), 0 0px 4px rgba(255,252,245,0.6)",
            }}
          >
            <span
              className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase tracking-[0.12em]"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner1Name}
            </span>
            <span
              className="inline-block text-4xl sm:text-5xl md:text-6xl mx-2 sm:mx-3"
              style={{
                color: template.colors.primary,
                fontFamily: `'${template.fonts.heading}', serif`,
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              &
            </span>
            <br />
            <span
              className="text-5xl sm:text-6xl md:text-7xl font-bold uppercase tracking-[0.12em]"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner2Name}
            </span>
          </motion.h1>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight"
            style={{
              color: template.colors.text,
              fontFamily: `'${template.fonts.heading}', serif`,
              ...(isBotanical && { textShadow: "0 0 20px rgba(253,251,247,1), 0 0 40px rgba(253,251,247,0.8), 0 0 60px rgba(253,251,247,0.5)" }),
            }}
          >
            {partner1Name}
            <span
              className="block text-2xl sm:text-3xl my-2 font-normal"
              style={{ color: template.colors.textMuted }}
            >
              &
            </span>
            {partner2Name}
          </motion.h1>
        )}

        {/* Coastal invitation text + date below names, centered */}
        {isCoastal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-center mt-4 sm:mt-8 max-w-[55vw] sm:max-w-sm mx-auto"
          >
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.body}', serif`,
                textShadow: "0 1px 8px rgba(253,252,250,0.8)",
              }}
            >
              Nodigen je uit om deel te nemen aan hun vreugde wanneer zij elkaar het jawoord geven!
            </p>
            <div className="flex items-center justify-center gap-3 mt-10 sm:mt-12">
              <div className="h-px w-10 sm:w-14" style={{ backgroundColor: `${template.colors.primary}50` }} />
              <p
                className="text-lg sm:text-2xl capitalize tracking-wide"
                style={{
                  color: template.colors.text,
                  fontFamily: `'${template.fonts.heading}', serif`,
                  textShadow: "0 1px 8px rgba(253,252,250,0.8)",
                }}
              >
                {formattedDate}
              </p>
              <div className="h-px w-10 sm:w-14" style={{ backgroundColor: `${template.colors.primary}50` }} />
            </div>
          </motion.div>
        )}

        {/* Mediterranean headline + date below names, left-aligned */}
        {isMediterranean && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-left mt-8"
          >
            {headline && (
              <p
                className="text-base sm:text-lg font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: template.colors.text,
                  fontFamily: `'${template.fonts.heading}', serif`,
                  textShadow: "0 1px 8px rgba(255,252,245,0.8)",
                }}
              >
                {headline}
              </p>
            )}
            <p
              className="text-lg sm:text-xl capitalize mt-1 tracking-wide"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
                textShadow: "0 1px 8px rgba(255,252,245,0.8)",
              }}
            >
              {formattedDate}
            </p>
          </motion.div>
        )}

        {/* Date and time */}
        {!isMediterranean && !isCoastal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 space-y-2"
        >
          {isBotanical ? null : (
            <>
              <p
                className="text-lg sm:text-xl capitalize"
                style={{
                  color: template.colors.text,
                  fontFamily: `'${template.fonts.body}', serif`,
                }}
              >
                {formattedDate}
              </p>
              {weddingTime && (
                <p
                  className="text-lg"
                  style={{ color: template.colors.textMuted }}
                >
                  {weddingTime} uur
                </p>
              )}
            </>
          )}
        </motion.div>
        )}
      </div>

      {/* CTA button + chevron at bottom — Bloementuin, La Dolce Vita & Riviera */}
      {isBotanicalOrMedOrCoastal ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="absolute bottom-32 sm:bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-10"
        >
          <button
            onClick={() => {
              document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-3 px-8 py-3 transition-opacity duration-200 hover:opacity-80 cursor-pointer"
          >
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{
                color: (isMediterranean || isCoastal) ? template.colors.primary : "#FDFBF7",
                textShadow: (isMediterranean || isCoastal)
                  ? "0 1px 12px rgba(255,252,245,0.8), 0 0px 4px rgba(255,252,245,0.5)"
                  : "0 1px 12px rgba(0,0,0,0.5), 0 0px 4px rgba(0,0,0,0.3)",
              }}
            >
              Bevestig aanwezigheid
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: (isMediterranean || isCoastal) ? "drop-shadow(0 1px 8px rgba(255,252,245,0.5))" : "drop-shadow(0 1px 8px rgba(0,0,0,0.4))" }}
            >
              <ChevronDown
                className="w-6 h-6"
                style={{ color: (isMediterranean || isCoastal) ? template.colors.primary : "#FDFBF7" }}
              />
            </motion.div>
          </button>
        </motion.div>
      ) : (
        /* Scroll indicator for non-botanical */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown
              className="w-8 h-8"
              style={{ color: template.colors.textMuted }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

// Background decorative elements for each style
function ModernBackground({ color }: { color: string }) {
  return (
    <>
      {/* Geometric shapes */}
      <div
        className="absolute top-0 right-0 w-1/3 h-1/3 opacity-5"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-1/4 h-1/4 opacity-5"
        style={{
          background: `linear-gradient(-45deg, ${color} 0%, transparent 100%)`,
        }}
      />
    </>
  );
}

