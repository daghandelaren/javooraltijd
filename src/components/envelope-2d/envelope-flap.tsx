"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type EnvelopeState } from "./use-envelope-animation";

interface EnvelopeFlapProps {
  state: EnvelopeState;
  className?: string;
}

export function EnvelopeFlap({ state, className }: EnvelopeFlapProps) {
  const isOpening = state === "opening" || state === "sliding" || state === "complete";

  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 z-20",
        "origin-top",
        className
      )}
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
        animate={{
          rotateX: isOpening ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1], // Custom easing for realistic motion
        }}
      >
        {/* Flap outer side (visible when closed) */}
        <div
          className="w-full relative"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {/* Triangle flap shape using CSS clip-path */}
          <div
            className="w-full h-0 pb-[35%] relative"
            style={{
              background: "linear-gradient(180deg, #E8DED4 0%, #DDD2C6 100%)",
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              boxShadow: "inset 0 -2px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* Paper texture overlay */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.03,
              }}
            />
            {/* Subtle fold line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)",
              }}
            />
          </div>
        </div>

        {/* Flap inner side (visible when open) */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          <div
            className="w-full h-0 pb-[35%] relative"
            style={{
              background: "linear-gradient(0deg, #F5EDE4 0%, #EDE3D8 100%)",
              clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
            }}
          >
            {/* Inner texture */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.02,
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
