"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, Users, UtensilsCrossed, MessageSquare, UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GuestGroups } from "@/components/builder/guest-groups";
import { useBuilderStore } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

function ToggleSwitch({
  enabled,
  onToggle,
  label,
  description,
  icon: Icon,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
        enabled
          ? "border-olive-200 bg-olive-50/50"
          : "border-stone-200 bg-white hover:border-stone-300"
      )}
      onClick={onToggle}
    >
      {Icon && (
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            enabled ? "bg-olive-100 text-olive-700" : "bg-stone-100 text-stone-500"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-stone-900">{label}</span>
          <div
            className={cn(
              "w-10 h-6 rounded-full relative transition-colors",
              enabled ? "bg-olive-600" : "bg-stone-300"
            )}
          >
            <div
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
                enabled ? "translate-x-5" : "translate-x-1"
              )}
            />
          </div>
        </div>
        {description && (
          <p className="text-sm text-stone-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function RSVPPage() {
  const tCta = useTranslations("cta");
  const router = useRouter();

  const { rsvpConfig, templateId, setRSVPConfig, setCurrentStep } = useBuilderStore();

  useEffect(() => {
    if (!templateId) {
      router.push("/builder/template");
      return;
    }
    setCurrentStep(6);
  }, [templateId, router, setCurrentStep]);

  const handleBack = () => {
    router.push("/builder/program");
  };

  const handleNext = () => {
    router.push("/builder/styling");
  };

  const updateField = (field: keyof typeof rsvpConfig.fields, value: boolean | number) => {
    setRSVPConfig({
      fields: {
        ...rsvpConfig.fields,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          RSVP Instellingen
        </h1>
        <p className="mt-2 text-stone-600">
          Configureer hoe gasten kunnen reageren
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Main RSVP toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className={cn(
              "p-6 rounded-xl border-2 transition-all",
              rsvpConfig.enabled
                ? "border-olive-200 bg-olive-50/50"
                : "border-stone-200 bg-white"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-semibold text-stone-900">
                  RSVP functie
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Laat gasten aangeven of ze komen
                </p>
              </div>
              <button
                onClick={() => setRSVPConfig({ enabled: !rsvpConfig.enabled })}
                className={cn(
                  "w-14 h-8 rounded-full relative transition-colors",
                  rsvpConfig.enabled ? "bg-olive-600" : "bg-stone-300"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform",
                    rsvpConfig.enabled ? "translate-x-7" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* RSVP Options */}
        {rsvpConfig.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            {/* Deadline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">
                RSVP Deadline
              </h3>
              <div className="space-y-2">
                <Label htmlFor="deadline">Reageer voor (optioneel)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={rsvpConfig.deadline || ""}
                  onChange={(e) => setRSVPConfig({ deadline: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-stone-500">
                  Na deze datum kunnen gasten nog steeds reageren, maar ze zien wel dat de deadline verstreken is.
                </p>
              </div>
            </div>

            {/* Fields configuration */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 space-y-4">
              <h3 className="font-heading text-lg font-semibold text-stone-900">
                Velden in het RSVP formulier
              </h3>
              <p className="text-sm text-stone-500">
                Naam is altijd verplicht. Kies welke extra velden je wilt tonen.
              </p>

              <div className="space-y-3">
                <ToggleSwitch
                  enabled={rsvpConfig.fields.email}
                  onToggle={() => updateField("email", !rsvpConfig.fields.email)}
                  label="E-mailadres"
                  description="Handig voor updates en bevestigingen"
                  icon={Mail}
                />

                <ToggleSwitch
                  enabled={rsvpConfig.fields.guestCount}
                  onToggle={() => updateField("guestCount", !rsvpConfig.fields.guestCount)}
                  label="Aantal personen"
                  description="Gasten kunnen aangeven met hoeveel ze komen"
                  icon={Users}
                />

                {rsvpConfig.fields.guestCount && (
                  <div className="ml-14 p-4 bg-stone-50 rounded-lg">
                    <Label htmlFor="maxGuests" className="text-sm">
                      Maximum aantal gasten per RSVP
                    </Label>
                    <Input
                      id="maxGuests"
                      type="number"
                      min={1}
                      max={10}
                      value={rsvpConfig.fields.maxGuests}
                      onChange={(e) =>
                        updateField("maxGuests", parseInt(e.target.value) || 1)
                      }
                      className="mt-2 w-24"
                    />
                  </div>
                )}

                <ToggleSwitch
                  enabled={rsvpConfig.fields.dietary}
                  onToggle={() => updateField("dietary", !rsvpConfig.fields.dietary)}
                  label="Dieetwensen"
                  description="Allergieën en voedselvoorkeuren"
                  icon={UtensilsCrossed}
                />

                <ToggleSwitch
                  enabled={rsvpConfig.fields.message}
                  onToggle={() => updateField("message", !rsvpConfig.fields.message)}
                  label="Bericht"
                  description="Gasten kunnen een persoonlijk berichtje achterlaten"
                  icon={MessageSquare}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-champagne-50 rounded-xl p-6 border border-champagne-200">
              <h3 className="font-heading text-lg font-semibold text-stone-900 mb-4">
                Preview RSVP formulier
              </h3>
              <div className="space-y-3 bg-white rounded-lg p-4">
                <div className="space-y-1">
                  <Label className="text-xs text-stone-500">Naam *</Label>
                  <div className="h-10 bg-stone-100 rounded-md" />
                </div>
                {rsvpConfig.fields.email && (
                  <div className="space-y-1">
                    <Label className="text-xs text-stone-500">E-mailadres</Label>
                    <div className="h-10 bg-stone-100 rounded-md" />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs text-stone-500">Kom je? *</Label>
                  <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-stone-100 rounded-md" />
                    <div className="h-10 flex-1 bg-stone-100 rounded-md" />
                    <div className="h-10 flex-1 bg-stone-100 rounded-md" />
                  </div>
                </div>
                {rsvpConfig.fields.guestCount && (
                  <div className="space-y-1">
                    <Label className="text-xs text-stone-500">Aantal personen</Label>
                    <div className="h-10 w-24 bg-stone-100 rounded-md" />
                  </div>
                )}
                {rsvpConfig.fields.dietary && (
                  <div className="space-y-1">
                    <Label className="text-xs text-stone-500">Dieetwensen</Label>
                    <div className="h-10 bg-stone-100 rounded-md" />
                  </div>
                )}
                {rsvpConfig.fields.message && (
                  <div className="space-y-1">
                    <Label className="text-xs text-stone-500">Bericht</Label>
                    <div className="h-20 bg-stone-100 rounded-md" />
                  </div>
                )}
              </div>
            </div>

            {/* Guest Segmentation */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
              <GuestGroups />
            </div>
          </motion.div>
        )}
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
