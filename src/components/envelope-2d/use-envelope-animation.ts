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
  totalSequence: 1000,
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

    // Start music when seal breaks (if enabled)
    if (enableMusic && onMusicStart) {
      onMusicStart();
    }

    // Seal breaks, then flap opens
    timeoutRef.current = setTimeout(() => {
      setState("opening");

      // After flap opens, transition to complete
      timeoutRef.current = setTimeout(() => {
        setState("complete");

        // Notify parent that envelope is fully open
        if (onOpen) {
          onOpen();
        }
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
