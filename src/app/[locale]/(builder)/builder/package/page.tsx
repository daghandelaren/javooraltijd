"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaxSeal, DEFAULT_SEAL_COLOR } from "@/components/wax-seal/wax-seal";
import { useBuilderStore, type PlanId } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

const DiamondIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 3h12l4 6-10 13L2 9z" />
    <path d="M2 9h20" />
    <path d="M12 22L6 9l6-6 6 6z" />
  </svg>
);

interface Plan {
  id: PlanId;
  icon: React.ElementType;
  sealColor: string;
  accentColor: string;
  sealInitial: string;
  price: number;
  name: string;
  description: string;
  rsvpTitle: string;
  rsvpFeatures: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    icon: Heart,
    sealColor: "#B0AEB0",
    accentColor: "#B0AEB0",
    sealInitial: "B",
    price: 125,
    name: "Basic",
    description: "Perfect voor een intieme bruiloft",
    rsvpTitle: "RSVP Basis",
    rsvpFeatures: "Naam, komst, aanwezigen, e-mail & CSV export.",
    features: [
      "Alle templates",
      "Tot 75 gasten",
      "RSVP Ja / Nee / Misschien",
      "Gastsegmentatie",
      "CSV export",
      "9 maanden online",
    ],
  },
  {
    id: "signature",
    icon: DiamondIcon,
    sealColor: DEFAULT_SEAL_COLOR,
    accentColor: DEFAULT_SEAL_COLOR,
    sealInitial: "S",
    price: 175,
    name: "Signature",
    description: "De complete RSVP-ervaring",
    rsvpTitle: "RSVP Uitgebreid + Muziek",
    rsvpFeatures: "Dieetwensen, 1–2 eigen vragen & achtergrondmuziek.",
    features: [
      "Alles van Basic",
      "Tot 150 gasten",
      "Dieetwensen & allergieën",
      "1–2 extra vragen",
      "Muziek",
      "12 maanden online",
    ],
    popular: true,
  },
  {
    id: "premium",
    icon: Sparkles,
    sealColor: "#C09878",
    accentColor: "#C09878",
    sealInitial: "P",
    price: 225,
    name: "Premium",
    description: "Maximale flexibiliteit op elk gebied",
    rsvpTitle: "RSVP Compleet + Muziek",
    rsvpFeatures: "Onbeperkt vragen, berichtveld & alle Signature features.",
    features: [
      "Alles van Signature",
      "Onbeperkt gasten",
      "Onbeperkt vragen",
      "Algemeen berichtveld",
      "Custom programma",
      "16 maanden online",
    ],
  },
];

export default function PackagePage() {
  const router = useRouter();
  const { selectedPlan, setSelectedPlan, setCurrentStep } = useBuilderStore();

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleSelect = (planId: PlanId) => setSelectedPlan(planId);
  const handleNext = () => {
    if (selectedPlan) router.push("/builder/template");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Kies je pakket
        </h1>
        <p className="mt-1.5 text-stone-500 text-sm">
          Selecteer het pakket dat het beste bij jullie bruiloft past
        </p>
      </div>

      {/* Plan Grid — pt-4 gives room for the "Meest gekozen" badge */}
      <div className="grid md:grid-cols-3 gap-4 pt-4">
        {PLANS.map((plan, index) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="relative"
            >
              {/* Popular badge — sits above the card, inside the motion div */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-olive-700 text-white text-[11px] font-medium shadow-md whitespace-nowrap">
                    <DiamondIcon className="w-2.5 h-2.5" />
                    Meest gekozen
                  </span>
                </div>
              )}

              {/* Card — no overflow-hidden so seal never clips */}
              <button
                onClick={() => handleSelect(plan.id)}
                className={cn(
                  "w-full h-full text-left relative flex flex-col rounded-2xl transition-all duration-300",
                  "bg-white border-2 shadow-sm hover:shadow-md"
                )}
                style={{
                  borderColor: isSelected
                    ? plan.accentColor
                    : plan.popular
                    ? `${plan.accentColor}55`
                    : `${plan.accentColor}30`,
                  boxShadow: isSelected
                    ? `0 0 0 2px ${plan.accentColor}25, 0 8px 24px ${plan.accentColor}15`
                    : undefined,
                }}
              >
                {/* Decorative corner — clipped at card level via rounded + clip-path trick */}
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-tr-2xl opacity-[0.18] pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, ${plan.accentColor} 0%, transparent 65%)`,
                  }}
                />

                <div className="p-5 flex flex-col flex-1">
                  {/* Header row: icon + text left, seal right */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${plan.accentColor}18` }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: plan.accentColor }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-2xl font-semibold text-stone-900 leading-tight">
                          {plan.name}
                        </h3>
                        <p className="text-stone-400 text-xs leading-snug mt-0.5">
                          {plan.description}
                        </p>
                      </div>
                    </div>
                    {/* Seal */}
                    <div className="flex-shrink-0">
                      <WaxSeal
                        initials={plan.sealInitial}
                        color={plan.sealColor}
                        size="md"
                        initialsFontSize={36}
                        interactive={false}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="font-heading text-3xl font-bold text-stone-900 leading-none">
                      €{plan.price}
                    </span>
                    <span className="text-stone-400 text-xs">eenmalig</span>
                  </div>

                  {/* RSVP highlight */}
                  <div
                    className="rounded-xl px-3 py-2 border mt-4"
                    style={{
                      backgroundColor: `${plan.accentColor}08`,
                      borderColor: `${plan.accentColor}22`,
                    }}
                  >
                    <p className="text-[11px] font-semibold text-stone-700 leading-snug">
                      {plan.rsvpTitle}
                    </p>
                    <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                      {plan.rsvpFeatures}
                    </p>
                  </div>

                  {/* Feature list */}
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1 mt-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check
                          className="w-3 h-3 mt-[3px] flex-shrink-0"
                          style={{ color: plan.accentColor }}
                        />
                        <span className="text-[11px] text-stone-600 leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center shadow-sm z-10"
                    style={{ backgroundColor: plan.accentColor }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <p className="text-xs text-stone-400">
          Eenmalig betalen · Veilig via Mollie · Direct aan de slag
        </p>
        <Button onClick={handleNext} disabled={!selectedPlan} className="min-w-[160px]">
          Kies template
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
