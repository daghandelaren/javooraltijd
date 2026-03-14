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
import { StdWatercolorVillaBackground } from "@/components/std-watercolor-villa-bg";
import { StdLimoncelloBackground } from "@/components/std-limoncello-bg";

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
  rsvpId?: string;
  isSaveTheDate?: boolean;
  isCompactPreview?: boolean;
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
  rsvpId = "rsvp",
  isSaveTheDate = false,
  isCompactPreview = false,
}: HeroSectionProps) {
  const formattedDate = weddingDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayMonogram = monogram || `${partner1Name.charAt(0)}&${partner2Name.charAt(0)}`;
  const isBotanical = template.style === "botanical";
  const isMediterranean = template.style === "mediterranean";
  const isCoastal = template.style === "coastal";
  const isMinimalist = template.style === "minimalist";
  const isStdCoastal = isCoastal && isSaveTheDate && !!template.slug?.startsWith("std-");
  const isStdMediterranean = isMediterranean && isSaveTheDate && !!template.slug?.startsWith("std-");
  const isBotanicalOrMedOrCoastal = isBotanical || isMediterranean || isCoastal || isMinimalist;

  return (
    <section
      className={cn(
        "min-h-screen flex flex-col items-center px-4 relative overflow-hidden",
        isStdCoastal
          ? cn("justify-end", isCompactPreview ? "pb-36 sm:pb-[14rem] lg:pb-20" : "pb-[10rem] sm:pb-20")
          : isBotanical ? "justify-start pt-24 sm:pt-28" : "justify-center py-12",
        !isStdCoastal && isCoastal && "pb-32 sm:pb-12",
        className
      )}
      style={{ background: template.colors.backgroundGradient }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {template.slug?.startsWith("std-") ? (
          <>
            {template.style === "coastal" && <StdWatercolorVillaBackground />}
            {template.style === "mediterranean" && <StdLimoncelloBackground />}
          </>
        ) : (
          <>
            {template.style === "modern" && <ModernBackground color={template.colors.secondary} />}
            {template.style === "botanical" && <BloementuinFloralBackground />}
            {template.style === "mediterranean" && <LaDolceVitaCitrusBackground />}
            {template.style === "coastal" && <RivieraBackground />}
          </>
        )}
      </div>

      {isBotanical ? null : (
      <div className={cn("relative z-10 text-center max-w-2xl mx-auto", isStdCoastal ? "" : isMinimalist ? "" : isCoastal ? cn(isCompactPreview ? "mt-20" : "mt-14", "sm:mt-12") : isBotanicalOrMedOrCoastal && "-mt-16")}>
        {/* Wax seal — hidden for botanical, mediterranean, coastal & minimalist */}
        {!isBotanical && !isMediterranean && !isCoastal && !isMinimalist && (
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
        {headline && !isMediterranean && !isCoastal && !isMinimalist && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-accent text-2xl sm:text-3xl mb-4"
            style={{
              color: template.colors.textMuted,
              fontFamily: `'${template.fonts.accent}', cursive`,
              ...(isBotanical ? { textShadow: "0 0 20px rgba(253,251,247,1), 0 0 40px rgba(253,251,247,0.8), 0 0 60px rgba(253,251,247,0.5)" } : {}),
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
        {isMinimalist ? (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="leading-[0.85] text-center"
          >
            <span
              className={cn("block font-light uppercase tracking-[0.15em]", isCompactPreview ? "text-[3rem] sm:text-[5.5rem]" : "text-[5rem] sm:text-[8rem]")}
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner1Name}
            </span>
            <span
              className={cn("block my-1 sm:my-2", isCompactPreview ? "text-[2rem] sm:text-[3rem]" : "text-[3rem] sm:text-[4.5rem]")}
              style={{
                color: template.colors.textMuted,
                fontFamily: `'${template.fonts.accent}', cursive`,
                fontWeight: 400,
              }}
            >
              &
            </span>
            <span
              className={cn("block font-light uppercase tracking-[0.15em]", isCompactPreview ? "text-[3rem] sm:text-[5.5rem]" : "text-[5rem] sm:text-[8rem]")}
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner2Name}
            </span>
          </motion.h1>
        ) : isCoastal && template.slug?.startsWith("std-") && isSaveTheDate ? (
          /* STD coastal: single-line flowing script names */
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mx-auto"
            style={{
              textShadow: "0 2px 16px rgba(253,252,250,0.95), 0 0px 6px rgba(253,252,250,0.7)",
            }}
          >
            <span
              className={cn(isCompactPreview ? "text-2xl sm:text-[2.5rem]" : "text-3xl sm:text-4xl", "lg:text-5xl whitespace-nowrap")}
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.accent}', cursive`,
                fontWeight: 400,
              }}
            >
              {partner1Name} <span style={{ color: template.colors.primary }}>&amp;</span> {partner2Name}
            </span>
          </motion.h1>
        ) : isCoastal ? (
          /* Wedding invitation coastal: stacked uppercase names */
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
              className={cn("font-bold uppercase tracking-[0.08em]", isCompactPreview ? "text-[2.5rem] sm:text-5xl" : "text-[2.5rem] sm:text-4xl", "lg:text-6xl")}
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner1Name}
            </span>
            <span
              className={cn("block my-0.5 sm:my-1", isCompactPreview ? "text-2xl sm:text-4xl" : "text-2xl sm:text-3xl", "lg:text-5xl")}
              style={{
                color: template.colors.primary,
                fontFamily: `'${template.fonts.accent}', cursive`,
                fontWeight: 400,
              }}
            >
              &
            </span>
            <span
              className={cn("font-bold uppercase tracking-[0.08em]", isCompactPreview ? "text-[2.5rem] sm:text-5xl" : "text-[2.5rem] sm:text-4xl", "lg:text-6xl")}
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner2Name}
            </span>
          </motion.h1>
        ) : isStdMediterranean ? (
          /* STD Mediterranean: centered with curved "save the date" + single-line names */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            {/* Curved "save the date" arc */}
            <svg
              viewBox="0 0 200 30"
              className="w-[26rem] sm:w-[30rem] max-w-full mx-auto sm:max-w-none sm:ml-auto sm:mr-0 mb-3"
              aria-hidden="true"
            >
              <defs>
                <path id="std-med-arc" d="M 15,28 Q 100,2 185,28" fill="none" />
              </defs>
              <text
                fill={template.colors.textMuted}
                fontSize="12"
                letterSpacing="1.5"
                style={{ fontFamily: `'${template.fonts.accent}', cursive` }}
              >
                <textPath href="#std-med-arc" startOffset="65%" textAnchor="middle">
                  save the date
                </textPath>
              </text>
            </svg>

            {/* Names stacked: "NAME &" / "NAME" */}
            <h1 className="leading-tight">
              <span
                className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.08em]"
                style={{
                  color: template.colors.text,
                  fontFamily: `'${template.fonts.heading}', serif`,
                }}
              >
                {partner1Name}
              </span>
              <span
                className="inline-block text-3xl sm:text-4xl md:text-5xl mx-2 sm:mx-3"
                style={{
                  color: template.colors.text,
                  fontFamily: `'${template.fonts.heading}', serif`,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                &amp;
              </span>
              <br />
              <span
                className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.08em]"
                style={{
                  color: template.colors.text,
                  fontFamily: `'${template.fonts.heading}', serif`,
                }}
              >
                {partner2Name}
              </span>
            </h1>

            {/* Body text */}
            <p
              className="text-xs sm:text-xs leading-relaxed max-w-[16rem] mx-auto mt-10"
              style={{
                color: template.colors.textMuted,
                fontFamily: `'${template.fonts.body}', serif`,
              }}
            >
              Nodigen je uit voor hun bruiloft op{" "}
              {weddingDate.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
              . Noteer de datum alvast in je agenda, de officiële uitnodiging volgt snel!
            </p>
          </motion.div>
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
              ...(isBotanical ? { textShadow: "0 0 20px rgba(253,251,247,1), 0 0 40px rgba(253,251,247,0.8), 0 0 60px rgba(253,251,247,0.5)" } : {}),
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

        {/* Minimalist date + invitation text */}
        {isMinimalist && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-8 sm:mt-12"
          >
            <p
              className="text-sm sm:text-base uppercase tracking-[0.3em] font-light"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.body}', serif`,
              }}
            >
              {formattedDate}
            </p>
            <p
              className="mt-6 text-base sm:text-lg italic font-light leading-relaxed"
              style={{
                color: template.colors.textMuted,
                fontFamily: `'${template.fonts.body}', serif`,
              }}
            >
              {isSaveTheDate ? (
                headline || "Noteer de datum in je agenda"
              ) : (
                headline || <>
                  Nodigen je uit om hun
                  <br />
                  bruiloft te vieren!
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Coastal invitation text + date below names, centered */}
        {isCoastal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className={cn("text-center mt-4 max-w-[72vw] lg:max-w-sm mx-auto", isCompactPreview ? "sm:max-w-sm sm:mt-5 lg:mt-8" : "sm:max-w-[220px] sm:mt-8")}
          >
            {template.slug?.startsWith("std-") && isSaveTheDate ? (
              /* STD coastal: 3-line uppercase date (no time) */
              <>
                <p
                  className={cn(isCompactPreview ? "text-lg sm:text-3xl" : "text-xl sm:text-2xl", "lg:text-3xl italic")}
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.accent}', cursive`,
                    fontWeight: 400,
                    textShadow: "0 1px 8px rgba(253,252,250,0.8)",
                  }}
                >
                  {headline || "Save the Date"}
                </p>
                <div className={cn("flex items-center justify-center gap-3 mt-2 lg:mt-6", isCompactPreview ? "sm:mt-5" : "sm:mt-3")}>
                  <div className="h-px w-10 sm:w-14" style={{ backgroundColor: `${template.colors.primary}50` }} />
                  <div
                    className="text-center uppercase tracking-[0.15em]"
                    style={{
                      color: template.colors.text,
                      fontFamily: `'${template.fonts.heading}', serif`,
                      textShadow: "0 1px 8px rgba(253,252,250,0.8)",
                    }}
                  >
                    <p className={cn(isCompactPreview ? "text-lg sm:text-lg" : "text-xl sm:text-sm", "lg:text-3xl font-bold mt-0.5")}>
                      {weddingDate.getDate()}{" "}
                      {weddingDate.toLocaleDateString("nl-NL", { month: "long" })}
                    </p>
                    <p className={cn(isCompactPreview ? "text-sm sm:text-sm" : "text-base sm:text-xs", "lg:text-lg font-semibold mt-0.5")}>
                      {weddingDate.getFullYear()}
                    </p>
                  </div>
                  <div className="h-px w-10 sm:w-14" style={{ backgroundColor: `${template.colors.primary}50` }} />
                </div>
              </>
            ) : (
              /* Wedding invitation coastal: original layout */
              <>
                <p
                  className={cn("leading-relaxed", isCompactPreview ? "text-xs sm:text-sm" : "text-xs sm:text-[0.65rem]", "lg:text-sm")}
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.body}', serif`,
                    textShadow: "0 1px 8px rgba(253,252,250,0.8)",
                  }}
                >
                  {headline || "Nodigen je uit om deel te nemen aan hun vreugde wanneer zij elkaar het jawoord geven!"}
                </p>
                <div className="flex items-center justify-center gap-3 mt-4 sm:mt-5 lg:mt-12">
                  <div className="h-px w-10 sm:w-14" style={{ backgroundColor: `${template.colors.primary}50` }} />
                  <p
                    className={cn("capitalize tracking-wide whitespace-nowrap", isCompactPreview ? "text-lg sm:text-base" : "text-lg sm:text-xs", "lg:text-2xl")}
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
              </>
            )}
          </motion.div>
        )}

        {/* Mediterranean headline + date below names, left-aligned (non-STD only) */}
        {isMediterranean && !isStdMediterranean && (
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
        {!isMediterranean && !isCoastal && !isMinimalist && (
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
      )}

      {/* Botanical layout — names at top, headline + date above the green bush */}
      {isBotanical && (
        <>
          {/* Names at top */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10 text-center font-heading text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight"
            style={{
              color: template.colors.text,
              fontFamily: `'${template.fonts.heading}', serif`,
              textShadow: "0 0 20px rgba(253,251,247,1), 0 0 40px rgba(253,251,247,0.8), 0 0 60px rgba(253,251,247,0.5)",
            }}
          >
            {partner1Name}
            <span className="block text-2xl sm:text-3xl my-2 font-normal" style={{ color: template.colors.textMuted }}>
              &
            </span>
            {partner2Name}
          </motion.h1>

          {/* Headline + date near bottom, just above the green bush */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative z-10 text-center mt-4 sm:mt-6"
          >
            {headline && (
              <p
                className="font-accent text-2xl sm:text-3xl mb-6"
                style={{
                  color: template.colors.textMuted,
                  fontFamily: `'${template.fonts.accent}', cursive`,
                  textShadow: "0 0 20px rgba(253,251,247,1), 0 0 40px rgba(253,251,247,0.8), 0 0 60px rgba(253,251,247,0.5)",
                }}
              >
                {headline}
              </p>
            )}
            <div className="flex items-center justify-center gap-4">
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
            </div>
          </motion.div>
        </>
      )}

      {/* CTA button + chevron at bottom — hidden for Save the Date */}
      {isSaveTheDate ? null : isBotanicalOrMedOrCoastal ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className={cn("absolute left-0 right-0 flex flex-col items-center gap-3 z-10", isMinimalist ? "bottom-10" : isCoastal ? cn("bottom-28 lg:bottom-[110px]", isCompactPreview ? "sm:bottom-[130px]" : "sm:bottom-[85px]") : "bottom-4 sm:bottom-10")}
        >
          <button
            onClick={() => {
              document.getElementById(rsvpId)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-3 sm:gap-2 lg:gap-3 px-8 py-3 transition-opacity duration-200 hover:opacity-80 cursor-pointer"
          >
            <span
              className="text-xs sm:text-xs lg:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.15em] lg:tracking-[0.2em] uppercase"
              style={{
                color: (isMediterranean || isCoastal) ? template.colors.primary : isMinimalist ? template.colors.textMuted : "#FDFBF7",
                textShadow: (isMediterranean || isCoastal)
                  ? "0 1px 12px rgba(255,252,245,0.8), 0 0px 4px rgba(255,252,245,0.5)"
                  : isMinimalist ? "none" : "0 1px 12px rgba(0,0,0,0.5), 0 0px 4px rgba(0,0,0,0.3)",
              }}
            >
              Bevestig aanwezigheid
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: (isMediterranean || isCoastal) ? "drop-shadow(0 1px 8px rgba(255,252,245,0.5))" : isMinimalist ? "none" : "drop-shadow(0 1px 8px rgba(0,0,0,0.4))" }}
            >
              <ChevronDown
                className="w-6 h-6"
                style={{ color: (isMediterranean || isCoastal) ? template.colors.primary : isMinimalist ? template.colors.textMuted : "#FDFBF7" }}
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

