"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, MapPin, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { ProgramIcon } from "@/components/builder/icon-picker";
import { getTemplateBySlug, type Template } from "@/lib/templates";
import { Envelope2D } from "@/components/envelope-2d";
import { CountdownTimer } from "@/components/countdown";
import { cn } from "@/lib/utils";

// Demo data with generic placeholders
const demoData = {
  partner1: "Partner 1",
  partner2: "Partner 2",
  monogram: "J&B", // Ja Voor Altijd
  date: "15 juni 2025",
  time: "14:00",
  headline: "Wij gaan trouwen!",
  locations: [
    {
      name: "Locatie A",
      type: "Ceremonie",
      time: "14:00",
      address: "Voorbeeldstraat 1, Amsterdam",
    },
    {
      name: "Locatie B",
      type: "Receptie & Diner",
      time: "17:00",
      address: "Voorbeeldstraat 1, Amsterdam",
    },
  ],
  timeline: [
    { time: "14:00", title: "Ceremonie", icon: "church" },
    { time: "15:00", title: "Borrel", icon: "champagne" },
    { time: "17:00", title: "Diner", icon: "utensils" },
    { time: "21:00", title: "Feest", icon: "party-popper" },
  ],
};

export default function DemoPage({
  params,
}: {
  params: { templateSlug: string };
}) {
  const template = getTemplateBySlug(params.templateSlug);

  if (!template) {
    notFound();
  }

  // Disable right-click and print
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+P
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="demo-protected min-h-screen relative">
      {/* Top CTA bar */}
      <DemoCTABar templateSlug={params.templateSlug} />

      {/* Invitation content */}
      <InvitationContent template={template} />
    </div>
  );
}

function DemoCTABar({ templateSlug }: { templateSlug: string }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-olive-700 text-white py-3 px-4"
    >
      <div className="container-wide flex items-center justify-between gap-4">
        <p className="text-sm sm:text-base font-medium">
          Dit is een voorbeeld. Maak je eigen uitnodiging!
        </p>
        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="bg-white text-olive-700 hover:bg-champagne-100"
          >
            <Link href={`/builder/template?selected=${templateSlug}`}>
              Kies deze template
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-olive-600 rounded"
            aria-label="Sluit"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function InvitationContent({ template }: { template: Template }) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Demo wedding date (future date for countdown)
  const demoWeddingDate = new Date();
  demoWeddingDate.setMonth(demoWeddingDate.getMonth() + 6); // 6 months from now

  return (
    <div
      className="min-h-screen"
      style={{ background: template.colors.backgroundGradient }}
    >
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="envelope"
            className="min-h-screen"
            exit={{ opacity: 0 }}
          >
            <Envelope2D
              sealColor={template.sealColor}
              monogram={demoData.monogram}
              sealText="21 juni 2026"
              onOpen={() => setIsRevealed(true)}
              enableMusic={false}
            />
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-16 pb-24"
          >
            {/* Hero section */}
            <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <WaxSeal
                  initials={demoData.monogram}
                  color={template.sealColor}
                  size="lg"
                  interactive={false}
                />
                <p
                  className="font-accent text-2xl mt-6 mb-4"
                  style={{
                    color: template.colors.textMuted,
                    fontFamily: `'${template.fonts.accent}', cursive`,
                  }}
                >
                  {demoData.headline}
                </p>
                <h1
                  className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold"
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.heading}', serif`,
                  }}
                >
                  {demoData.partner1} & {demoData.partner2}
                </h1>
                <div className="mt-8 flex items-center justify-center gap-4 text-lg">
                  <span
                    className="flex items-center gap-2"
                    style={{ color: template.colors.textMuted }}
                  >
                    <Calendar className="w-5 h-5" />
                    {demoData.date}
                  </span>
                  <span style={{ color: template.colors.secondary }}>-</span>
                  <span
                    className="flex items-center gap-2"
                    style={{ color: template.colors.textMuted }}
                  >
                    <Clock className="w-5 h-5" />
                    {demoData.time}
                  </span>
                </div>

                {/* Countdown Timer */}
                <div className="mt-12">
                  <CountdownTimer
                    targetDate={demoWeddingDate}
                    accentColor={template.colors.primary}
                    variant="card"
                    showSeconds={false}
                  />
                </div>
              </motion.div>
            </section>

            {/* Locations */}
            <section className="py-16 px-4">
              <div className="max-w-2xl mx-auto">
                <h2
                  className="font-heading text-3xl text-center mb-12"
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.heading}', serif`,
                  }}
                >
                  Locatie
                </h2>
                <div className="space-y-6">
                  {demoData.locations.map((location, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-white/60 rounded-xl p-6 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${template.colors.primary}15` }}
                        >
                          <MapPin
                            className="w-6 h-6"
                            style={{ color: template.colors.primary }}
                          />
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: template.colors.primary }}
                          >
                            {location.type} - {location.time}
                          </p>
                          <h3
                            className="font-heading text-xl font-semibold mt-1"
                            style={{
                              color: template.colors.text,
                              fontFamily: `'${template.fonts.heading}', serif`,
                            }}
                          >
                            {location.name}
                          </h3>
                          <p
                            className="mt-1"
                            style={{ color: template.colors.textMuted }}
                          >
                            {location.address}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="py-16 px-4 bg-white/40">
              <div className="max-w-2xl mx-auto">
                <h2
                  className="font-heading text-3xl text-center mb-12"
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.heading}', serif`,
                  }}
                >
                  Programma
                </h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div
                    className="absolute left-6 top-0 bottom-0 w-0.5"
                    style={{ backgroundColor: template.colors.secondary }}
                  />

                  <div className="space-y-8">
                    {demoData.timeline.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="relative pl-16"
                      >
                        {/* Dot */}
                        <div
                          className="absolute left-4 w-5 h-5 rounded-full border-2 bg-white"
                          style={{ borderColor: template.colors.primary }}
                        />

                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: `${template.colors.primary}15`,
                              color: template.colors.primary,
                            }}
                          >
                            <ProgramIcon
                              iconId={item.icon}
                              size="lg"
                            />
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: template.colors.primary }}
                            >
                              {item.time}
                            </p>
                            <h3
                              className="font-heading text-lg font-semibold"
                              style={{
                                color: template.colors.text,
                                fontFamily: `'${template.fonts.heading}', serif`,
                              }}
                            >
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* RSVP Preview (disabled in demo) */}
            <section className="py-16 px-4">
              <div className="max-w-md mx-auto text-center">
                <h2
                  className="font-heading text-3xl mb-4"
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.heading}', serif`,
                  }}
                >
                  RSVP
                </h2>
                <p
                  className="mb-8"
                  style={{ color: template.colors.textMuted }}
                >
                  Laat ons weten of je erbij bent
                </p>
                <div className="bg-white/60 rounded-xl p-6 shadow-sm blur-[2px]">
                  <p className="text-stone-400 text-sm">
                    RSVP formulier (niet beschikbaar in demo)
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-16 px-4">
              <div className="max-w-md mx-auto text-center">
                <p
                  className="font-accent text-xl mb-4"
                  style={{
                    color: template.colors.textMuted,
                    fontFamily: `'${template.fonts.accent}', cursive`,
                  }}
                >
                  Maak je eigen uitnodiging
                </p>
                <Button asChild size="lg">
                  <Link href={`/builder/template?selected=${template.slug}`}>
                    Kies deze template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
