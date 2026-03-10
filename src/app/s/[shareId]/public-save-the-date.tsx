"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type SealFontId } from "@/lib/wax-fonts";
import { getStdTemplateById, stdTemplates } from "@/lib/std-templates";
import { Envelope2D } from "@/components/envelope-2d";
import { HeroSection, FloatingMusicToggle, useMusicControl } from "@/components/invitation-sections";

interface SaveTheDateData {
  id: string;
  templateId: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  headline: string | null;
  sealColor: string;
  sealFont: string;
  monogram: string | null;
  envelopeEnabled: boolean;
  envelopeColor: string;
  envelopeLiner: string;
  envelopePersonalizedText: string | null;
  musicEnabled?: boolean;
  musicUrl?: string | null;
}

interface Props {
  saveTheDate: SaveTheDateData;
}

export function PublicSaveTheDate({ saveTheDate }: Props) {
  const [isOpened, setIsOpened] = useState(!saveTheDate.envelopeEnabled);
  const [viewTracked, setViewTracked] = useState(false);

  const template = getStdTemplateById(saveTheDate.templateId) || stdTemplates[0];
  const weddingDate = new Date(saveTheDate.weddingDate);
  const displayMonogram = saveTheDate.monogram || `${saveTheDate.partner1Name.charAt(0)}&${saveTheDate.partner2Name.charAt(0)}`;
  const hasMusicEnabled = saveTheDate.musicEnabled && !!saveTheDate.musicUrl;
  const { audioRef, play: playMusic } = useMusicControl(
    hasMusicEnabled ? saveTheDate.musicUrl! : undefined
  );

  const sealText = weddingDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Track view on open
  useEffect(() => {
    if (isOpened && !viewTracked) {
      setViewTracked(true);
      fetch(`/api/save-the-date/${saveTheDate.id}/view`, {
        method: "POST",
      }).catch(() => {});
    }
  }, [isOpened, viewTracked, saveTheDate.id]);

  if (!isOpened) {
    return (
      <Envelope2D
        sealColor={saveTheDate.sealColor}
        sealFont={saveTheDate.sealFont as SealFontId}
        monogram={displayMonogram}
        sealText={sealText}
        onOpen={() => setIsOpened(true)}
        enableMusic={hasMusicEnabled}
        onMusicStart={playMusic}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ background: template.colors.backgroundGradient }}
        className="min-h-screen"
      >
        <HeroSection
          partner1Name={saveTheDate.partner1Name}
          partner2Name={saveTheDate.partner2Name}
          headline={saveTheDate.headline || "Save the Date"}
          weddingDate={weddingDate}
          sealColor={saveTheDate.sealColor}
          sealFont={saveTheDate.sealFont as SealFontId}
          monogram={saveTheDate.monogram || undefined}
          template={template}
          isSaveTheDate
        />

        {hasMusicEnabled && (
          <FloatingMusicToggle audioRef={audioRef} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
