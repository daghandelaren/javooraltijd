"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { useEnvelopeAnimation, ANIMATION_TIMING, type EnvelopeState } from "./use-envelope-animation";
import { type SealFontId } from "@/lib/wax-fonts";

interface Envelope2DProps {
  sealColor: string;
  sealFont?: SealFontId;
  monogram?: string;
  onOpen?: () => void;
  onMusicStart?: () => void;
  enableMusic?: boolean;
  className?: string;
}

export function Envelope2D({
  sealColor,
  sealFont,
  monogram = "J&J",
  onOpen,
  onMusicStart,
  enableMusic = true,
  className,
}: Envelope2DProps) {
  const { state, isInteractive, handleClick } = useEnvelopeAnimation({
    onOpen,
    onMusicStart,
    enableMusic,
  });

  return (
    <AnimatePresence mode="wait">
      {state !== "complete" ? (
        <motion.div
          key="envelope"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn("fixed inset-0 w-full h-screen", className)}
        >
          {/* Full-screen envelope background (body without flap) */}
          <picture className="absolute inset-0">
            <source
              media="(min-width: 768px)"
              srcSet="/images/envelope/under-desktop.png"
            />
            <img
              src="/images/envelope/under-mobile.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </picture>

          {/* Flap - rotates backward */}
          <Flap state={state} />

          {/* Seal - independent, pops toward viewer */}
          <Seal
            state={state}
            sealColor={sealColor}
            sealFont={sealFont}
            monogram={monogram}
            onClick={handleClick}
            isInteractive={isInteractive}
          />

          {/* White fade overlay */}
          <motion.div
            className="fixed inset-0 bg-white pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: state === "fading" ? 1 : 0 }}
            transition={{ duration: ANIMATION_TIMING.fadeToWhite / 1000, ease: "easeInOut" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// Flap - just the flap image with rotation animation
function Flap({ state }: { state: EnvelopeState }) {
  const isOpening = state === "opening" || state === "fading" || state === "complete";
  const flapRotation = isOpening ? -20 : 0;

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20"
      style={{
        perspective: "1000px",
        perspectiveOrigin: "50% 0%",
      }}
    >
      <motion.div
        className="w-full relative"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
        }}
        initial={{ rotateX: 0, filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.10))" }}
        animate={{
          rotateX: flapRotation,
          filter: isOpening
            ? "drop-shadow(4px 8px 6px rgba(0,0,0,0.25))"
            : "drop-shadow(1px 2px 2px rgba(0,0,0,0.10))",
        }}
        transition={{
          duration: ANIMATION_TIMING.flapOpen / 1000,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet="/images/envelope/flap-desktop.png"
          />
          <img
            src="/images/envelope/flap-mobile.png"
            alt=""
            className="w-full h-auto"
            style={{ backfaceVisibility: "hidden" }}
          />
        </picture>
      </motion.div>
    </div>
  );
}

// Seal - independent component with its own "pop out" animation
function Seal({
  state,
  sealColor,
  sealFont,
  monogram,
  onClick,
  isInteractive,
}: {
  state: EnvelopeState;
  sealColor: string;
  sealFont?: SealFontId;
  monogram: string;
  onClick: () => void;
  isInteractive: boolean;
}) {
  const isOpening = state === "opening" || state === "fading" || state === "complete";

  return (
    <div
      className="absolute z-30 left-1/2"
      style={{ top: "54%", transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        style={{ perspective: "1000px" }}
        animate={{
          scale: isOpening ? 1.08 : 1,
          rotateX: isOpening ? 20 : 0,
          y: isOpening ? -15 : 0,
          filter: isOpening
            ? "drop-shadow(4px 12px 20px rgba(0,0,0,0.4))"
            : "drop-shadow(0px 8px 16px rgba(0,0,0,0.3))",
        }}
        transition={{
          duration: 4,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <WaxSeal
          initials={monogram}
          color={sealColor}
          font={sealFont}
          size="4xl"
          interactive={isInteractive}
          onClick={onClick}
        />
      </motion.div>
    </div>
  );
}
