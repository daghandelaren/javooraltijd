"use client";

import { useEffect, useState } from "react";
import {
  HeroSection,
  CountdownSection,
  LocationSection,
  TimelineSection,
  DresscodeSection,
  FAQSection,
  GiftSection,
  RSVPSection,
  ClosingSection,
} from "@/components/invitation-sections";
import { useBuilderStore } from "@/stores/builder-store";
import { getTemplateById, templates } from "@/lib/templates";
import { type SealFontId } from "@/lib/wax-fonts";

export default function InvitationPreviewFrame() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const {
    templateId,
    partner1Name,
    partner2Name,
    weddingDate,
    weddingTime,
    headline,
    dresscode,
    dresscodeColors,
    locations,
    timeline,
    faqItems,
    giftConfig,
    styling,
    rsvpConfig,
    selectedPlan,
  } = useBuilderStore();

  const effectiveFields = {
    ...rsvpConfig.fields,
    dietary: selectedPlan === "basic" ? false : rsvpConfig.fields.dietary,
    message: selectedPlan === "premium" ? rsvpConfig.fields.message : false,
  };

  const selectedTemplate = getTemplateById(templateId || "") || templates[0];
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
        headline={headline || undefined}
        weddingDate={weddingDateObj}
        weddingTime={weddingTime || undefined}
        sealColor={styling.sealColor}
        sealFont={styling.sealFont as SealFontId}
        monogram={styling.monogram || undefined}
        template={selectedTemplate}
      />

      <CountdownSection
        weddingDate={weddingDateObj}
        template={selectedTemplate}
        compact={true}
      />

      {locations.length > 0 && (
        <LocationSection
          locations={locations}
          template={selectedTemplate}
        />
      )}

      {timeline.length > 0 && (
        <TimelineSection
          timeline={timeline}
          template={selectedTemplate}
        />
      )}

      {dresscode && (
        <DresscodeSection
          dresscode={dresscode}
          colors={dresscodeColors.length > 0 ? dresscodeColors : undefined}
          template={selectedTemplate}
        />
      )}

      {faqItems && faqItems.length > 0 && (
        <FAQSection
          items={faqItems}
          template={selectedTemplate}
        />
      )}

      {giftConfig?.enabled && (
        <GiftSection
          config={giftConfig}
          template={selectedTemplate}
        />
      )}

      <RSVPSection
        invitationId="preview"
        enabled={rsvpConfig.enabled}
        deadline={rsvpConfig.deadline ? new Date(rsvpConfig.deadline) : undefined}
        template={selectedTemplate}
        demo={true}
        fields={effectiveFields}
        customQuestions={rsvpConfig.customQuestions ?? []}
      />

      <ClosingSection
        partner1Name={partner1Name || "Partner 1"}
        partner2Name={partner2Name || "Partner 2"}
        weddingDate={weddingDateObj}
        template={selectedTemplate}
      />
    </div>
  );
}
