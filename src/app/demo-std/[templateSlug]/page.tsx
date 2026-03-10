"use client";

import { useState, useCallback } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStdTemplateBySlug, stdTemplates } from "@/lib/std-templates";
import { Envelope2D } from "@/components/envelope-2d";
import { HeroSection, FloatingMusicToggle, useMusicControl } from "@/components/invitation-sections";
import { type SealFontId } from "@/lib/wax-fonts";

const demoData: Record<string, { partner1: string; partner2: string; monogram: string; musicUrl: string }> = {
  "std-watercolor-villa": { partner1: "Thomas", partner2: "Suzanna", monogram: "T&S", musicUrl: "/music/romantic-piano.mp3" },
  "std-limoncello": { partner1: "Jarno", partner2: "Bryonie", monogram: "J&B", musicUrl: "/music/wedding-serenade.mp3" },
  "std-minimalist": { partner1: "Ian", partner2: "Indy", monogram: "I&I", musicUrl: "/music/eternal-love.mp3" },
};

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

export default function DemoStdPage() {
  const { templateSlug } = useParams<{ templateSlug: string }>();
  const [isOpened, setIsOpened] = useState(false);

  const template = getStdTemplateBySlug(templateSlug);
  if (!template) {
    notFound();
  }

  const data = demoData[templateSlug] || demoData["std-minimalist"];
  const weddingDate = new Date("2026-06-15");
  const { audioRef, play: playMusic } = useMusicControl(data.musicUrl);

  const sealText = weddingDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleAddToCalendar = useCallback(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile: open .ics to trigger native calendar app
      const ics = generateIcsFile(weddingDate, data.partner1, data.partner2);
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } else {
      // Desktop: open Google Calendar directly
      const pad = (n: number) => n.toString().padStart(2, "0");
      const y = weddingDate.getFullYear();
      const m = pad(weddingDate.getMonth() + 1);
      const d = pad(weddingDate.getDate());
      const dateStr = `${y}${m}${d}`;
      const gcalUrl = new URL("https://calendar.google.com/calendar/render");
      gcalUrl.searchParams.set("action", "TEMPLATE");
      gcalUrl.searchParams.set("text", `Bruiloft ${data.partner1} & ${data.partner2}`);
      gcalUrl.searchParams.set("dates", `${dateStr}/${dateStr}`);
      gcalUrl.searchParams.set("details", `Save the Date voor de bruiloft van ${data.partner1} & ${data.partner2}`);
      window.open(gcalUrl.toString(), "_blank");
    }
  }, [weddingDate, data.partner1, data.partner2]);

  const formattedDate = weddingDate.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen relative">
      {!isOpened ? (
        <Envelope2D
          sealColor={template.sealColor}
          sealFont="lavishly-yours"
          monogram={data.monogram}
          sealText={sealText}
          onOpen={() => setIsOpened(true)}
          enableMusic={true}
          onMusicStart={playMusic}
        />
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ background: template.colors.backgroundGradient }}
          >
            <HeroSection
              partner1Name={data.partner1}
              partner2Name={data.partner2}
              headline="Save the Date"
              weddingDate={weddingDate}
              sealColor={template.sealColor}
              sealFont={"lavishly-yours"}
              monogram={data.monogram}
              template={template}
              isSaveTheDate
            />

            <FloatingMusicToggle audioRef={audioRef} />

            {/* Add to Calendar section */}
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

            {/* CTA section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="relative py-14 sm:py-16"
              style={{
                background: `linear-gradient(180deg, ${template.colors.background}00 0%, ${template.colors.primary}0A 50%, ${template.colors.background}00 100%)`,
              }}
            >
              <div className="max-w-sm mx-auto text-center px-6">
                <p
                  className="text-sm mb-1.5"
                  style={{
                    color: template.colors.textMuted,
                    fontFamily: `'${template.fonts.body}', serif`,
                  }}
                >
                  Dit is een demo van
                </p>
                <p
                  className="text-lg mb-6"
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.accent}', cursive`,
                  }}
                >
                  &ldquo;{template.name}&rdquo;
                </p>

                <Link href={`/std-builder/template?selected=${template.slug}`}>
                  <Button
                    className="rounded-full px-8 py-3 h-auto text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{
                      backgroundColor: template.colors.primary,
                      color: "#FFFFFF",
                      fontFamily: `'${template.fonts.heading}', serif`,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Maak je eigen Save the Date
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Bottom spacing */}
              <div className="h-8" />
            </motion.section>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
