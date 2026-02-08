"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Share2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaxSeal } from "@/components/wax-seal/wax-seal";

interface InvitationData {
  id: string;
  shareId: string;
  partner1Name: string;
  partner2Name: string;
  status: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Fetch invitation details
    async function fetchInvitation() {
      try {
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setInvitation(data.invitation);
        }
      } catch (error) {
        console.error("Failed to fetch invitation:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvitation();
  }, [sessionId]);

  const shareUrl = invitation
    ? `${window.location.origin}/u/${invitation.shareId}`
    : "";

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-olive-600" />
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900 mb-4">
            Betaling geslaagd!
          </h1>

          {invitation && (
            <p className="text-lg text-stone-600 mb-8">
              De uitnodiging van{" "}
              <span className="font-semibold">{invitation.partner1Name}</span> &{" "}
              <span className="font-semibold">{invitation.partner2Name}</span>{" "}
              is nu actief.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-champagne-200 mb-8"
        >
          <div className="flex justify-center mb-6">
            <WaxSeal size="lg" color="#8EA870" />
          </div>

          <h2 className="font-heading text-xl font-semibold text-stone-900 mb-4">
            Deel jullie uitnodiging
          </h2>

          {shareUrl && (
            <div className="bg-champagne-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-stone-500 mb-2">Jullie unieke link:</p>
              <p className="font-mono text-sm text-stone-800 break-all">
                {shareUrl}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCopyLink}
              className="flex-1 bg-olive-600 hover:bg-olive-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {copied ? "Gekopieerd!" : "Kopieer link"}
            </Button>
            {shareUrl && (
              <Button
                asChild
                variant="outline"
                className="flex-1"
              >
                <Link href={shareUrl} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Bekijk uitnodiging
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <p className="text-stone-600">
            Jullie kunnen de uitnodiging beheren in het dashboard.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard?payment=success">
              Naar dashboard
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-olive-600" />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
