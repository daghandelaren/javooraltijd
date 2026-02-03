"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { useEnvelopeAnimation, type EnvelopeState } from "./use-envelope-animation";
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
          {/* Full-screen envelope background */}
          <picture className="absolute inset-0">
            <source
              media="(min-width: 768px)"
              srcSet="/images/envelope/envelope-desktop.png"
            />
            <img
              src="/images/envelope/envelope-mobile.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </picture>

          {/* Flap image with 3D opening animation */}
          <FlapImage state={state} />

          {/* Seal positioned at flap fold intersection */}
          <div
            className="absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2 z-30"
            style={{
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
            }}
          >
            <SealOverlay
              state={state}
              sealColor={sealColor}
              sealFont={sealFont}
              monogram={monogram}
              onClick={handleClick}
              isInteractive={isInteractive}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// Wax seal overlay component
function SealOverlay({
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
  const isBreaking = state === "breaking";
  const isVisible = state === "sealed" || state === "breaking";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative"
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: isBreaking ? [1, 1.1, 0.8] : 1,
            opacity: isBreaking ? [1, 1, 0] : 1,
            rotate: isBreaking ? [0, 5, -5, 0] : 0,
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{
            duration: isBreaking ? 0.4 : 0.3,
            ease: "easeOut",
          }}
        >
          <WaxSeal
            initials={monogram}
            color={sealColor}
            font={sealFont}
            size="3xl"
            interactive={isInteractive}
            onClick={onClick}
          />

          {/* Seal break particles effect */}
          {isBreaking && <SealBreakParticles color={sealColor} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Flap image with 3D opening animation
function FlapImage({ state }: { state: EnvelopeState }) {
  const isOpening = state === "opening" || state === "complete";

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
      style={{
        perspective: "1000px",
        perspectiveOrigin: "50% 0%",
      }}
    >
      <motion.div
        className="w-full"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
        }}
        initial={{ rotateX: 0 }}
        animate={{ rotateX: isOpening ? -180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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

// Decorative particles when seal breaks
function SealBreakParticles({ color }: { color: string }) {
  const particles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const distance = 60 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 0.8 }}
            animate={{
              x,
              y,
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: Math.random() * 0.1,
            }}
          />
        );
      })}
    </div>
  );
}
