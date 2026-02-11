"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Users, Clock, Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilderStore, type PlanId } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlights: string[];
  guestLimit: string;
  duration: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 125,
    period: "eenmalig",
    description: "Perfect voor een intieme bruiloft",
    guestLimit: "Tot 75 gasten",
    duration: "9 maanden online",
    features: [
      "Alle templates",
      "Tot 75 gasten",
      "RSVP met Ja/Nee/Misschien",
      "Gast segmentatie",
      "CSV export",
      "9 maanden online",
    ],
    highlights: ["RSVP Basis"],
  },
  {
    id: "signature",
    name: "Signature",
    price: 175,
    period: "eenmalig",
    description: "De complete RSVP-ervaring",
    guestLimit: "Tot 150 gasten",
    duration: "12 maanden online",
    features: [
      "Alles van Basic",
      "Tot 150 gasten",
      "Dieetwensen & allergieën",
      "1-2 extra vragen",
      "Achtergrondmuziek",
      "12 maanden online",
    ],
    highlights: ["RSVP Uitgebreid", "Achtergrondmuziek"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 225,
    period: "eenmalig",
    description: "Maximale flexibiliteit op elk gebied",
    guestLimit: "Onbeperkt gasten",
    duration: "16 maanden online",
    features: [
      "Alles van Signature",
      "Onbeperkt gasten",
      "Onbeperkt extra vragen",
      "Algemeen berichtveld",
      "Custom programma blokken",
      "16 maanden online",
    ],
    highlights: ["RSVP Compleet", "Achtergrondmuziek", "Custom blokken"],
  },
];

export default function PackagePage() {
  const t = useTranslations("pricing");
  const tCta = useTranslations("cta");
  const router = useRouter();

  const { selectedPlan, setSelectedPlan, setCurrentStep } = useBuilderStore();

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleSelect = (planId: PlanId) => {
    setSelectedPlan(planId);
  };

  const handleNext = () => {
    if (selectedPlan) {
      router.push("/builder/template");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Kies je pakket
        </h1>
        <p className="mt-2 text-stone-600">
          Selecteer het pakket dat het beste bij jullie bruiloft past
        </p>
      </div>

      {/* Plan Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan, index) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleSelect(plan.id)}
                className={cn(
                  "w-full text-left rounded-2xl p-6 border-2 transition-all relative h-full flex flex-col",
                  isSelected
                    ? "border-olive-500 bg-olive-50/50 shadow-lg ring-2 ring-olive-200"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-olive-700 text-white text-xs font-medium rounded-full">
                    Meest gekozen
                  </span>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-2xl font-semibold text-stone-900">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">{plan.description}</p>
                  </div>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      isSelected
                        ? "border-olive-600 bg-olive-600"
                        : "border-stone-300"
                    )}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-stone-900">€{plan.price}</span>
                  <span className="text-stone-500 ml-1">{plan.period}</span>
                </div>

                {/* Key highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        isSelected
                          ? "bg-olive-100 text-olive-700"
                          : "bg-stone-100 text-stone-600"
                      )}
                    >
                      {highlight.includes("Muziek") && <Music className="w-3 h-3" />}
                      {highlight.includes("blokken") && <Sparkles className="w-3 h-3" />}
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-stone-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {plan.guestLimit}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {plan.duration}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-2 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <Check
                        className={cn(
                          "w-4 h-4 flex-shrink-0 mt-0.5",
                          isSelected ? "text-olive-600" : "text-green-600"
                        )}
                      />
                      <span className="text-stone-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Trust line */}
      <p className="text-center text-sm text-stone-500">
        Eenmalig betalen • Veilig via Mollie • Direct aan de slag
      </p>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t border-stone-200">
        <Button
          onClick={handleNext}
          disabled={!selectedPlan}
          className="min-w-[180px]"
          size="lg"
        >
          Kies template
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
