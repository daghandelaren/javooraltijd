"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { EmbossedInitials } from "./embossed-initials";
import { DEFAULT_SEAL_COLOR, getSealImage } from "@/lib/wax-colors";
import { DEFAULT_SEAL_FONT, type SealFontId } from "@/lib/wax-fonts";

// Seal color type - now accepts any hex color string
export type SealColor = string;

// Re-export default for convenience
export { DEFAULT_SEAL_COLOR };

interface WaxSealProps {
  initials?: string;
  color?: SealColor;
  font?: SealFontId;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  onClick?: () => void;
  isOpen?: boolean;
  className?: string;
  interactive?: boolean;
}

// Size configurations - initials should fit inside the center circle
// Font sizes use ~0.14 ratio to fit properly in the seal's center
const sizeConfig = {
  sm: { size: 80, fontSize: 13 },
  md: { size: 120, fontSize: 20 },
  lg: { size: 160, fontSize: 25 },
  xl: { size: 200, fontSize: 32 },
  "2xl": { size: 280, fontSize: 44 },
  "3xl": { size: 320, fontSize: 51 },
  "4xl": { size: 400, fontSize: 63 },
};

export function WaxSeal({
  initials = "J&J",
  color = DEFAULT_SEAL_COLOR,
  font = DEFAULT_SEAL_FONT,
  size = "lg",
  onClick,
  isOpen = false,
  className,
  interactive = true,
}: WaxSealProps) {
  const config = sizeConfig[size];
  // Use pre-rendered PNG for each color (no CSS filters needed)
  const sealImagePath = getSealImage(color);

  const handleClick = () => {
    if (!interactive) return;
    onClick?.();
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="sealed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0, rotate: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={handleClick}
            disabled={!interactive}
            className={cn(
              "relative block",
              interactive && "cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-burgundy-500"
            )}
            style={{ width: config.size, height: config.size }}
          >
            {/* Seal PNG image - pre-rendered for each color */}
            <img
              src={sealImagePath}
              alt="Wax seal"
              className="w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />

            {/* Embossed initials overlay - SVG lighting-based bevel & emboss */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <EmbossedInitials
                initials={initials}
                color={color}
                size={config.size}
                fontSize={config.fontSize}
                fontId={font}
              />
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="opened"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center text-stone-300"
            style={{ width: config.size, height: config.size }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-1/2 h-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated seal that reveals content
export function WaxSealReveal({
  children,
  initials,
  color,
  font,
  className,
}: {
  children: React.ReactNode;
  initials?: string;
  color?: SealColor;
  font?: SealFontId;
  className?: string;
}) {
  const [isRevealed, setIsRevealed] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="sealed"
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-accent text-2xl text-stone-500"
            >
              Klik om te openen
            </motion.p>
            <WaxSeal
              initials={initials}
              color={color}
              font={font}
              size="xl"
              onClick={() => setIsRevealed(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple non-interactive display seal
export function WaxSealDisplay({
  initials = "E&L",
  color = DEFAULT_SEAL_COLOR,
  font = DEFAULT_SEAL_FONT,
  size = "lg",
  className,
}: Omit<WaxSealProps, "onClick" | "isOpen" | "interactive">) {
  return (
    <WaxSeal
      initials={initials}
      color={color}
      font={font}
      size={size}
      className={className}
      interactive={false}
    />
  );
}
