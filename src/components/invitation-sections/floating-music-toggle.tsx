"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingMusicToggleProps {
  audioSrc?: string;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  autoPlay?: boolean;
  className?: string;
}

export function FloatingMusicToggle({
  audioSrc,
  audioRef: externalAudioRef,
  autoPlay = false,
  className,
}: FloatingMusicToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const internalAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRefToUse = externalAudioRef || internalAudioRef;

  // Initialize audio element only when no external ref is provided
  useEffect(() => {
    if (externalAudioRef || !audioSrc) return;

    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.5;
    internalAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioSrc, externalAudioRef]);

  // Sync isPlaying state with external audio that may already be playing
  useEffect(() => {
    const audio = audioRefToUse.current;
    if (!audio) return;

    // Check initial state
    if (!audio.paused) {
      setIsPlaying(true);
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioRefToUse]);

  // Show button after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle autoplay trigger (e.g., after envelope opens)
  const startPlayback = useCallback(async () => {
    const audio = audioRefToUse.current;
    if (!audio) return;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      // Autoplay was blocked by browser
      console.log("Autoplay blocked, user must interact first");
    }
  }, [audioRefToUse]);

  // Expose startPlayback to parent if needed
  useEffect(() => {
    if (autoPlay && audioSrc && !externalAudioRef) {
      startPlayback();
    }
  }, [autoPlay, audioSrc, externalAudioRef, startPlayback]);

  const togglePlayback = async () => {
    const audio = audioRefToUse.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
    }
  };

  // Don't render if no audio source and no external ref
  if (!audioSrc && !externalAudioRef) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayback}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-12 h-12 rounded-full",
            "bg-white/90 backdrop-blur-sm shadow-lg",
            "flex items-center justify-center",
            "border border-stone-200",
            "transition-colors hover:bg-white",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-olive-500 focus-visible:ring-offset-2",
            className
          )}
          title={isPlaying ? "Pauzeer muziek" : "Speel muziek af"}
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: isPlaying ? [0, 5, -5, 0] : 0 }}
            transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-olive-700" />
            ) : (
              <VolumeX className="w-5 h-5 text-stone-500" />
            )}
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Hook to control music playback from parent component
export function useMusicControl(audioSrc?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioSrc) return;

    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioSrc]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch (error) {
      console.log("Playback failed:", error);
      return false;
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  return { isPlaying, play, pause, toggle, audioRef };
}
