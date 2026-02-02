"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { type SealFontId } from "@/lib/wax-fonts";
import { type Template } from "@/lib/templates";

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
        {template.style === "romantic" && <RomanticBackground color={template.colors.primary} />}
        {template.style === "modern" && <ModernBackground color={template.colors.secondary} />}
        {template.style === "rustic" && <RusticBackground color={template.colors.primary} />}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Wax seal */}
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
            interactive={false}
          />
        </motion.div>

        {/* Headline */}
        {headline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-accent text-2xl sm:text-3xl mb-4"
            style={{
              color: template.colors.textMuted,
              fontFamily: `'${template.fonts.accent}', cursive`,
            }}
          >
            {headline}
          </motion.p>
        )}

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
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

        {/* Date and time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 space-y-2"
        >
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
        </motion.div>
      </div>

      {/* Scroll indicator */}
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
    </section>
  );
}

// Background decorative elements for each style
function RomanticBackground({ color }: { color: string }) {
  return (
    <>
      {/* Soft circles */}
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute bottom-40 right-10 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: color }}
      />
    </>
  );
}

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

function RusticBackground({ color }: { color: string }) {
  return (
    <>
      {/* Organic shapes */}
      <div
        className="absolute top-1/4 -left-20 w-40 h-80 rounded-full blur-2xl opacity-10 rotate-45"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute bottom-1/4 -right-10 w-32 h-64 rounded-full blur-2xl opacity-10 -rotate-12"
        style={{ backgroundColor: color }}
      />
    </>
  );
}
