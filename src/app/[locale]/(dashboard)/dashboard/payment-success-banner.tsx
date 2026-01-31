"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, PartyPopper, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PaymentSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setShow(true);
      // Clean up URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      router.replace(url.pathname, { scroll: false });
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative mb-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border border-green-200 rounded-xl p-6 overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100/50 rounded-full translate-y-1/2 -translate-x-1/2" />

        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-green-600 hover:text-green-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <PartyPopper className="w-6 h-6 text-green-600" />
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-green-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Gefeliciteerd met jullie uitnodiging!
            </h2>
            <p className="text-green-700 mt-1">
              De betaling is gelukt en jullie uitnodiging is nu actief. Deel de link met jullie gasten en
              houd hier de RSVP&apos;s bij.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
