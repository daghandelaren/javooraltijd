"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownDigitProps {
  value: number;
  label: string;
  accentColor?: string;
  variant?: "inline" | "card";
}

export function CountdownDigit({
  value,
  label,
  accentColor = "#722F37",
  variant = "card",
}: CountdownDigitProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevValueRef = useRef(value);

  // Format value to always show 2 digits
  const formattedValue = String(displayValue).padStart(2, "0");

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsFlipping(true);
      // Small delay before changing the number for flip effect
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
        prevValueRef.current = value;
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value]);

  if (variant === "inline") {
    return (
      <div className="flex flex-col items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
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

  // Card variant with flip animation
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg shadow-md",
          "bg-white border border-stone-200",
          "w-16 h-20 md:w-20 md:h-24"
        )}
      >
        {/* Top half background */}
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ backgroundColor: `${accentColor}08` }}
        />

        {/* Middle line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-stone-200 z-10" />

        {/* Number display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={displayValue}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="text-3xl md:text-4xl font-bold tabular-nums"
              style={{ color: accentColor }}
            >
              {formattedValue}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Flip effect overlay during animation */}
        {isFlipping && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent origin-top"
          />
        )}

        {/* Subtle corner accents */}
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
      </div>

      {/* Label */}
      <span className="text-xs md:text-sm text-stone-500 uppercase tracking-wider mt-2 font-medium">
        {label}
      </span>
    </div>
  );
}
