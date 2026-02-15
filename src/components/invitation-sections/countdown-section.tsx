"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/countdown";
import { SectionDivider } from "./section-divider";
import { type Template } from "@/lib/templates";

interface CountdownSectionProps {
  weddingDate: Date;
  template: Template;
  className?: string;
}

export function CountdownSection({
  weddingDate,
  template,
  className,
}: CountdownSectionProps) {
  const isBotanical = template.style === "botanical";
  const isMediterranean = template.style === "mediterranean";
  const isCoastal = template.style === "coastal";
  const isDarkCountdown = isBotanical || isMediterranean || isCoastal;

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
          ? template.colors.accent
          : isCoastal
          ? "#C4A47C"
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
          className="font-heading text-2xl sm:text-3xl mb-2"
          style={{
            color: (isBotanical || isCoastal) ? "#FDFBF7" : template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          Nog even geduld...
        </h2>
        <p
          className="text-sm mb-8"
          style={{ color: (isBotanical || isCoastal) ? "rgba(253,251,247,0.7)" : template.colors.textMuted }}
        >
          Tot de grote dag
        </p>

        <CountdownTimer
          targetDate={weddingDate}
          accentColor={(isBotanical || isCoastal) ? "#FDFBF7" : template.colors.primary}
          variant="card"
          showSeconds={false}
          theme={isBotanical ? "botanical" : (isMediterranean || isCoastal) ? "mediterranean" : undefined}
        />

        <SectionDivider
          style={template.dividerStyle}
          color={template.colors.primary}
          className="mt-8"
        />
      </motion.div>
    </section>
  );
}
