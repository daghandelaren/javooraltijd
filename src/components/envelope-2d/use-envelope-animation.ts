"use client";

import { useState, useCallback, useRef } from "react";

export type EnvelopeState = "sealed" | "breaking" | "opening" | "sliding" | "complete";

interface UseEnvelopeAnimationOptions {
  onOpen?: () => void;
  onMusicStart?: () => void;
  enableMusic?: boolean;
}

interface UseEnvelopeAnimationReturn {
  state: EnvelopeState;
  isInteractive: boolean;
  handleClick: () => void;
  reset: () => void;
}

// Animation timing (in ms)
export const ANIMATION_TIMING = {
  sealBreak: 400,
  flapOpen: 600,
  cardSlide: 800,
  totalSequence: 1800, // Sum of all animations
};

export function useEnvelopeAnimation(
  options: UseEnvelopeAnimationOptions = {}
): UseEnvelopeAnimationReturn {
  const { onOpen, onMusicStart, enableMusic = true } = options;
  const [state, setState] = useState<EnvelopeState>("sealed");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (state !== "sealed") return;

    // Start animation sequence
    setState("breaking");

    // Seal breaks
    timeoutRef.current = setTimeout(() => {
      setState("opening");

      // Flap opens
      timeoutRef.current = setTimeout(() => {
        setState("sliding");

        // Start music when card starts sliding (if enabled)
        if (enableMusic && onMusicStart) {
          onMusicStart();
        }

        // Card slides out
        timeoutRef.current = setTimeout(() => {
          setState("complete");

          // Notify parent that envelope is fully open
          if (onOpen) {
            onOpen();
          }
        }, ANIMATION_TIMING.cardSlide);
      }, ANIMATION_TIMING.flapOpen);
    }, ANIMATION_TIMING.sealBreak);
  }, [state, onOpen, onMusicStart, enableMusic]);

  const reset = useCallback(() => {
    clearTimeouts();
    setState("sealed");
  }, [clearTimeouts]);

  return {
    state,
    isInteractive: state === "sealed",
    handleClick,
    reset,
  };
}
