"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStdBuilderStore } from "@/stores/std-builder-store";
import { useStdBuilderGuard } from "@/hooks/use-std-builder-guard";
import { getStdTemplateById } from "@/lib/std-templates";

export default function StdDetailsPage() {
  const router = useRouter();
  useStdBuilderGuard();

  const {
    partner1Name,
    partner2Name,
    weddingDate,
    headline,
    templateId,
    setPartner1Name,
    setPartner2Name,
    setWeddingDate,
    setHeadline,
    setCurrentStep,
  } = useStdBuilderStore();

  const selectedTemplate = templateId ? getStdTemplateById(templateId) : null;

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const isValid = partner1Name.trim() && partner2Name.trim() && weddingDate;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Jullie details
        </h1>
        <p className="mt-2 text-stone-600">
          De namen en datum voor jullie Save the Date
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          {/* Partner names */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-stone-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-olive-600" />
              Het bruidspaar
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partner1">Naam partner 1 *</Label>
                <Input
                  id="partner1"
                  value={partner1Name}
                  onChange={(e) => setPartner1Name(e.target.value)}
                  placeholder="Voornaam"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner2">Naam partner 2 *</Label>
                <Input
                  id="partner2"
                  value={partner2Name}
                  onChange={(e) => setPartner2Name(e.target.value)}
                  placeholder="Voornaam"
                />
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="font-heading text-xl font-semibold text-stone-900">
              Wanneer is de bruiloft?
            </h2>

            <div className="space-y-2 max-w-[200px]">
              <Label htmlFor="date">Trouwdatum *</Label>
              <Input
                id="date"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="font-heading text-xl font-semibold text-stone-900">
              Headline (optioneel)
            </h2>
            <p className="text-sm text-stone-500">
              De tekst die op jullie Save the Date kaart verschijnt.
            </p>
            <div className="space-y-2">
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Save the Date"
                maxLength={60}
              />
              <p className="text-xs text-stone-400 text-right">
                {headline.length}/60
              </p>
            </div>
          </div>

          {/* Live preview */}
          <div className="pt-4 border-t border-stone-100">
            <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4">
              Preview
            </h2>
            <div
              className="rounded-lg p-6 text-center"
              style={{
                background: selectedTemplate?.colors.backgroundGradient ?? "#fdf8f3",
                color: selectedTemplate?.colors.text ?? "#1c1917",
              }}
            >
              {headline && (
                <p className="font-accent text-lg mb-2" style={{ color: "inherit" }}>
                  {headline}
                </p>
              )}
              <h3 className="font-heading text-2xl font-semibold" style={{ color: "inherit" }}>
                {partner1Name || "Partner 1"} & {partner2Name || "Partner 2"}
              </h3>
              {weddingDate && (
                <p className="mt-2" style={{ color: selectedTemplate?.colors.textMuted ?? "#78716c" }}>
                  {new Date(weddingDate).toLocaleDateString("nl-NL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={() => router.push("/std-builder/template")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug
        </Button>
        <Button
          onClick={() => isValid && router.push("/std-builder/styling")}
          disabled={!isValid}
          className="min-w-[140px]"
        >
          Volgende
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
