"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CountdownDigit } from "./countdown-digit";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  accentColor?: string;
  variant?: "inline" | "card";
  className?: string;
  showSeconds?: boolean;
  theme?: "botanical" | "mediterranean";
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

export function CountdownTimer({
  targetDate,
  accentColor = "#333D2C",
  variant = "card",
  className,
  showSeconds = true,
  theme,
  compact = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );
  const [mounted, setMounted] = useState(false);

  // Ensure date is a Date object
  const target = useMemo(() => {
    return targetDate instanceof Date ? targetDate : new Date(targetDate);
  }, [targetDate]);

  useEffect(() => {
    setMounted(true);

    // Update immediately
    setTimeLeft(calculateTimeLeft(target));

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn("flex items-center justify-center", compact ? "gap-3" : "gap-3 md:gap-4", className)}
      >
        {/* Placeholder during SSR */}
        {[...Array(showSeconds ? 4 : 3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={cn(
                "rounded-lg bg-stone-100 animate-pulse",
                variant === "card" ? (compact ? "w-16 h-20" : "w-16 h-20 md:w-20 md:h-24") : "w-10 h-8"
              )}
            />
            <div className="w-8 h-3 bg-stone-100 rounded mt-2 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Show special message if date has passed
  if (timeLeft.isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center", className)}
      >
        <p className="text-lg font-heading" style={{ color: accentColor }}>
          De grote dag is aangebroken!
        </p>
      </motion.div>
    );
  }

  const separatorClass = cn(
    "text-2xl md:text-3xl font-light",
    variant === "card" ? "mx-1" : "mx-2"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex items-center justify-center",
        variant === "card" ? (compact ? "gap-2" : "gap-2 md:gap-3") : "gap-4 md:gap-6",
        className
      )}
    >
      <CountdownDigit
        value={timeLeft.days}
        label="Dagen"
        accentColor={accentColor}
        variant={variant}
        theme={theme}
        compact={compact}
      />

      {variant === "inline" && (
        <span className={separatorClass} style={{ color: accentColor }}>
          :
        </span>
      )}

      <CountdownDigit
        value={timeLeft.hours}
        label="Uren"
        accentColor={accentColor}
        variant={variant}
        theme={theme}
        compact={compact}
      />

      {variant === "inline" && (
        <span className={separatorClass} style={{ color: accentColor }}>
          :
        </span>
      )}

      <CountdownDigit
        value={timeLeft.minutes}
        label="Minuten"
        accentColor={accentColor}
        variant={variant}
        theme={theme}
        compact={compact}
      />

      {showSeconds && (
        <>
          {variant === "inline" && (
            <span className={separatorClass} style={{ color: accentColor }}>
              :
            </span>
          )}

          <CountdownDigit
            value={timeLeft.seconds}
            label="Seconden"
            accentColor={accentColor}
            variant={variant}
            theme={theme}
            compact={compact}
          />
        </>
      )}
    </motion.div>
  );
}
