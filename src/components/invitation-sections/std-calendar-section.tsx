"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { type Template } from "@/lib/templates";

function generateIcsFile(date: Date, partner1: string, partner2: string) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const dateStr = `${y}${m}${d}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JaVoorAltijd//Save the Date//NL",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${dateStr}`,
    `SUMMARY:Bruiloft ${partner1} & ${partner2}`,
    `DESCRIPTION:Save the Date voor de bruiloft van ${partner1} & ${partner2}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return ics;
}

interface StdCalendarSectionProps {
  template: Template;
  weddingDate: Date;
  partner1Name: string;
  partner2Name: string;
}

export function StdCalendarSection({
  template,
  weddingDate,
  partner1Name,
  partner2Name,
}: StdCalendarSectionProps) {
  const handleAddToCalendar = useCallback(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const ics = generateIcsFile(weddingDate, partner1Name, partner2Name);
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } else {
      const pad = (n: number) => n.toString().padStart(2, "0");
      const y = weddingDate.getFullYear();
      const m = pad(weddingDate.getMonth() + 1);
      const d = pad(weddingDate.getDate());
      const dateStr = `${y}${m}${d}`;
      const gcalUrl = new URL("https://calendar.google.com/calendar/render");
      gcalUrl.searchParams.set("action", "TEMPLATE");
      gcalUrl.searchParams.set("text", `Bruiloft ${partner1Name} & ${partner2Name}`);
      gcalUrl.searchParams.set("dates", `${dateStr}/${dateStr}`);
      gcalUrl.searchParams.set("details", `Save the Date voor de bruiloft van ${partner1Name} & ${partner2Name}`);
      window.open(gcalUrl.toString(), "_blank");
    }
  }, [weddingDate, partner1Name, partner2Name]);

  const formattedDate = weddingDate.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="relative py-16 sm:py-20"
      style={{ background: template.colors.backgroundGradient }}
    >
      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px w-16" style={{ backgroundColor: `${template.colors.primary}30` }} />
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: `${template.colors.primary}60` }}
        />
        <div className="h-px w-16" style={{ backgroundColor: `${template.colors.primary}30` }} />
      </div>

      <div className="max-w-sm mx-auto text-center px-6">
        <p
          className="text-2xl sm:text-3xl mb-2"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.accent}', cursive`,
          }}
        >
          Noteer de datum
        </p>
        <p
          className="text-sm capitalize mb-8"
          style={{
            color: template.colors.textMuted,
            fontFamily: `'${template.fonts.body}', serif`,
            letterSpacing: "0.05em",
          }}
        >
          {formattedDate}
        </p>

        <button
          onClick={handleAddToCalendar}
          className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          style={{
            borderColor: `${template.colors.primary}40`,
            backgroundColor: `${template.colors.primary}08`,
          }}
        >
          <CalendarPlus
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            style={{ color: template.colors.primary }}
          />
          <span
            className="text-sm font-medium tracking-wide uppercase"
            style={{
              color: template.colors.text,
              fontFamily: `'${template.fonts.heading}', serif`,
              letterSpacing: "0.12em",
            }}
          >
            Toevoegen aan agenda
          </span>
        </button>
      </div>
    </motion.section>
  );
}
