"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Shirt, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBuilderStore } from "@/stores/builder-store";

export default function DetailsPage() {
  const t = useTranslations("builder");
  const tCta = useTranslations("cta");
  const router = useRouter();

  const {
    partner1Name,
    partner2Name,
    weddingDate,
    weddingTime,
    headline,
    dresscode,
    giftConfig,
    templateId,
    setPartner1Name,
    setPartner2Name,
    setWeddingDate,
    setWeddingTime,
    setHeadline,
    setDresscode,
    setGiftConfig,
    setCurrentStep,
  } = useBuilderStore();

  useEffect(() => {
    // Redirect if no template selected
    if (!templateId) {
      router.push("/builder/template");
      return;
    }
    setCurrentStep(3);
  }, [templateId, router, setCurrentStep]);

  const isValid = partner1Name.trim() && partner2Name.trim() && weddingDate;

  const handleBack = () => {
    router.push("/builder/template");
  };

  const handleNext = () => {
    if (isValid) {
      router.push("/builder/locations");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Jullie details
        </h1>
        <p className="mt-2 text-stone-600">
          Vertel ons over jullie en jullie grote dag
        </p>
      </div>

      {/* Form */}
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

          {/* Date and time */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="font-heading text-xl font-semibold text-stone-900">
              Wanneer is de bruiloft?
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Trouwdatum *</Label>
                <Input
                  id="date"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Aanvangstijd (optioneel)</Label>
                <Input
                  id="time"
                  type="time"
                  value={weddingTime}
                  onChange={(e) => setWeddingTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Custom headline */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="font-heading text-xl font-semibold text-stone-900">
              Headline (optioneel)
            </h2>
            <p className="text-sm text-stone-500">
              Een korte tekst die bovenaan jullie uitnodiging verschijnt.
            </p>
            <div className="space-y-2">
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Wij gaan trouwen!"
                maxLength={100}
              />
              <p className="text-xs text-stone-400 text-right">
                {headline.length}/100
              </p>
            </div>
          </div>

          {/* Dresscode */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="font-heading text-xl font-semibold text-stone-900 flex items-center gap-2">
              <Shirt className="w-5 h-5 text-olive-600" />
              Dresscode (optioneel)
            </h2>
            <p className="text-sm text-stone-500">
              Laat gasten weten welke kledingstijl je verwacht.
            </p>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["Casual", "Smart Casual", "Formeel", "Black Tie", "Feestelijk"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDresscode(preset)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      dresscode === preset
                        ? "bg-olive-100 border-olive-300 text-olive-700"
                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <Input
                id="dresscode"
                value={dresscode}
                onChange={(e) => setDresscode(e.target.value)}
                placeholder="Of typ een eigen dresscode..."
                maxLength={100}
              />
            </div>
          </div>

          {/* Cadeau tip / Gift */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-stone-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-olive-600" />
                Cadeautip (optioneel)
              </h2>
              <button
                type="button"
                onClick={() => setGiftConfig({ enabled: !giftConfig.enabled })}
                className={`w-12 h-7 rounded-full relative transition-colors ${
                  giftConfig.enabled ? "bg-olive-600" : "bg-stone-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    giftConfig.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-stone-500">
              Laat gasten subtiel weten wat jullie voorkeur heeft.
            </p>

            {giftConfig.enabled && (
              <div className="space-y-4 bg-champagne-50 rounded-lg p-4">
                {/* Prefer money toggle */}
                <div
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    giftConfig.preferMoney
                      ? "border-olive-300 bg-white"
                      : "border-stone-200 bg-white/50 hover:border-stone-300"
                  }`}
                  onClick={() => setGiftConfig({ preferMoney: !giftConfig.preferMoney })}
                >
                  <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center text-2xl">
                    💌
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-stone-900">Envelop met bijdrage</p>
                    <p className="text-sm text-stone-500">Geef aan dat een financiële bijdrage welkom is</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      giftConfig.preferMoney
                        ? "border-olive-600 bg-olive-600"
                        : "border-stone-300"
                    }`}
                  >
                    {giftConfig.preferMoney && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Gift message */}
                <div className="space-y-2">
                  <Label htmlFor="giftMessage">Bericht (optioneel)</Label>
                  <textarea
                    id="giftMessage"
                    value={giftConfig.message}
                    onChange={(e) => setGiftConfig({ message: e.target.value })}
                    placeholder="Jullie aanwezigheid is het mooiste cadeau. Mocht je toch iets willen geven..."
                    rows={3}
                    className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                    maxLength={300}
                  />
                </div>

                {/* Registry URL */}
                <div className="space-y-2">
                  <Label htmlFor="registryUrl">Verlanglijst URL (optioneel)</Label>
                  <Input
                    id="registryUrl"
                    type="url"
                    value={giftConfig.registryUrl || ""}
                    onChange={(e) => setGiftConfig({ registryUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview card */}
          <div className="pt-4 border-t border-stone-100">
            <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4">
              Preview
            </h2>
            <div className="bg-champagne-50 rounded-lg p-6 text-center">
              {headline && (
                <p className="font-accent text-lg text-stone-600 mb-2">
                  {headline}
                </p>
              )}
              <h3 className="font-heading text-2xl font-semibold text-stone-900">
                {partner1Name || "Partner 1"} & {partner2Name || "Partner 2"}
              </h3>
              {weddingDate && (
                <p className="mt-2 text-stone-600">
                  {new Date(weddingDate).toLocaleDateString("nl-NL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {weddingTime && ` om ${weddingTime}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCta("back")}
        </Button>
        <Button onClick={handleNext} disabled={!isValid} className="min-w-[140px]">
          {tCta("next")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
