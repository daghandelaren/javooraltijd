"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/countdown";
import { type Template } from "@/lib/templates";

interface CountdownSectionProps {
  weddingDate: Date;
  template: Template;
  className?: string;
  compact?: boolean;
}

export function CountdownSection({
  weddingDate,
  template,
  className,
  compact = false,
}: CountdownSectionProps) {
  const isBotanical = template.style === "botanical";
  const isMediterranean = template.style === "mediterranean";
  const isCoastal = template.style === "coastal";
  const isMinimalist = template.style === "minimalist";
  const isDarkCountdown = isBotanical || isMediterranean || isCoastal || isMinimalist;

  return (
    <section
      className={cn(
        isDarkCountdown ? "py-16 px-4 sm:py-20" : "py-16 px-4",
        className
      )}
      style={{
        background: isBotanical
          ? "#4A5D4A"
          : isMediterranean
          ? template.colors.text
          : isCoastal
          ? "#C4A47C"
          : isMinimalist
          ? "#3D3D3D"
          : template.colors.background,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto text-center"
      >
        <h2
          className={cn("font-heading text-2xl sm:text-3xl mb-2", isMinimalist && "font-light tracking-wide")}
          style={{
            color: isDarkCountdown ? "#FDFBF7" : template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          Nog even geduld...
        </h2>
        <p
          className="text-sm mb-8"
          style={{ color: isDarkCountdown ? "rgba(253,251,247,0.7)" : template.colors.textMuted }}
        >
          Tot de grote dag
        </p>

        <CountdownTimer
          targetDate={weddingDate}
          accentColor={isDarkCountdown ? "#FDFBF7" : template.colors.primary}
          variant="card"
          theme={isBotanical ? "botanical" : (isMediterranean || isCoastal || isMinimalist) ? "mediterranean" : undefined}
          compact={compact}
        />

      </motion.div>
    </section>
  );
}
