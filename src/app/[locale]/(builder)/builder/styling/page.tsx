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
import { MusicSelector } from "@/components/builder/music-selector";
import { useBuilderStore } from "@/stores/builder-store";
import { getTemplateById } from "@/lib/templates";
import { SEAL_COLOR_PRESETS, DEFAULT_SEAL_COLOR, isValidHexColor } from "@/lib/wax-colors";
import { SEAL_FONT_PRESETS, DEFAULT_SEAL_FONT, getSealFontConfig } from "@/lib/wax-fonts";
import { cn } from "@/lib/utils";

const FONT_PAIRINGS = [
  {
    name: "Elegant",
    value: "elegant",
    description: "Cormorant + Inter",
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    name: "Modern",
    value: "modern",
    description: "Playfair + Inter",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    name: "Romantisch",
    value: "romantic",
    description: "Libre Baskerville + Lora",
    headingFont: "'Libre Baskerville', serif",
    bodyFont: "'Lora', serif",
  },
] as const;

export default function StylingPage() {
  const tCta = useTranslations("cta");
  const router = useRouter();

  const {
    styling,
    partner1Name,
    partner2Name,
    templateId,
    setStyling,
    setCurrentStep,
  } = useBuilderStore();

  const selectedTemplate = templateId ? getTemplateById(templateId) : null;

  useEffect(() => {
    if (!templateId) {
      router.push("/builder/template");
      return;
    }
    setCurrentStep(7);
  }, [templateId, router, setCurrentStep]);

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
                initials={styling.monogram || "J&J"}
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
                            ? "border-burgundy-500 bg-burgundy-50"
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
                      ? "border-burgundy-500 bg-burgundy-50 shadow-sm"
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

        {/* Typography Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
        >
          <h2 className="font-heading text-xl font-semibold text-stone-900 mb-6">
            Typografie
          </h2>

          <div className="space-y-4">
            <Label>Lettertype combinatie</Label>
            <div className="grid sm:grid-cols-3 gap-3">
              {FONT_PAIRINGS.map((pairing) => (
                <button
                  key={pairing.value}
                  onClick={() => setStyling({ fontPairing: pairing.value })}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    styling.fontPairing === pairing.value
                      ? "border-burgundy-500 bg-burgundy-50"
                      : "border-stone-200 hover:border-stone-300"
                  )}
                >
                  <span
                    className="block text-lg font-semibold text-stone-900"
                    style={{ fontFamily: pairing.headingFont }}
                  >
                    {pairing.name}
                  </span>
                  <span className="text-xs text-stone-500">{pairing.description}</span>
                  <div className="mt-3 text-sm text-stone-600">
                    <span style={{ fontFamily: pairing.headingFont }}>
                      {partner1Name || "Naam"} & {partner2Name || "Naam"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Background Music Section */}
        <MusicSelector />

        {/* Overall Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-stone-100 rounded-xl p-8 text-center"
        >
          <h3 className="font-heading text-lg font-semibold text-stone-700 mb-4">
            Preview
          </h3>
          <div
            className="bg-white rounded-lg p-8 shadow-sm"
            style={{
              background: selectedTemplate?.colors.backgroundGradient,
            }}
          >
            <WaxSeal
              initials={styling.monogram || "J&J"}
              color={currentColor}
              font={styling.sealFont || DEFAULT_SEAL_FONT}
              size="lg"
            />
            <h2
              className="mt-6 font-heading text-2xl font-semibold"
              style={{ color: selectedTemplate?.colors.text || "#1C1917" }}
            >
              {partner1Name || "Naam"} & {partner2Name || "Naam"}
            </h2>
            <p
              className="mt-2 font-accent text-lg"
              style={{ color: selectedTemplate?.colors.textMuted || "#78716C" }}
            >
              Wij gaan trouwen!
            </p>
          </div>
        </motion.div>
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
