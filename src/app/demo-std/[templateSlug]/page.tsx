"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStdTemplateBySlug, stdTemplates } from "@/lib/std-templates";
import { Envelope2D } from "@/components/envelope-2d";
import { HeroSection } from "@/components/invitation-sections";
import { type SealFontId } from "@/lib/wax-fonts";

const demoData: Record<string, { partner1: string; partner2: string; monogram: string }> = {
  "std-watercolor-villa": { partner1: "Thomas", partner2: "Suzanna", monogram: "T&S" },
  "std-limoncello": { partner1: "Jarno", partner2: "Bryonie", monogram: "J&B" },
  "std-minimalist": { partner1: "Ian", partner2: "Indy", monogram: "I&I" },
};

export default function DemoStdPage() {
  const { templateSlug } = useParams<{ templateSlug: string }>();
  const [isOpened, setIsOpened] = useState(false);

  const template = getStdTemplateBySlug(templateSlug);
  if (!template) {
    notFound();
  }

  const data = demoData[templateSlug] || demoData["std-minimalist"];
  const weddingDate = new Date("2026-06-15");

  const sealText = weddingDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen relative">
      {!isOpened ? (
        <Envelope2D
          sealColor={template.sealColor}
          sealFont="lavishly-yours"
          monogram={data.monogram}
          sealText={sealText}
          onOpen={() => setIsOpened(true)}
          enableMusic={false}
        />
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ background: template.colors.backgroundGradient }}
            className="min-h-screen"
          >
            <HeroSection
              partner1Name={data.partner1}
              partner2Name={data.partner2}
              headline="Save the Date"
              weddingDate={weddingDate}
              sealColor={template.sealColor}
              sealFont={"lavishly-yours"}
              monogram={data.monogram}
              template={template}
              isSaveTheDate
            />

            {/* CTA overlay */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="max-w-md mx-auto text-center">
                <p className="text-white/90 text-sm mb-3">
                  Dit is een demo van de &quot;{template.name}&quot; Save the Date
                </p>
                <Link href={`/std-builder/template?selected=${template.slug}`}>
                  <Button className="bg-white text-stone-900 hover:bg-white/90">
                    Maak je eigen Save the Date
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
