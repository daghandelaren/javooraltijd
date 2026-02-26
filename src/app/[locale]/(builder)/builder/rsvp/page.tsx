"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, Users, UtensilsCrossed, MessageSquare, Plus, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GuestGroups } from "@/components/builder/guest-groups";
import { RSVPSection } from "@/components/invitation-sections/rsvp-section";
import { useBuilderStore, type CustomQuestion } from "@/stores/builder-store";
import { useBuilderGuard } from "@/hooks/use-builder-guard";
import { getTemplateById, templates } from "@/lib/templates";
import { cn } from "@/lib/utils";

function UpgradeChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
    >
      {label}
    </Link>
  );
}

function ToggleSwitch({
  enabled,
  onToggle,
  label,
  description,
  icon: Icon,
  upgradeChip,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
  icon?: React.ElementType;
  upgradeChip?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border-2 transition-all",
        upgradeChip
          ? "border-stone-200 bg-stone-50 opacity-70 cursor-not-allowed"
          : cn(
              "cursor-pointer",
              enabled
                ? "border-olive-200 bg-olive-50/50"
                : "border-stone-200 bg-white hover:border-stone-300"
            )
      )}
      onClick={upgradeChip ? undefined : onToggle}
    >
      {Icon && (
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            enabled && !upgradeChip ? "bg-olive-100 text-olive-700" : "bg-stone-100 text-stone-400"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-stone-900">{label}</span>
            {upgradeChip}
          </div>
          {!upgradeChip && (
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
          )}
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
  useBuilderGuard(2);

  const [newQuestion, setNewQuestion] = useState("");
  const [showQuestionInput, setShowQuestionInput] = useState(false);

  const { rsvpConfig, selectedPlan, templateId, setRSVPConfig, setCurrentStep } = useBuilderStore();

  const customQuestions: CustomQuestion[] = rsvpConfig.customQuestions ?? [];
  const maxCustomQuestions = selectedPlan === "premium" ? Infinity : selectedPlan === "signature" ? 2 : 0;

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const updated = [...customQuestions, { id: Math.random().toString(36).substring(2, 9), question: newQuestion.trim() }];
    setRSVPConfig({ customQuestions: updated });
    setNewQuestion("");
    setShowQuestionInput(false);
  };

  const handleRemoveQuestion = (id: string) => {
    setRSVPConfig({ customQuestions: customQuestions.filter((q) => q.id !== id) });
  };
  const previewTemplate = getTemplateById(templateId || "") || templates[0];

  useEffect(() => {
    setCurrentStep(6);
  }, [setCurrentStep]);

  const handleBack = () => {
    router.push("/builder/program");
  };

  const handleNext = () => {
    router.push("/builder/styling");
  };

  // Effective fields respect plan limits (locked fields are always false)
  const effectiveFields = {
    ...rsvpConfig.fields,
    dietary: selectedPlan === "basic" ? false : rsvpConfig.fields.dietary,
    message: selectedPlan === "premium" ? rsvpConfig.fields.message : false,
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
                  upgradeChip={
                    selectedPlan === "basic" ? (
                      <UpgradeChip label="Upgrade naar Signature" href="/builder/package" />
                    ) : undefined
                  }
                />

                <ToggleSwitch
                  enabled={rsvpConfig.fields.message}
                  onToggle={() => updateField("message", !rsvpConfig.fields.message)}
                  label="Algemeen bericht"
                  description="Gasten kunnen een persoonlijk berichtje achterlaten"
                  icon={MessageSquare}
                  upgradeChip={
                    selectedPlan !== "premium" ? (
                      <UpgradeChip label="Upgrade naar Premium" href="/builder/package" />
                    ) : undefined
                  }
                />
              </div>
            </div>

            {/* Real RSVP preview */}
            <div className="overflow-hidden rounded-xl border border-stone-200">
              <div className="bg-champagne-50 px-4 py-3 border-b border-stone-200">
                <p className="text-sm font-medium text-stone-700">Preview RSVP formulier</p>
              </div>
              <RSVPSection
                key={JSON.stringify(effectiveFields) + customQuestions.map(q => q.question).join("|")}
                invitationId="preview"
                enabled={true}
                deadline={rsvpConfig.deadline ? new Date(rsvpConfig.deadline) : undefined}
                template={previewTemplate}
                demo={true}
                fields={effectiveFields}
                customQuestions={customQuestions}
              />
            </div>

            {/* Custom questions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 space-y-4">
              <div>
                <h3 className="font-heading text-lg font-semibold text-stone-900">
                  Extra vragen
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  {selectedPlan === "basic"
                    ? "Niet beschikbaar in het Basic pakket"
                    : selectedPlan === "signature"
                    ? "Tot 2 eigen vragen toevoegen"
                    : "Onbeperkt eigen vragen toevoegen"}
                </p>
              </div>

              {selectedPlan === "basic" ? (
                <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800">
                      Extra vragen zijn beschikbaar vanaf het Signature pakket
                    </p>
                  </div>
                  <Link
                    href="/builder/package"
                    className="shrink-0 text-xs font-medium text-amber-700 underline hover:text-amber-900"
                  >
                    Upgraden
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Existing questions */}
                  {customQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 bg-stone-50"
                    >
                      <span className="flex-1 text-sm text-stone-800">{q.question}</span>
                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Inline add input */}
                  {showQuestionInput && (
                    <div className="flex gap-2">
                      <Input
                        autoFocus
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddQuestion();
                          if (e.key === "Escape") { setShowQuestionInput(false); setNewQuestion(""); }
                        }}
                        placeholder="Bijv. Heb je een dieetwens?"
                        className="h-10"
                      />
                      <Button onClick={handleAddQuestion} disabled={!newQuestion.trim()} className="bg-olive-600 hover:bg-olive-700 h-10 px-4">
                        Toevoegen
                      </Button>
                      <Button variant="ghost" onClick={() => { setShowQuestionInput(false); setNewQuestion(""); }} className="h-10 px-3">
                        &times;
                      </Button>
                    </div>
                  )}

                  {/* Add button */}
                  {!showQuestionInput && customQuestions.length < maxCustomQuestions && (
                    <Button
                      variant="outline"
                      onClick={() => setShowQuestionInput(true)}
                      className="w-full border-dashed border-2 border-stone-300 hover:border-olive-400 hover:bg-olive-50/30 h-10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Vraag toevoegen
                      {selectedPlan === "signature" && (
                        <span className="ml-2 text-xs text-stone-400">
                          ({customQuestions.length}/2)
                        </span>
                      )}
                    </Button>
                  )}

                  {/* Signature limit reached */}
                  {selectedPlan === "signature" && customQuestions.length >= 2 && !showQuestionInput && (
                    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50">
                      <p className="text-sm text-amber-800">
                        Maximum van 2 vragen bereikt. Upgrade voor onbeperkt.
                      </p>
                      <Link
                        href="/builder/package"
                        className="shrink-0 text-xs font-medium text-amber-700 underline hover:text-amber-900"
                      >
                        Upgraden
                      </Link>
                    </div>
                  )}
                </div>
              )}
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
