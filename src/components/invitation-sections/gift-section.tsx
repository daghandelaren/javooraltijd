"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ChevronDown, Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Template } from "@/lib/templates";

interface GiftConfig {
  enabled: boolean;
  message: string;
  preferMoney: boolean;
  registryUrl?: string;
  iban?: string;
  accountHolder?: string;
}

interface GiftSectionProps {
  config: GiftConfig;
  template: Template;
  className?: string;
}

export function GiftSection({
  config,
  template,
  className,
}: GiftSectionProps) {
  const [showIban, setShowIban] = useState(false);
  const [copied, setCopied] = useState(false);
  const confettiFired = useRef(false);

  const isBotanical = template.style === "botanical";

  const fireConfetti = useCallback(async () => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [template.colors.primary, "#D4AF37", "#8FBC8F", "#F5DEB3"],
    });
  }, [template.colors.primary]);

  if (!config.enabled) return null;

  const handleCopyIban = async () => {
    if (!config.iban) return;

    try {
      await navigator.clipboard.writeText(config.iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy IBAN:", err);
    }
  };

  return (
    <section
      className={cn("py-16 px-4", className)}
      style={{ background: template.colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto"
      >
        <h2
          className="font-heading text-2xl sm:text-3xl text-center mb-6"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          <Gift className="w-6 h-6 inline-block mr-2 -mt-1" style={{ color: template.colors.primary }} />
          {isBotanical ? "Cadeau tip" : "Cadeau"}
        </h2>

        <div
          className="rounded-2xl p-6 text-center"
          style={{
            backgroundColor: `${template.colors.accent}`,
            border: `1px solid ${template.colors.primary}20`,
          }}
        >
          {/* Message */}
          {config.message && (
            <p
              className="text-base mb-6"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.body}', serif`,
              }}
            >
              {config.message}
            </p>
          )}

          {/* IBAN expandable section */}
          {config.iban && (
            <div className="mt-4">
              <button
                onClick={() => {
                  const willOpen = !showIban;
                  setShowIban(willOpen);
                  if (willOpen) fireConfetti();
                }}
                className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: template.colors.primary }}
              >
                Toon bankgegevens
                <motion.div
                  animate={{ rotate: showIban ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showIban && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-4 p-4 rounded-xl"
                      style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                    >
                      {config.accountHolder && (
                        <p
                          className="text-sm mb-2"
                          style={{ color: template.colors.textMuted }}
                        >
                          T.n.v. <strong style={{ color: template.colors.text }}>{config.accountHolder}</strong>
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-3">
                        <code
                          className="text-lg font-mono tracking-wide"
                          style={{ color: template.colors.text }}
                        >
                          {config.iban}
                        </code>
                        <button
                          onClick={handleCopyIban}
                          className="p-2 rounded-lg transition-colors hover:bg-black/5"
                          title="Kopieer IBAN"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5" style={{ color: template.colors.textMuted }} />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Registry link */}
          {config.registryUrl && (
            <a
              href={config.registryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: template.colors.primary }}
            >
              Bekijk onze verlanglijst
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}
