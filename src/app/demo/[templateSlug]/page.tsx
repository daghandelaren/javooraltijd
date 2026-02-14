"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, MapPin, ChevronDown, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgramIcon } from "@/components/builder/icon-picker";
import { getTemplateBySlug, type Template } from "@/lib/templates";
import { Envelope2D } from "@/components/envelope-2d";
import { CountdownTimer } from "@/components/countdown";
import {
  BloementuinFloralBackground,
  BloementuinSectionAccent,
} from "@/components/bloementuin-floral-bg";
import { RSVPSection } from "@/components/invitation-sections/rsvp-section";
import { DresscodeSection } from "@/components/invitation-sections/dresscode-section";
import { GiftSection } from "@/components/invitation-sections/gift-section";

// Demo data with generic placeholders
const demoData = {
  partner1: "Matthew",
  partner2: "Evelyn",
  monogram: "J&B", // Ja Voor Altijd
  date: "15 juni 2026",
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
            className="pb-24"
          >
            {/* Hero section — names, date, CTA only */}
            <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 text-center relative">
              {/* Botanical floral background */}
              {template.style === "botanical" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <BloementuinFloralBackground />
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 -mt-16"
              >
                <p
                  className="font-accent text-2xl mb-6"
                  style={{
                    color: template.colors.textMuted,
                    fontFamily: `'${template.fonts.accent}', cursive`,
                    ...(template.style === "botanical" && { textShadow: "0 1px 8px rgba(253,251,247,0.8)" }),
                  }}
                >
                  {demoData.headline}
                </p>
                <h1
                  className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight"
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.heading}', serif`,
                    ...(template.style === "botanical" && { textShadow: "0 2px 12px rgba(253,251,247,0.9), 0 0px 4px rgba(253,251,247,0.6)" }),
                  }}
                >
                  {demoData.partner1}
                  <span
                    className="block text-2xl sm:text-3xl my-2 font-normal"
                    style={{ color: template.colors.textMuted }}
                  >
                    &
                  </span>
                  {demoData.partner2}
                </h1>
                {template.style === "botanical" ? (
                  /* Elegant date for botanical — no time, accent font with decorative lines */
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="h-px w-12" style={{ backgroundColor: `${template.colors.primary}40` }} />
                    <p
                      className="text-xl sm:text-2xl capitalize"
                      style={{
                        color: template.colors.text,
                        fontFamily: `'${template.fonts.accent}', cursive`,
                        textShadow: "0 1px 8px rgba(253,251,247,0.8)",
                      }}
                    >
                      {demoData.date}
                    </p>
                    <div className="h-px w-12" style={{ backgroundColor: `${template.colors.primary}40` }} />
                  </div>
                ) : (
                  <p
                    className="mt-8 text-lg capitalize"
                    style={{
                      color: template.colors.text,
                      fontFamily: `'${template.fonts.body}', serif`,
                    }}
                  >
                    {demoData.date} - {demoData.time} uur
                  </p>
                )}
              </motion.div>

              {/* CTA button + chevron at bottom — botanical */}
              {template.style === "botanical" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-10"
                >
                  <button
                    onClick={() => {
                      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex flex-col items-center gap-3 px-8 py-3 transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                  >
                    <span
                      className="text-xs font-semibold tracking-[0.2em] uppercase"
                      style={{ color: "#FDFBF7", textShadow: "0 1px 12px rgba(0,0,0,0.5), 0 0px 4px rgba(0,0,0,0.3)" }}
                    >
                      Bevestig aanwezigheid
                    </span>
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ filter: "drop-shadow(0 1px 8px rgba(0,0,0,0.4))" }}
                    >
                      <ChevronDown
                        className="w-6 h-6"
                        style={{ color: "#FDFBF7" }}
                      />
                    </motion.div>
                  </button>
                </motion.div>
              ) : (
                <div className="mt-10">
                  <button
                    onClick={() => {
                      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200"
                    style={{
                      backgroundColor: template.colors.primary,
                      color: "#FDFBF7",
                    }}
                  >
                    Bevestig aanwezigheid
                  </button>
                </div>
              )}
            </section>

            {/* Countdown */}
            <section
              className={`${template.style === "botanical" ? "py-16 sm:py-20" : "py-16"} px-4`}
              style={{ background: template.style === "botanical" ? "#4A5D4A" : undefined }}
            >
              <div className="max-w-2xl mx-auto text-center">
                {template.style === "botanical" && (
                  <>
                    <h2
                      className="font-heading text-2xl sm:text-3xl mb-2"
                      style={{
                        color: "#FDFBF7",
                        fontFamily: `'${template.fonts.heading}', serif`,
                      }}
                    >
                      Nog even geduld...
                    </h2>
                    <p className="text-sm mb-8" style={{ color: "rgba(253,251,247,0.7)" }}>
                      Tot de grote dag
                    </p>
                  </>
                )}
                <CountdownTimer
                  targetDate={demoWeddingDate}
                  accentColor={template.style === "botanical" ? "#FDFBF7" : template.colors.primary}
                  variant="card"
                  showSeconds={true}
                  theme={template.style === "botanical" ? "botanical" : undefined}
                />
              </div>
            </section>

            {/* Locations */}
            <section className="py-16 px-4 relative">
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
              {template.style === "botanical" && (
                <BloementuinSectionAccent position="bottom" />
              )}
            </section>

            {/* Timeline */}
            {template.style === "botanical" ? (
              /* Horizontal timeline for botanical */
              <section className="py-16 px-4 overflow-hidden" style={{ background: template.colors.background }}>
                <div className="max-w-4xl mx-auto">
                  <h2
                    className="font-heading text-3xl text-center mb-12"
                    style={{
                      color: template.colors.text,
                      fontFamily: `'${template.fonts.heading}', serif`,
                    }}
                  >
                    Dagprogramma
                  </h2>
                  <div className="relative">
                    {/* Horizontal connecting line */}
                    <div
                      className="hidden sm:block absolute left-0 right-0 h-px top-7"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-2 sm:flex-nowrap">
                      {demoData.timeline.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex flex-col items-center text-center relative w-[calc(50%-12px)] sm:w-0 sm:flex-1"
                        >
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center relative z-10 border-2"
                            style={{
                              backgroundColor: template.colors.background,
                              borderColor: template.colors.primary,
                              color: template.colors.primary,
                            }}
                          >
                            <ProgramIcon iconId={item.icon} size="lg" />
                          </div>
                          <p
                            className="text-sm font-semibold mt-3"
                            style={{ color: template.colors.primary }}
                          >
                            {item.time}
                          </p>
                          <h3
                            className="font-heading text-base font-medium mt-1"
                            style={{
                              color: template.colors.text,
                              fontFamily: `'${template.fonts.heading}', serif`,
                            }}
                          >
                            {item.title}
                          </h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              /* Vertical timeline for other templates */
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
                              <ProgramIcon iconId={item.icon} size="lg" />
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
            )}

            {/* Dresscode */}
            <DresscodeSection
              dresscode="Feestelijk chic"
              template={template}
              colors={[{ hex: "#6B8F6B", name: "Salie groen" }, { hex: "#F0EBE3", name: "Ivoor" }]}
            />

            {/* Gift section */}
            <GiftSection
              config={{
                enabled: true,
                message: "Jullie aanwezigheid is het mooiste cadeau. Mochten jullie toch iets willen geven, dan is een bijdrage in de envelop zeer gewaardeerd.",
                preferMoney: true,
                iban: "NL00 BANK 0000 0000 00",
                accountHolder: "Partner 1 & Partner 2",
              }}
              template={template}
            />

            {/* RSVP */}
            <div id="rsvp" className="relative">
              {template.style === "botanical" && (
                <BloementuinSectionAccent side="left" />
              )}
              <RSVPSection
                invitationId="demo"
                enabled={true}
                template={template}
                demo={true}
              />
            </div>

            {/* Footer with names & date */}
            {template.style === "botanical" && (
              <section
                className="py-20 px-4 text-center"
                style={{ backgroundColor: "#4A5D4A" }}
              >
                <Heart className="w-6 h-6 mx-auto mb-4" style={{ color: "rgba(253,251,247,0.5)" }} />
                <h3
                  className="text-2xl sm:text-3xl font-semibold mb-2"
                  style={{
                    color: "#FDFBF7",
                    fontFamily: `'${template.fonts.heading}', serif`,
                  }}
                >
                  {demoData.partner1} & {demoData.partner2}
                </h3>
                <p
                  className="text-sm mb-8 capitalize"
                  style={{
                    color: "rgba(253,251,247,0.7)",
                    fontFamily: `'${template.fonts.body}', serif`,
                  }}
                >
                  {demoData.date}
                </p>
                <p
                  className="text-xs tracking-wider"
                  style={{ color: "rgba(253,251,247,0.4)" }}
                >
                  Ja, Voor Altijd
                </p>
              </section>
            )}

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

