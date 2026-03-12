"use client";

import { useRouter, useParams } from "next/navigation";
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
import { HeroSection, FloatingMusicToggle, useMusicControl, StdCalendarSection } from "@/components/invitation-sections";
import { useStdBuilderStore, getStdMusicUrl } from "@/stores/std-builder-store";
import { useStdBuilderGuard } from "@/hooks/use-std-builder-guard";
import { getStdTemplateById, stdTemplates } from "@/lib/std-templates";
import { type SealFontId } from "@/lib/wax-fonts";
import { cn } from "@/lib/utils";

type DeviceView = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<DeviceView, string> = {
  desktop: "100%",
  tablet: "600px",
  mobile: "375px",
};

export default function StdPreviewPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  useStdBuilderGuard();
  const [deviceView, setDeviceView] = useState<DeviceView>("mobile");
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const {
    templateId,
    partner1Name,
    partner2Name,
    weddingDate,
    headline,
    styling,
    musicConfig,
    setCurrentStep,
  } = useStdBuilderStore();

  const musicUrl = getStdMusicUrl(musicConfig) || undefined;
  const { audioRef, play: playMusic, pause: pauseMusic } = useMusicControl(musicUrl);

  const selectedTemplate = getStdTemplateById(templateId || "") || stdTemplates[0];

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const validationChecks = [
    { label: "Template gekozen", valid: !!templateId },
    { label: "Namen ingevuld", valid: !!partner1Name && !!partner2Name },
    { label: "Datum ingevuld", valid: !!weddingDate },
  ];

  const isValid = validationChecks.every((check) => check.valid);

  const showDate = styling.envelopeConfig?.showDateOnEnvelope ?? true;
  const envelopeSealText = showDate && weddingDate
    ? new Date(weddingDate).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  const weddingDateObj = weddingDate ? new Date(weddingDate) : new Date();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Preview
        </h1>
        <p className="mt-2 text-stone-600">
          Bekijk hoe jullie Save the Date eruitziet
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
          <div className="grid sm:grid-cols-3 gap-3">
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

        {/* Device selector — hidden on mobile, only mobile preview shown */}
        <div className="hidden sm:flex justify-center gap-2">
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border text-stone-700"
            style={{
              backgroundColor: selectedTemplate.colors.accent,
              borderColor: selectedTemplate.colors.primary + "40",
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
            style={{ height: deviceView === "mobile" ? "680px" : deviceView === "tablet" ? "700px" : "600px" }}
          >
            <PreviewWatermark />
            <iframe
              src={`/${locale}/std-preview`}
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
              } : deviceView === "tablet" ? {
                position: "absolute",
                top: 0,
                left: "50%",
                marginLeft: "-384px",
                width: "768px",
                height: "900px",
                transform: "scale(0.781)",
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
              title="Save the Date preview"
            />
          </div>
        </motion.div>
      </div>

      {/* Full-screen animation overlay */}
      {isAnimationOpen && (
        <div className="fixed inset-0 z-[100]">
          <PreviewWatermark className="z-[110]" />
          {!isAnimationComplete ? (
            <Envelope2D
              sealColor={styling.sealColor}
              sealFont={styling.sealFont as SealFontId}
              monogram={styling.monogram || `${partner1Name.charAt(0) || "J"}&${partner2Name.charAt(0) || "B"}`}
              sealText={envelopeSealText}
              onOpen={() => setIsAnimationComplete(true)}
              enableMusic={musicConfig.enabled}
              onMusicStart={playMusic}
            />
          ) : (
            <div
              className="relative h-full overflow-y-auto"
              style={{ background: selectedTemplate.colors.backgroundGradient }}
            >
              <button
                onClick={() => { pauseMusic(); setIsAnimationOpen(false); setIsAnimationComplete(false); }}
                className="fixed top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-stone-700" />
              </button>

              {musicConfig.enabled && musicUrl && (
                <FloatingMusicToggle audioRef={audioRef} />
              )}

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

              <StdCalendarSection
                template={selectedTemplate}
                weddingDate={weddingDateObj}
                partner1Name={partner1Name || "Partner 1"}
                partner2Name={partner2Name || "Partner 2"}
              />

              <div className="py-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => { pauseMusic(); setIsAnimationOpen(false); setIsAnimationComplete(false); }}
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
        <Button variant="ghost" onClick={() => router.push("/std-builder/styling")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug
        </Button>
        <Button
          onClick={() => isValid && router.push("/std-builder/checkout")}
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
