"use client";

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

  return (
    <AnimatePresence mode="wait">
      {state !== "complete" ? (
        <motion.div
          key="envelope"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn("fixed inset-0 w-full h-screen overflow-hidden", className)}
          style={{ backgroundColor: "#E8DFD4" }}
        >
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
  const flapY = isOpening ? -23 : 0;

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20"
    >
      <motion.div
        className="w-full relative"
        initial={{ y: 0, filter: "drop-shadow(8px 6px 3px rgba(0,0,0,0.28))" }}
        animate={{
          y: flapY,
          filter: isOpening
            ? [
                "drop-shadow(8px 6px 3px rgba(0,0,0,0.28))",
                "drop-shadow(50px 10px 30px rgba(0,0,0,0.45))",
                "drop-shadow(110px 6px 60px rgba(0,0,0,0.45))",
                "drop-shadow(160px 3px 80px rgba(0,0,0,0.4))",
              ]
            : "drop-shadow(8px 6px 3px rgba(0,0,0,0.28))",
        }}
        transition={{
          y: {
            duration: 1.5,
            ease: "linear",
          },
          filter: {
            duration: 2.2,
            ease: "linear",
            times: [0, 0.25, 0.6, 1],
          },
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
    <div
      className="absolute z-30 left-1/2 -translate-x-1/2 -translate-y-1/2 top-[103vw] md:top-[34.5vw] scale-[0.7] md:scale-100"
    >
      <motion.div
        className="relative"
        animate={{ y: isOpening ? -23 : 0 }}
        transition={{ y: { duration: 1.5, ease: "linear" } }}
      >
        {sealText && (
          <p
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap select-none pointer-events-none"
            style={{
              bottom: "calc(100% + 0.25rem)",
              fontFamily: getSealFontCss(sealFont ?? "lavishly-yours"),
              fontSize: "4rem",
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
          animate={{
            filter: isOpening
              ? [
                  "drop-shadow(6px 6px 8px rgba(0,0,0,0.6))",
                  "drop-shadow(18px 14px 24px rgba(0,0,0,0.6))",
                  "drop-shadow(35px 22px 50px rgba(0,0,0,0.55))",
                  "drop-shadow(50px 30px 70px rgba(0,0,0,0.5))",
                ]
              : "drop-shadow(6px 6px 8px rgba(0,0,0,0.6))",
          }}
          transition={{
            filter: { duration: 2.2, ease: "linear", times: [0, 0.25, 0.6, 1] },
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
      </motion.div>
    </div>
  );
}
