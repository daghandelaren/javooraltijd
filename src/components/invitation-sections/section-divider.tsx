"use client";

import { cn } from "@/lib/utils";

interface SectionDividerProps {
  style?: "floral" | "geometric" | "botanical";
  color?: string;
  className?: string;
}

export function SectionDivider({
  style = "floral",
  color = "#9AAB8C",
  className,
}: SectionDividerProps) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      {style === "floral" && <FloralDivider color={color} />}
      {style === "geometric" && <GeometricDivider color={color} />}
      {style === "botanical" && <BotanicalDivider color={color} />}
    </div>
  );
}

function FloralDivider({ color }: { color: string }) {
  return (
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
      className="opacity-60"
    >
      {/* Left flourish */}
      <path
        d="M0 20 Q 20 10, 40 20 T 80 20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Center flower */}
      <circle cx="100" cy="20" r="8" fill={color} fillOpacity="0.3" />
      <circle cx="100" cy="20" r="4" fill={color} />
      {/* Petals */}
      <ellipse cx="100" cy="12" rx="3" ry="5" fill={color} fillOpacity="0.5" />
      <ellipse cx="100" cy="28" rx="3" ry="5" fill={color} fillOpacity="0.5" />
      <ellipse cx="92" cy="20" rx="5" ry="3" fill={color} fillOpacity="0.5" />
      <ellipse cx="108" cy="20" rx="5" ry="3" fill={color} fillOpacity="0.5" />
      {/* Right flourish */}
      <path
        d="M120 20 Q 140 30, 160 20 T 200 20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function GeometricDivider({ color }: { color: string }) {
  return (
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
      className="opacity-60"
    >
      {/* Left line */}
      <line x1="10" y1="20" x2="85" y2="20" stroke={color} strokeWidth="1.5" />
      {/* Center diamond */}
      <rect
        x="92"
        y="12"
        width="16"
        height="16"
        transform="rotate(45 100 20)"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="96"
        y="16"
        width="8"
        height="8"
        transform="rotate(45 100 20)"
        fill={color}
      />
      {/* Right line */}
      <line x1="115" y1="20" x2="190" y2="20" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function BotanicalDivider({ color }: { color: string }) {
  return (
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
      className="opacity-60"
    >
      {/* Left branch */}
      <path
        d="M10 20 L 85 20"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M30 20 Q 25 12, 35 8"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M50 20 Q 45 28, 55 32"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M70 20 Q 65 12, 75 8"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      {/* Center leaf cluster */}
      <ellipse cx="100" cy="15" rx="4" ry="8" fill={color} fillOpacity="0.6" />
      <ellipse cx="94" cy="22" rx="4" ry="7" fill={color} fillOpacity="0.5" transform="rotate(-30 94 22)" />
      <ellipse cx="106" cy="22" rx="4" ry="7" fill={color} fillOpacity="0.5" transform="rotate(30 106 22)" />
      <circle cx="100" cy="28" r="3" fill={color} />
      {/* Right branch */}
      <path
        d="M115 20 L 190 20"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M130 20 Q 135 28, 125 32"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M150 20 Q 155 12, 145 8"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M170 20 Q 175 28, 165 32"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
