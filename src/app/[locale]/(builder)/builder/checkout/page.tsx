"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Shield, Clock, AlertCircle, Loader2, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilderStore, type PlanId } from "@/stores/builder-store";
import { useBuilderSync } from "@/hooks/use-builder-sync";

interface PlanDetails {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  guestLimit: string;
  duration: string;
  features: string[];
}

const PLAN_DETAILS: Record<PlanId, PlanDetails> = {
  basic: {
    id: "basic",
    name: "Basic",
    price: 125,
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
  },
  signature: {
    id: "signature",
    name: "Signature",
    price: 175,
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
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 225,
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
  },
};

function CheckoutContent() {
  const tCta = useTranslations("cta");
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    templateId,
    partner1Name,
    partner2Name,
    invitationId,
    selectedPlan,
    setCurrentStep,
  } = useBuilderStore();

  const { isAuthenticated, forceSave } = useBuilderSync();

  useEffect(() => {
    if (!templateId) {
      router.push("/builder/template");
      return;
    }
    setCurrentStep(9);
  }, [templateId, router, setCurrentStep]);

  // Show canceled message
  useEffect(() => {
    if (canceled) {
      setError("Betaling geannuleerd. Probeer het opnieuw.");
    }
  }, [canceled]);

  // Redirect if no plan selected
  useEffect(() => {
    if (!selectedPlan) {
      router.push("/builder/package");
    }
  }, [selectedPlan, router]);

  const planDetails = selectedPlan ? PLAN_DETAILS[selectedPlan] : null;
  const total = planDetails?.price || 0;

  const handleCheckout = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Ensure invitation is saved first
      if (!invitationId) {
        // Need to be authenticated to checkout
        if (!isAuthenticated) {
          router.push(`/login?callbackUrl=${encodeURIComponent("/builder/checkout")}`);
          return;
        }
        // Save the invitation first
        await forceSave();
      }

      // Get the invitation ID (might have just been created)
      const currentInvitationId = useBuilderStore.getState().invitationId;

      if (!currentInvitationId) {
        throw new Error("Kan uitnodiging niet opslaan. Probeer het opnieuw.");
      }

      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          invitationId: currentInvitationId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Betaling mislukt");
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Mollie checkout
        window.location.href = url;
      } else {
        throw new Error("Geen checkout URL ontvangen");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Er ging iets mis. Probeer het opnieuw.");
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/builder/preview");
  };

  const handleChangePlan = () => {
    router.push("/builder/package");
  };

  if (!planDetails) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Bevestig je bestelling
        </h1>
        <p className="mt-2 text-stone-600">
          Bekijk je gekozen pakket en voltooi de betaling
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Selected plan summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-stone-900">
                {planDetails.name} pakket
              </h2>
              <p className="text-stone-600 mt-1">{planDetails.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleChangePlan}>
              Wijzig
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-stone-600">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {planDetails.guestLimit}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {planDetails.duration}
            </span>
          </div>

          <ul className="space-y-2 mb-4">
            {planDetails.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-stone-600">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-stone-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-stone-700">Prijs</span>
              <span className="text-3xl font-bold text-stone-900">€{planDetails.price}</span>
            </div>
            <p className="text-sm text-stone-500 text-right">eenmalig, incl. BTW</p>
          </div>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-stone-900 text-white rounded-xl p-6 mb-6"
        >
          <h2 className="font-heading text-xl font-semibold mb-4">
            Overzicht
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>{planDetails.name} pakket</span>
              <span>€{planDetails.price.toFixed(2)}</span>
            </div>
            <div className="border-t border-stone-700 pt-3 flex justify-between text-lg font-semibold">
              <span>Totaal (incl. BTW)</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-stone-400 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Veilig betalen via Mollie</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>14 dagen bedenktijd</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-white text-stone-900 hover:bg-stone-100"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Even geduld...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Betaal €{total.toFixed(2)}
              </>
            )}
          </Button>
        </motion.div>

        {/* Summary of invitation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-champagne-50 rounded-xl p-6 border border-champagne-200"
        >
          <h3 className="font-heading text-lg font-semibold text-stone-900 mb-2">
            Jullie uitnodiging
          </h3>
          <p className="text-stone-600">
            <span className="font-semibold">{partner1Name}</span> &{" "}
            <span className="font-semibold">{partner2Name}</span>
          </p>
          <p className="text-sm text-stone-500 mt-1">
            Na betaling kunnen jullie de uitnodiging direct publiceren en delen
            met jullie gasten.
          </p>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCta("back")}
        </Button>
      </div>
    </div>
  );
}

function CheckoutFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-olive-600" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
