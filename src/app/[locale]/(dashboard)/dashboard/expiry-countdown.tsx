"use client";

import { Clock } from "lucide-react";

interface Props {
  expiresAt: string | null;
}

export function ExpiryCountdown({ expiresAt }: Props) {
  if (!expiresAt) return null;

  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg">
        <Clock className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-700 font-medium">Verlopen</span>
      </div>
    );
  }

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  const isWarning = totalDays < 30;

  let text = "";
  if (months > 0 && days > 0) {
    text = `Nog ${months} ${months === 1 ? "maand" : "maanden"} en ${days} ${days === 1 ? "dag" : "dagen"} online`;
  } else if (months > 0) {
    text = `Nog ${months} ${months === 1 ? "maand" : "maanden"} online`;
  } else {
    text = `Nog ${days} ${days === 1 ? "dag" : "dagen"} online`;
  }

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${
        isWarning
          ? "bg-amber-50 border-amber-200"
          : "bg-olive-50 border-olive-200"
      }`}
    >
      <Clock className={`w-4 h-4 ${isWarning ? "text-amber-500" : "text-olive-600"}`} />
      <span className={`text-sm font-medium ${isWarning ? "text-amber-700" : "text-olive-700"}`}>
        {text}
      </span>
    </div>
  );
}
