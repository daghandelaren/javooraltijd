"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { EnvelopePreview } from "@/components/envelope-2d/envelope-preview";
import { MusicSelector } from "@/components/builder/music-selector";
import { useBuilderStore } from "@/stores/builder-store";
import { useBuilderGuard } from "@/hooks/use-builder-guard";
import { getTemplateById } from "@/lib/templates";
import { SEAL_COLOR_PRESETS, DEFAULT_SEAL_COLOR, isValidHexColor } from "@/lib/wax-colors";
import { SEAL_FONT_PRESETS, DEFAULT_SEAL_FONT } from "@/lib/wax-fonts";
import { DEFAULT_ENVELOPE_COLOR, DEFAULT_ENVELOPE_LINER } from "@/lib/envelope-colors";
import { cn } from "@/lib/utils";
import { Mail, Sparkles } from "lucide-react";

export default function StylingPage() {
  const tCta = useTranslations("cta");
  const router = useRouter();
  useBuilderGuard(2);

  const {
    styling,
    partner1Name,
    partner2Name,
    weddingDate,
    templateId,
    setStyling,
    setCurrentStep,
  } = useBuilderStore();

  const selectedTemplate = templateId ? getTemplateById(templateId) : null;

  useEffect(() => {
    setCurrentStep(7);
  }, [setCurrentStep]);

  // Auto-generate monogram from names
  useEffect(() => {
    if (partner1Name && partner2Name && !styling.monogram) {
      const monogram = `${partner1Name.charAt(0).toUpperCase()}&${partner2Name.charAt(0).toUpperCase()}`;
      setStyling({ monogram });
    }
  }, [partner1Name, partner2Name, styling.monogram, setStyling]);

  const handleBack = () => {
    router.push("/builder/rsvp");
  };

  const handleNext = () => {
    router.push("/builder/preview");
  };

  const handleColorChange = (color: string) => {
    setStyling({ sealColor: color });
  };


  // Ensure we have a valid color for display
  const currentColor = isValidHexColor(styling.sealColor)
    ? styling.sealColor
    : DEFAULT_SEAL_COLOR;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Stijl & Design
        </h1>
        <p className="mt-2 text-stone-600">
          Personaliseer de look van jullie uitnodiging
        </p>
      </div>

      {/* Template context banner */}
      {selectedTemplate && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm"
          style={{
            borderColor: selectedTemplate.colors.primary + "40",
            backgroundColor: selectedTemplate.colors.accent,
            color: selectedTemplate.colors.text,
          }}
        >
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: selectedTemplate.sealColor }}
          />
          <span>
            <span className="font-medium">{selectedTemplate.name}</span>
            {" — "}
            <span className="capitalize">{selectedTemplate.style}</span>
          </span>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Wax Seal Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
        >
          <h2 className="font-heading text-xl font-semibold text-stone-900 mb-6">
            Lakzegel
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="flex flex-col items-center justify-center p-8 bg-stone-50 rounded-lg">
              <WaxSeal
                initials={styling.monogram || "J&B"}
                color={currentColor}
                font={styling.sealFont || DEFAULT_SEAL_FONT}
                size="xl"
              />
              <p className="mt-4 text-sm text-stone-500">Preview van jullie zegel</p>
            </div>

            {/* Options */}
            <div className="space-y-6">
              {/* Monogram */}
              <div className="space-y-2">
                <Label htmlFor="monogram">Monogram</Label>
                <Input
                  id="monogram"
                  value={styling.monogram}
                  onChange={(e) => setStyling({ monogram: e.target.value })}
                  placeholder="J&J"
                  maxLength={5}
                  className="text-center text-lg font-heading"
                />
                <p className="text-xs text-stone-500">
                  Jullie initialen of een kort symbool
                </p>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <Label>Kies een kleur</Label>

                {/* Color swatches */}
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {SEAL_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        onClick={() => handleColorChange(preset.hex)}
                        className={cn(
                          "group flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all",
                          styling.sealColor.toUpperCase() === preset.hex.toUpperCase()
                            ? "border-olive-500 bg-olive-50"
                            : "border-stone-200 hover:border-stone-300"
                        )}
                        title={preset.label}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110",
                            styling.sealColor.toUpperCase() === preset.hex.toUpperCase()
                              ? "border-stone-700"
                              : "border-transparent"
                          )}
                          style={{ backgroundColor: preset.hex }}
                        >
                          {styling.sealColor.toUpperCase() === preset.hex.toUpperCase() && (
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-600 text-center leading-tight">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Font Selection - Full width below the grid */}
          <div className="mt-8 space-y-3">
            <Label>Lettertype zegel</Label>
            <div className="grid grid-cols-3 gap-4">
              {SEAL_FONT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setStyling({ sealFont: preset.id })}
                  className={cn(
                    "py-5 px-4 rounded-xl border-2 text-center transition-all hover:shadow-md",
                    styling.sealFont === preset.id
                      ? "border-olive-500 bg-olive-50 shadow-sm"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  )}
                >
                  <span
                    className="block text-2xl mb-2"
                    style={{ fontFamily: `${preset.cssFamily}, ${preset.fallbackCss}` }}
                  >
                    {styling.monogram || "J&J"}
                  </span>
                  <span className="text-sm text-stone-600">{preset.labelNl}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Envelope Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-olive-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-olive-600" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-stone-900">
              Envelop
            </h2>
          </div>

          <div className="space-y-6">
            {/* Show date on envelope toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Trouwdatum tonen op envelop</Label>
                  <p className="text-xs text-stone-500 mt-1">
                    De trouwdatum verschijnt boven de lakzegel op de envelop.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styling.envelopeConfig?.showDateOnEnvelope ?? true}
                    onChange={(e) =>
                      setStyling({
                        envelopeConfig: {
                          ...styling.envelopeConfig,
                          enabled: true,
                          color: styling.envelopeConfig?.color || DEFAULT_ENVELOPE_COLOR,
                          linerPattern: styling.envelopeConfig?.linerPattern || DEFAULT_ENVELOPE_LINER,
                          personalizedText: styling.envelopeConfig?.personalizedText || "",
                          showDateOnEnvelope: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-olive-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-olive-600"></div>
                </label>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-3 p-4 bg-champagne-50 rounded-lg border border-champagne-200">
              <Sparkles className="w-5 h-5 text-olive-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-stone-600">
                Gasten zien een elegante envelop met jullie lakzegel.
                Door op de zegel te klikken &quot;breekt&quot; deze open en verschijnt de uitnodiging met een mooie animatie.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Background Music Section */}
        <MusicSelector />

        {/* Envelope Preview */}
        <EnvelopePreviewSection
          sealColor={currentColor}
          sealFont={styling.sealFont || DEFAULT_SEAL_FONT}
          monogram={styling.monogram || "J&B"}
          showDate={styling.envelopeConfig?.showDateOnEnvelope ?? true}
          weddingDate={weddingDate}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCta("back")}
        </Button>
        <Button onClick={handleNext} className="min-w-[140px]">
          {tCta("next")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function EnvelopePreviewSection({
  sealColor,
  sealFont,
  monogram,
  showDate,
  weddingDate,
}: {
  sealColor: string;
  sealFont: string;
  monogram: string;
  showDate: boolean;
  weddingDate: string;
}) {
  const sealText = showDate && weddingDate
    ? new Date(weddingDate).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-stone-100 rounded-xl p-6"
    >
      <h3 className="font-heading text-lg font-semibold text-stone-700 mb-4 text-center">
        Envelop preview
      </h3>
      <EnvelopePreview
        sealColor={sealColor}
        sealFont={sealFont as import("@/lib/wax-fonts").SealFontId}
        monogram={monogram}
        sealText={sealText}
        className="w-full"
      />
    </motion.div>
  );
}
