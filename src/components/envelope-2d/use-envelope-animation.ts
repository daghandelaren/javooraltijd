"use client";

import { useState, useCallback, useRef } from "react";

export type EnvelopeState = "sealed" | "opening" | "fading" | "complete";

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
  flapOpen: 4000,       // Full flap animation duration
  fadeStart: 1000,      // Wait 1 second before starting fade
  fadeToWhite: 400,     // Fade duration (0.4 seconds)
  totalSequence: 1400,  // Total time before complete (1s delay + 0.4s fade)
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

    // Start animation sequence - flap begins opening
    setState("opening");

    // Start music when animation begins (if enabled)
    if (enableMusic && onMusicStart) {
      onMusicStart();
    }

    // Start fade at 2s (while flap still moving)
    timeoutRef.current = setTimeout(() => {
      setState("fading");

      // After fade completes (at 3s total), transition to complete
      timeoutRef.current = setTimeout(() => {
        setState("complete");

        // Notify parent that envelope is fully open
        if (onOpen) {
          onOpen();
        }
      }, ANIMATION_TIMING.fadeToWhite);
    }, ANIMATION_TIMING.fadeStart);
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
