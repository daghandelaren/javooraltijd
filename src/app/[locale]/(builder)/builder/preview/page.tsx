"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { PreviewWatermark } from "@/components/builder/preview-watermark";
import { useBuilderStore } from "@/stores/builder-store";
import { getTemplateById } from "@/lib/templates";
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
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [isRevealed, setIsRevealed] = useState(false);

  const {
    templateId,
    partner1Name,
    partner2Name,
    weddingDate,
    weddingTime,
    headline,
    locations,
    timeline,
    styling,
    rsvpConfig,
    setCurrentStep,
  } = useBuilderStore();

  const selectedTemplate = templateId ? getTemplateById(templateId) : null;

  useEffect(() => {
    if (!templateId) {
      router.push("/builder/template");
      return;
    }
    setCurrentStep(8);
  }, [templateId, router, setCurrentStep]);

  // Validation checks
  const validationChecks = [
    { label: "Template gekozen", valid: !!templateId },
    { label: "Namen ingevuld", valid: !!partner1Name && !!partner2Name },
    { label: "Datum ingevuld", valid: !!weddingDate },
    { label: "Minimaal 1 locatie", valid: locations.length > 0 },
    { label: "Programma toegevoegd", valid: timeline.length > 0 },
  ];

  const isValid = validationChecks.every((check) => check.valid);

  const handleBack = () => {
    router.push("/builder/styling");
  };

  const handleNext = () => {
    if (isValid) {
      router.push("/builder/checkout");
    }
  };

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("nl-NL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

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

        {/* Preview frame */}
        <motion.div
          layout
          className="mx-auto bg-stone-800 rounded-xl p-2 shadow-xl overflow-hidden"
          style={{ maxWidth: DEVICE_WIDTHS[deviceView] }}
        >
          <div
            className="bg-white rounded-lg overflow-auto relative"
            style={{
              height: deviceView === "mobile" ? "600px" : "500px",
              background: selectedTemplate?.colors.backgroundGradient,
            }}
          >
            {/* Watermark overlay */}
            <PreviewWatermark />
            <AnimatePresence mode="wait">
              {!isRevealed ? (
                <motion.div
                  key="sealed"
                  className="min-h-full flex flex-col items-center justify-center p-6"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <p
                    className="font-accent text-xl mb-6"
                    style={{ color: selectedTemplate?.colors.textMuted }}
                  >
                    Jullie zijn uitgenodigd
                  </p>
                  <WaxSeal
                    initials={styling.monogram || "J&J"}
                    color={styling.sealColor}
                    font={styling.sealFont}
                    size="lg"
                    onClick={() => setIsRevealed(true)}
                  />
                  <p className="mt-6 text-sm text-stone-400">
                    Klik om te openen
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 space-y-8"
                >
                  {/* Hero */}
                  <div className="text-center py-8">
                    {headline && (
                      <p
                        className="font-accent text-lg mb-2"
                        style={{ color: selectedTemplate?.colors.textMuted }}
                      >
                        {headline}
                      </p>
                    )}
                    <h1
                      className="font-heading text-3xl sm:text-4xl font-semibold"
                      style={{ color: selectedTemplate?.colors.text }}
                    >
                      {partner1Name || "Partner 1"} &{" "}
                      {partner2Name || "Partner 2"}
                    </h1>
                    <p
                      className="mt-4"
                      style={{ color: selectedTemplate?.colors.textMuted }}
                    >
                      {formattedDate}
                      {weddingTime && ` om ${weddingTime}`}
                    </p>
                  </div>

                  {/* Locations */}
                  {locations.length > 0 && (
                    <div className="space-y-4">
                      <h2
                        className="font-heading text-xl text-center"
                        style={{ color: selectedTemplate?.colors.text }}
                      >
                        Locatie
                      </h2>
                      {locations.map((location) => (
                        <div
                          key={location.id}
                          className="bg-white/60 rounded-lg p-4"
                        >
                          <p
                            className="text-xs font-medium"
                            style={{ color: selectedTemplate?.colors.primary }}
                          >
                            {location.type} • {location.time}
                          </p>
                          <h3
                            className="font-heading font-semibold"
                            style={{ color: selectedTemplate?.colors.text }}
                          >
                            {location.name}
                          </h3>
                          <p
                            className="text-sm"
                            style={{ color: selectedTemplate?.colors.textMuted }}
                          >
                            {location.address}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timeline */}
                  {timeline.length > 0 && (
                    <div className="space-y-4">
                      <h2
                        className="font-heading text-xl text-center"
                        style={{ color: selectedTemplate?.colors.text }}
                      >
                        Programma
                      </h2>
                      <div className="space-y-2">
                        {timeline.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 bg-white/60 rounded-lg"
                          >
                            <span className="text-xl">{item.icon}</span>
                            <div>
                              <p
                                className="text-xs font-medium"
                                style={{ color: selectedTemplate?.colors.primary }}
                              >
                                {item.time}
                              </p>
                              <p
                                className="font-medium"
                                style={{ color: selectedTemplate?.colors.text }}
                              >
                                {item.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RSVP placeholder */}
                  {rsvpConfig.enabled && (
                    <div className="text-center py-4">
                      <h2
                        className="font-heading text-xl mb-2"
                        style={{ color: selectedTemplate?.colors.text }}
                      >
                        RSVP
                      </h2>
                      <div className="bg-white/60 rounded-lg p-4 blur-[2px]">
                        <p className="text-stone-400 text-sm">
                          RSVP formulier (beschikbaar na publicatie)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reset button */}
                  <div className="text-center pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRevealed(false)}
                    >
                      Terug naar zegel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCta("back")}
        </Button>
        <Button
          onClick={handleNext}
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
