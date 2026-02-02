"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { EnvelopeFlap } from "./envelope-flap";
import { useEnvelopeAnimation, type EnvelopeState } from "./use-envelope-animation";
import { type SealFontId } from "@/lib/wax-fonts";

interface Envelope2DProps {
  sealColor: string;
  sealFont?: SealFontId;
  monogram?: string;
  personalizedText?: string;
  onOpen?: () => void;
  onMusicStart?: () => void;
  enableMusic?: boolean;
  className?: string;
}

export function Envelope2D({
  sealColor,
  sealFont,
  monogram = "J&J",
  personalizedText = "Deze uitnodiging is speciaal voor jou",
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
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-4 py-8",
        "bg-gradient-to-b from-stone-100 via-champagne-50 to-stone-100",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {state !== "complete" ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Instruction text */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: state === "sealed" ? 1 : 0, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-stone-500 mb-6 text-center font-medium"
            >
              Klik op de zegel om te openen
            </motion.p>

            {/* Envelope container */}
            <motion.div
              className="relative w-full max-w-[340px] sm:max-w-[400px]"
              whileHover={isInteractive ? { scale: 1.02 } : undefined}
              transition={{ duration: 0.2 }}
            >
              {/* Envelope body with shadow */}
              <div
                className="relative aspect-[4/3] rounded-sm overflow-visible"
                style={{
                  filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.15))",
                }}
              >
                {/* Main envelope body */}
                <EnvelopeBody state={state} />

                {/* Envelope flap (animated) */}
                <EnvelopeFlap state={state} />

                {/* Wax seal on top of flap */}
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

            {/* Personalized text below envelope */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: state === "sealed" ? 1 : 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center font-accent text-xl text-stone-600 italic"
            >
              {personalizedText}
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// Envelope body component
function EnvelopeBody({ state }: { state: EnvelopeState }) {
  return (
    <div className="absolute inset-0">
      {/* Main cream/kraft paper background */}
      <div
        className="w-full h-full rounded-sm"
        style={{
          background: "linear-gradient(135deg, #F5EDE4 0%, #E8DED4 50%, #DDD2C6 100%)",
        }}
      >
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.04,
            mixBlendMode: "multiply",
          }}
        />

        {/* Inner shadow for depth */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.05), inset 0 -2px 10px rgba(0,0,0,0.03)",
          }}
        />

        {/* Subtle edge highlight */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        />
      </div>

      {/* Bottom fold detail */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.03) 0%, transparent 100%)",
          borderTop: "1px solid rgba(0,0,0,0.03)",
        }}
      />

      {/* Left fold crease */}
      <div
        className="absolute left-0 top-[35%] bottom-0 w-[2px]"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 50%, transparent 100%)",
        }}
      />

      {/* Right fold crease */}
      <div
        className="absolute right-0 top-[35%] bottom-0 w-[2px]"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 50%, transparent 100%)",
        }}
      />
    </div>
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
          className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 z-30"
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
          <motion.button
            onClick={onClick}
            disabled={!isInteractive}
            className={cn(
              "block focus:outline-none focus-visible:ring-4 focus-visible:ring-burgundy-200 rounded-full",
              isInteractive && "cursor-pointer",
            )}
            whileHover={isInteractive ? { scale: 1.05 } : undefined}
            whileTap={isInteractive ? { scale: 0.95 } : undefined}
          >
            <WaxSeal
              initials={monogram}
              color={sealColor}
              font={sealFont}
              size="xl"
              interactive={isInteractive}
            />
          </motion.button>

          {/* Seal break particles effect */}
          {isBreaking && <SealBreakParticles color={sealColor} />}
        </motion.div>
      )}
    </AnimatePresence>
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
