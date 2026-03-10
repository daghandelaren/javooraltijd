"use client";

import { useEffect, useState } from "react";
import { HeroSection, FloatingMusicToggle, useMusicControl } from "@/components/invitation-sections";
import { useStdBuilderStore, getStdMusicUrl } from "@/stores/std-builder-store";
import { getStdTemplateById, stdTemplates } from "@/lib/std-templates";
import { type SealFontId } from "@/lib/wax-fonts";

export default function StdPreviewFrame() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const {
    templateId,
    partner1Name,
    partner2Name,
    weddingDate,
    headline,
    styling,
    musicConfig,
  } = useStdBuilderStore();

  const musicUrl = getStdMusicUrl(musicConfig) || undefined;

  const selectedTemplate = getStdTemplateById(templateId || "") || stdTemplates[0];
  const weddingDateObj = weddingDate ? new Date(weddingDate) : new Date();

  if (!hydrated) {
    return (
      <div
        style={{
          background: selectedTemplate.colors.backgroundGradient,
          minHeight: "100vh",
        }}
      />
    );
  }

  return (
    <div style={{ background: selectedTemplate.colors.backgroundGradient }}>
      <HeroSection
        partner1Name={partner1Name || "Partner 1"}
        partner2Name={partner2Name || "Partner 2"}
        headline={headline || "Save the Date"}
        weddingDate={weddingDateObj}
        sealColor={styling.sealColor}
        sealFont={styling.sealFont as SealFontId}
        monogram={styling.monogram || undefined}
        template={selectedTemplate}
        isSaveTheDate
      />
      {musicConfig.enabled && musicUrl && (
        <FloatingMusicToggle audioSrc={musicUrl} />
      )}
    </div>
  );
}
