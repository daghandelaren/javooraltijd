"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { EnvelopePreview } from "@/components/envelope-2d/envelope-preview";
import { useStdBuilderStore } from "@/stores/std-builder-store";
import { MusicSelector } from "@/components/builder/music-selector";
import { useStdBuilderGuard } from "@/hooks/use-std-builder-guard";
import { getStdTemplateById } from "@/lib/std-templates";
import { SEAL_COLOR_PRESETS, DEFAULT_SEAL_COLOR, isValidHexColor } from "@/lib/wax-colors";
import { SEAL_FONT_PRESETS, DEFAULT_SEAL_FONT } from "@/lib/wax-fonts";
import { cn } from "@/lib/utils";
import { type SealFontId } from "@/lib/wax-fonts";

export default function StdStylingPage() {
  const router = useRouter();
  useStdBuilderGuard();

  const {
    styling,
    partner1Name,
    partner2Name,
    weddingDate,
    templateId,
    setStyling,
    musicConfig,
    setMusicConfig,
    setCurrentStep,
  } = useStdBuilderStore();

  const selectedTemplate = templateId ? getStdTemplateById(templateId) : null;

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  // Auto-generate monogram from names
  useEffect(() => {
    if (partner1Name && partner2Name && !styling.monogram) {
      const monogram = `${partner1Name.charAt(0).toUpperCase()}&${partner2Name.charAt(0).toUpperCase()}`;
      setStyling({ monogram });
    }
  }, [partner1Name, partner2Name, styling.monogram, setStyling]);

  const currentColor = isValidHexColor(styling.sealColor)
    ? styling.sealColor
    : DEFAULT_SEAL_COLOR;

  const sealText = weddingDate
    ? new Date(weddingDate).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Stijl & Design
        </h1>
        <p className="mt-2 text-stone-600">
          Personaliseer de lakzegel en envelop
        </p>
      </div>

      {/* Template context */}
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
        {/* Wax Seal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
        >
          <h2 className="font-heading text-xl font-semibold text-stone-900 mb-6">
            Lakzegel
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center p-8 bg-stone-50 rounded-lg">
              <WaxSeal
                initials={styling.monogram || "J&B"}
                color={currentColor}
                font={styling.sealFont || DEFAULT_SEAL_FONT}
                size="xl"
              />
              <p className="mt-4 text-sm text-stone-500">Preview van jullie zegel</p>
            </div>

            <div className="space-y-6">
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

              <div className="space-y-3">
                <Label>Kies een kleur</Label>
                <div className="grid grid-cols-4 gap-2">
                  {SEAL_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => setStyling({ sealColor: preset.hex })}
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

          {/* Font Selection */}
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

        {/* Envelope */}
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

          <div className="flex items-start gap-3 p-4 bg-champagne-50 rounded-lg border border-champagne-200">
            <Sparkles className="w-5 h-5 text-olive-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-stone-600">
              Gasten zien een elegante envelop met jullie lakzegel.
              Door op de zegel te klikken &quot;breekt&quot; deze open en verschijnt jullie Save the Date.
            </p>
          </div>
        </motion.div>

        {/* Envelope Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="font-heading text-lg font-semibold text-stone-700 text-center">
            Envelop preview
          </h3>
          <div className="bg-stone-100 rounded-xl overflow-hidden">
            <EnvelopePreview
              sealColor={currentColor}
              sealFont={styling.sealFont as SealFontId}
              monogram={styling.monogram || "J&B"}
              sealText={sealText}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Music Selector */}
        <MusicSelector
          musicConfig={musicConfig}
          setMusicConfig={setMusicConfig}
          selectedPlan="signature"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={() => router.push("/std-builder/details")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug
        </Button>
        <Button onClick={() => router.push("/std-builder/preview")} className="min-w-[140px]">
          Volgende
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
