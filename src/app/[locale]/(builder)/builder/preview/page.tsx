"use client";

import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Envelope2D } from "@/components/envelope-2d/envelope-2d";
import { PreviewWatermark } from "@/components/builder/preview-watermark";
import {
  HeroSection,
  CountdownSection,
  LocationSection,
  TimelineSection,
  DresscodeSection,
  FAQSection,
  GiftSection,
  RSVPSection,
} from "@/components/invitation-sections";
import { useBuilderStore } from "@/stores/builder-store";
import { useBuilderGuard } from "@/hooks/use-builder-guard";
import { getTemplateById, templates } from "@/lib/templates";
import { type SealFontId } from "@/lib/wax-fonts";
import { cn } from "@/lib/utils";

type DeviceView = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<DeviceView, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export default function PreviewPage() {
  const tCta = useTranslations("cta");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  useBuilderGuard(2);
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

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
    setCurrentStep,
  } = useBuilderStore();

  const selectedTemplate = getTemplateById(templateId || "") || templates[0];

  useEffect(() => {
    setCurrentStep(8);
  }, [setCurrentStep]);

  // Validation checks
  const validationChecks = [
    { label: "Template gekozen", valid: !!templateId },
    { label: "Namen ingevuld", valid: !!partner1Name && !!partner2Name },
    { label: "Datum ingevuld", valid: !!weddingDate },
    { label: "Minimaal 1 locatie", valid: locations.length > 0 },
    { label: "Programma toegevoegd", valid: timeline.length > 0 },
  ];

  const isValid = validationChecks.every((check) => check.valid);

  const envelopeSealText = (() => {
    const showDate = styling.envelopeConfig?.showDateOnEnvelope ?? true;
    if (showDate && weddingDate) {
      return new Date(weddingDate).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return undefined;
  })();

  const weddingDateObj = weddingDate ? new Date(weddingDate) : new Date();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Preview
        </h1>
        <p className="mt-2 text-stone-600">
          Bekijk hoe jullie uitnodiging eruitziet
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Validation checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
        >
          <h2 className="font-heading text-lg font-semibold text-stone-900 mb-4">
            Checklist
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {validationChecks.map((check, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg",
                  check.valid ? "bg-green-50" : "bg-amber-50"
                )}
              >
                {check.valid ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    check.valid ? "text-green-700" : "text-amber-700"
                  )}
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device selector */}
        <div className="flex justify-center gap-2">
          <Button
            variant={deviceView === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeviceView("desktop")}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={deviceView === "tablet" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeviceView("tablet")}
          >
            <Tablet className="w-4 h-4 mr-2" />
            Tablet
          </Button>
          <Button
            variant={deviceView === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeviceView("mobile")}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobiel
          </Button>
        </div>

        {/* Template badge */}
        <div className="flex justify-center">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              backgroundColor: selectedTemplate.colors.accent,
              borderColor: selectedTemplate.colors.primary + "40",
              color: selectedTemplate.colors.text,
            }}
          >
            Template: {selectedTemplate.name}
          </span>
        </div>

        {/* Animation button */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsAnimationOpen(true)}
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5"
          >
            ▶ Bekijk volledige animatie
          </button>
        </div>

        {/* Preview frame */}
        <motion.div
          layout
          className="mx-auto rounded-xl border border-stone-300 shadow-sm overflow-hidden relative"
          style={{ maxWidth: DEVICE_WIDTHS[deviceView] }}
        >
          <div
            className="relative overflow-hidden"
            style={{ height: deviceView === "mobile" ? "680px" : "600px" }}
          >
            <PreviewWatermark />
            <iframe
              src={`/${locale}/invitation-preview`}
              style={deviceView === "desktop" ? {
                position: "absolute",
                top: 0,
                left: "50%",
                marginLeft: "-720px",
                width: "1440px",
                height: "900px",
                transform: "scale(0.667)",
                transformOrigin: "top center",
                border: "none",
                display: "block",
              } : {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
              title="Uitnodiging preview"
            />
          </div>
        </motion.div>
      </div>

      {/* Full-screen animation overlay */}
      {isAnimationOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Watermark covers both envelope animation and content */}
          <PreviewWatermark className="z-[110]" />
          {!isAnimationComplete ? (
            <Envelope2D
              sealColor={styling.sealColor}
              sealFont={styling.sealFont as SealFontId}
              monogram={styling.monogram || `${partner1Name.charAt(0) || "J"}&${partner2Name.charAt(0) || "B"}`}
              sealText={envelopeSealText}
              onOpen={() => setIsAnimationComplete(true)}
              enableMusic={false}
            />
          ) : (
            <div
              className="relative h-full overflow-y-auto"
              style={{ background: selectedTemplate.colors.backgroundGradient }}
            >
              {/* Close button */}
              <button
                onClick={() => { setIsAnimationOpen(false); setIsAnimationComplete(false); }}
                className="fixed top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-stone-700" />
              </button>

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
                rsvpId="rsvp-overlay"
              />

              <CountdownSection
                weddingDate={weddingDateObj}
                template={selectedTemplate}
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
                rsvpId="rsvp-overlay"
              />

              <div className="py-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => { setIsAnimationOpen(false); setIsAnimationComplete(false); }}
                >
                  ← Sluiten
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={() => router.push("/builder/styling")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCta("back")}
        </Button>
        <Button
          onClick={() => isValid && router.push("/builder/checkout")}
          disabled={!isValid}
          className="min-w-[140px]"
        >
          Naar betaling
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
