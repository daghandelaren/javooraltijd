"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { useEnvelopeAnimation, ANIMATION_TIMING, type EnvelopeState } from "./use-envelope-animation";
import { type SealFontId, getSealFontCss } from "@/lib/wax-fonts";

interface Envelope2DProps {
  sealColor: string;
  sealFont?: SealFontId;
  monogram?: string;
  sealText?: string;
  onOpen?: () => void;
  onMusicStart?: () => void;
  enableMusic?: boolean;
  className?: string;
}

export function Envelope2D({
  sealColor,
  sealFont,
  monogram = "J&B",
  sealText,
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

  // Lock body scroll while envelope is visible
  useEffect(() => {
    if (state !== "complete") {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  return (
    <AnimatePresence mode="wait">
      {state !== "complete" ? (
        <motion.div
          key="envelope"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.53 }}
          className={cn("fixed inset-0 w-full h-screen overflow-hidden", className)}
          style={{ backgroundColor: "#E8DFD4" }}
        >
          {/* Zoom wrapper — scales up on desktop for a closer crop */}
          <div className="absolute inset-0 md:scale-[1.35] md:origin-center md:translate-y-[6%]">
            {/* Full-screen envelope background (body without flap) */}
            <picture className="absolute top-0 left-0 w-full">
              <source
                media="(min-width: 768px)"
                srcSet="/images/envelope/under-desktop.png"
              />
              <img
                src="/images/envelope/under-mobile.png"
                alt=""
                className="w-full h-auto block"
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
              sealText={sealText}
              onClick={handleClick}
              isInteractive={isInteractive}
            />
          </div>

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

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20"
    >
      <motion.div
        className="w-full relative"
        initial={false}
        animate={{
          y: isOpening ? -60 : 0,
          filter: isOpening
            ? "drop-shadow(6px 200px 20px rgba(90,50,20,0))"
            : "drop-shadow(6px 3px 16px rgba(90,50,20,0.55))",
        }}
        transition={{
          y: { duration: 3.0, ease: "easeIn" },
          filter: { duration: 3.0, ease: "easeIn" },
        }}
      >
        <picture className="block w-full">
          <source
            media="(min-width: 768px)"
            srcSet="/images/envelope/flap-desktop.png"
          />
          <img
            src="/images/envelope/flap-mobile.png"
            alt=""
            className="w-full h-auto block"
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
  sealText,
  onClick,
  isInteractive,
}: {
  state: EnvelopeState;
  sealColor: string;
  sealFont?: SealFontId;
  monogram: string;
  sealText?: string;
  onClick: () => void;
  isInteractive: boolean;
}) {
  const isOpening = state === "opening" || state === "fading" || state === "complete";

  return (
    <div className="absolute z-30 left-1/2 -translate-x-1/2 -translate-y-1/2 top-[87.5vw] md:top-[26vw]">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isOpening ? -60 : 0 }}
        transition={{ y: { duration: 3.0, ease: "easeIn" } }}
      >
        <div className="relative scale-[0.65] md:scale-[0.9]">
        {sealText && (
          <p
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap select-none pointer-events-none"
            style={{
              bottom: "calc(100% + 0.75rem)",
              fontFamily: getSealFontCss(sealFont ?? "lavishly-yours"),
              fontSize: "3.5rem",
              color: "rgba(90, 78, 65, 0.45)",
              filter: "blur(0.5px)",
              textShadow:
                "0 1px 1px rgba(255, 255, 255, 0.5), 0 -1px 1px rgba(60, 50, 40, 0.12), 1px 0 1px rgba(255, 255, 255, 0.25), -1px 0 1px rgba(60, 50, 40, 0.06)",
              letterSpacing: "0.02em",
            }}
          >
            {sealText}
          </p>
        )}
        <motion.div
          initial={false}
          animate={{
            filter: isOpening
              ? "drop-shadow(6px 200px 22px rgba(70,42,18,0))"
              : "drop-shadow(6px 8px 10px rgba(70,42,18,0.45))",
          }}
          transition={{
            filter: { duration: 3.0, ease: "easeIn" },
          }}
        >
          <WaxSeal
            initials={monogram}
            color={sealColor}
            font={sealFont}
            size="4xl"
            blur={0.5}
            interactive={isInteractive}
            onClick={onClick}
          />
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
