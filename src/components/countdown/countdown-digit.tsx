"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownDigitProps {
  value: number;
  label: string;
  accentColor?: string;
  variant?: "inline" | "card";
  theme?: "botanical" | "mediterranean" | "coastal";
  compact?: boolean;
}

export function CountdownDigit({
  value,
  label,
  accentColor = "#333D2C",
  variant = "card",
  theme,
  compact = false,
}: CountdownDigitProps) {
  // Format value to always show 2 digits
  const formattedValue = String(value).padStart(2, "0");

  if (variant === "inline") {
    return (
      <div className="flex flex-col items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formattedValue}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-semibold tabular-nums"
            style={{ color: accentColor }}
          >
            {formattedValue}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs text-stone-500 uppercase tracking-wide mt-1">
          {label}
        </span>
      </div>
    );
  }

  const isBotanical = theme === "botanical";
  const isMediterranean = theme === "mediterranean";

  // Card variant with flip animation
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg",
          isBotanical
            ? compact ? "w-20 h-24" : "w-20 h-24 md:w-28 md:h-32"
            : isMediterranean
            ? compact ? "w-20 h-24" : "w-20 h-24 md:w-28 md:h-32"
            : compact ? "w-16 h-20 shadow-md bg-white border border-stone-200" : "w-16 h-20 md:w-20 md:h-24 shadow-md bg-white border border-stone-200"
        )}
        style={isBotanical ? {
          backgroundColor: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
        } : isMediterranean ? {
          backgroundColor: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
        } : undefined}
      >
        {/* Top half background — default only */}
        {!isBotanical && !isMediterranean && (
          <div
            className="absolute inset-x-0 top-0 h-1/2"
            style={{ backgroundColor: `${accentColor}08` }}
          />
        )}

        {/* Middle line */}
        {!isBotanical && !isMediterranean && (
          <div className="absolute inset-x-0 top-1/2 h-px bg-stone-200 z-10" />
        )}
        {isBotanical && (
          <div className="absolute inset-x-0 top-1/2 h-px z-10" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
        )}
        {isMediterranean && (
          <div className="absolute inset-x-0 top-1/2 h-px z-10" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
        )}

        {/* Number display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={value}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "font-bold tabular-nums",
                (isBotanical || isMediterranean)
                  ? compact ? "text-4xl" : "text-4xl md:text-5xl"
                  : compact ? "text-3xl" : "text-3xl md:text-4xl"
              )}
              style={{ color: (isBotanical || isMediterranean) ? "#FDFBF7" : accentColor }}
            >
              {formattedValue}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle corner accents — default only */}
        {!isBotanical && !isMediterranean && (
          <>
            <div
              className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 rounded-tl-lg"
              style={{ borderColor: accentColor }}
            />
            <div
              className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 rounded-tr-lg"
              style={{ borderColor: accentColor }}
            />
            <div
              className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 rounded-bl-lg"
              style={{ borderColor: accentColor }}
            />
            <div
              className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 rounded-br-lg"
              style={{ borderColor: accentColor }}
            />
          </>
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          compact ? "text-xs uppercase tracking-wider mt-2 font-medium" : "text-xs md:text-sm uppercase tracking-wider mt-2 font-medium",
          !isBotanical && !isMediterranean && "text-stone-500"
        )}
        style={isBotanical ? { color: "rgba(253,251,247,0.8)" } : isMediterranean ? { color: "rgba(253,251,247,0.8)" } : undefined}
      >
        {label}
      </span>
    </div>
  );
}
