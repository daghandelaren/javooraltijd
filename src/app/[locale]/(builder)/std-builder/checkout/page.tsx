"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Shield, Clock, AlertCircle, Loader2, Tag, X, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStdBuilderStore } from "@/stores/std-builder-store";
import { useStdBuilderGuard } from "@/hooks/use-std-builder-guard";
import { useStdBuilderSync } from "@/hooks/use-std-builder-sync";

interface AppliedDiscount {
  code: string;
  label: string;
  discountCents: number;
}

function StdCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [discountInput, setDiscountInput] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  const {
    partner1Name,
    partner2Name,
    weddingDate,
    saveTheDateId,
    setCurrentStep,
  } = useStdBuilderStore();

  const { isAuthenticated, forceSave } = useStdBuilderSync();
  useStdBuilderGuard();

  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);

  useEffect(() => {
    if (canceled) {
      setError("Betaling geannuleerd. Probeer het opnieuw.");
    }
  }, [canceled]);

  const subtotal = 75;
  const discountEuro = appliedDiscount ? appliedDiscount.discountCents / 100 : 0;
  const total = Math.max(0, subtotal - discountEuro);

  const handleApplyDiscount = async () => {
    const code = discountInput.trim();
    if (!code) return;

    setDiscountLoading(true);
    setDiscountError(null);

    try {
      const res = await fetch("/api/std-checkout/validate-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (data.valid) {
        setAppliedDiscount({
          code: data.code,
          label: data.label,
          discountCents: data.discountCents,
        });
        setDiscountInput("");
        setDiscountError(null);
      } else {
        setDiscountError(data.error || "Ongeldige kortingscode");
      }
    } catch {
      setDiscountError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError(null);
  };

  const handleCheckout = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!saveTheDateId) {
        if (!isAuthenticated) {
          router.push(`/login?callbackUrl=${encodeURIComponent("/std-builder/checkout")}`);
          return;
        }
        await forceSave();
      }

      const currentId = useStdBuilderStore.getState().saveTheDateId;

      if (!currentId) {
        throw new Error("Kan Save the Date niet opslaan. Probeer het opnieuw.");
      }

      const response = await fetch("/api/std-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saveTheDateId: currentId,
          discountCode: appliedDiscount?.code,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Betaling mislukt");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Geen checkout URL ontvangen");
      }
    } catch (err) {
      console.error("STD checkout error:", err);
      setError(err instanceof Error ? err.message : "Er ging iets mis. Probeer het opnieuw.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900">
          Bevestig je bestelling
        </h1>
        <p className="mt-2 text-stone-600">
          Voltooi de betaling voor jullie Save the Date
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Product summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 mb-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-olive-50 rounded-full flex items-center justify-center">
              <CalendarHeart className="w-6 h-6 text-olive-600" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-stone-900">
                Save the Date
              </h2>
              <p className="text-stone-600 mt-1">Digitale Save the Date kaart</p>
            </div>
          </div>

          <ul className="space-y-2 mb-4 text-sm text-stone-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-400" />
              Elegante envelop met lakzegel animatie
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-400" />
              Unieke deellink voor jullie gasten
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-400" />
              Bezoekers-tracking in het dashboard
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-400" />
              12 maanden online
            </li>
          </ul>

          <div className="pt-4 border-t border-stone-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-stone-700">Prijs</span>
              <span className="text-3xl font-bold text-stone-900">€75</span>
            </div>
            <p className="text-sm text-stone-500 text-right">eenmalig, incl. BTW</p>
          </div>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-olive-700 text-white rounded-xl p-6 mb-6"
        >
          <h2 className="font-heading text-xl font-semibold mb-4">
            Overzicht
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Save the Date</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            {appliedDiscount && (
              <div className="flex justify-between text-green-200">
                <span>Korting ({appliedDiscount.code})</span>
                <span>-€{discountEuro.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-olive-600 pt-3 flex justify-between text-lg font-semibold">
              <span>Totaal (incl. BTW)</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Discount code */}
          <div className="mb-6">
            {appliedDiscount ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-olive-600 text-white text-sm px-3 py-1.5 rounded-full">
                  <Tag className="w-3.5 h-3.5" />
                  {appliedDiscount.code} — {appliedDiscount.label}
                  <button
                    onClick={handleRemoveDiscount}
                    className="ml-1 hover:text-red-200 transition-colors"
                    aria-label="Verwijder kortingscode"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
            ) : (
              <div>
                <label className="flex items-center gap-1.5 text-sm text-olive-200 mb-2">
                  <Tag className="w-4 h-4" />
                  Heb je een kortingscode?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => {
                      setDiscountInput(e.target.value.toUpperCase());
                      setDiscountError(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                    placeholder="Kortingscode"
                    className="flex-1 px-3 py-2 rounded-lg bg-olive-600/50 border border-olive-500 text-white placeholder:text-olive-300 text-sm focus:outline-none focus:ring-2 focus:ring-olive-300"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={discountLoading || !discountInput.trim()}
                    className="px-4 py-2 rounded-lg bg-olive-500 hover:bg-olive-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                  >
                    {discountLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Toepassen"
                    )}
                  </button>
                </div>
                {discountError && (
                  <p className="mt-1.5 text-sm text-red-200">{discountError}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm text-olive-200 mb-6">
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
            <div className="mb-4 p-4 bg-red-800/30 border border-red-400/40 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
              <p className="text-sm text-red-100">{error}</p>
            </div>
          )}

          <p className="text-sm text-olive-200 text-center mb-3">
            Door te betalen ga je akkoord met de{" "}
            <a href="/voorwaarden" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">algemene voorwaarden</a>
            {" "}en het{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">privacybeleid</a>.
          </p>

          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-white text-olive-800 hover:bg-olive-50"
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

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-champagne-50 rounded-xl p-6 border border-champagne-200"
        >
          <h3 className="font-heading text-lg font-semibold text-stone-900 mb-2">
            Jullie Save the Date
          </h3>
          <p className="text-stone-600">
            <span className="font-semibold">{partner1Name}</span> &{" "}
            <span className="font-semibold">{partner2Name}</span>
          </p>
          {weddingDate && (
            <p className="text-sm text-stone-500 mt-1">
              {new Date(weddingDate).toLocaleDateString("nl-NL", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          <p className="text-sm text-stone-500 mt-2">
            Na betaling kunnen jullie de Save the Date direct publiceren en delen.
          </p>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <Button variant="ghost" onClick={() => router.push("/std-builder/preview")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug
        </Button>
      </div>
    </div>
  );
}

function StdCheckoutFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-olive-600" />
    </div>
  );
}

export default function StdCheckoutPage() {
  return (
    <Suspense fallback={<StdCheckoutFallback />}>
      <StdCheckoutContent />
    </Suspense>
  );
}
