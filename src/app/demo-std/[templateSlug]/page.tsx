"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStdTemplateBySlug } from "@/lib/std-templates";
import { Envelope2D } from "@/components/envelope-2d";
import { HeroSection, FloatingMusicToggle, useMusicControl, StdCalendarSection } from "@/components/invitation-sections";


const demoData: Record<string, { partner1: string; partner2: string; monogram: string; musicUrl: string }> = {
  "std-watercolor-villa": { partner1: "Thomas", partner2: "Suzanna", monogram: "T&S", musicUrl: "/music/romantic-piano.mp3" },
  "std-limoncello": { partner1: "Jarno", partner2: "Bryonie", monogram: "J&B", musicUrl: "/music/wedding-serenade.mp3" },
  "std-minimalist": { partner1: "Ian", partner2: "Indy", monogram: "I&I", musicUrl: "/music/eternal-love.mp3" },
};

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

            <StdCalendarSection
              template={template}
              weddingDate={weddingDate}
              partner1Name={data.partner1}
              partner2Name={data.partner2}
            />

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
