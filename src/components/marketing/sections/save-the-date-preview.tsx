"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarHeart, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stdTemplates } from "@/lib/std-templates";

const miniPreviews = [
  {
    slug: "std-watercolor-villa",
    gradient: "linear-gradient(160deg, #EEF4F9 0%, #D4E4F0 40%, #B8D4E8 100%)",
    textColor: "#2C3E50",
    accentColor: "#6B8299",
  },
  {
    slug: "std-limoncello",
    gradient: "linear-gradient(160deg, #1A2E1A 0%, #243524 40%, #1A2E1A 100%)",
    textColor: "#F5F0E0",
    accentColor: "#B8C4A8",
  },
  {
    slug: "std-minimalist",
    gradient: "linear-gradient(160deg, #FFFFFF 0%, #FAFAFA 40%, #F5F5F5 100%)",
    textColor: "#2C2C2C",
    accentColor: "#999999",
  },
];

export function SaveTheDatePreviewSection() {
  return (
    <section className="section-padding bg-champagne-50/50">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center">
                <CalendarHeart className="w-5 h-5 text-olive-600" />
              </div>
              <span className="text-sm font-semibold text-olive-600 uppercase tracking-wider">
                Nieuw
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-stone-900 mb-4">
              Save the Date
            </h2>
            <p className="text-lg text-stone-600 mb-8">
              Laat jullie gasten alvast de datum reserveren met een elegante digitale kaart.
              Dezelfde premium envelop-animatie, nu als compacte Save the Date.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-olive-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <CalendarHeart className="w-4 h-4 text-olive-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-800">Envelop met lakzegel animatie</p>
                  <p className="text-sm text-stone-500">Dezelfde elegante openingsanimatie als jullie uitnodiging</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-olive-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-4 h-4 text-olive-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-800">Bezoekers-tracking</p>
                  <p className="text-sm text-stone-500">Zie hoeveel gasten jullie kaart hebben geopend</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-olive-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-olive-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-800">12 maanden online voor &euro;75</p>
                  <p className="text-sm text-stone-500">Eenmalig bedrag, geen abonnement</p>
                </div>
              </div>
            </div>

            <Button asChild size="lg" className="hidden lg:inline-flex">
              <Link href="/templates?tab=save-the-date">
                Ontdek Save the Date
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right — Mini template previews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-3 sm:gap-4"
          >
            {miniPreviews.map((preview, index) => {
              const template = stdTemplates.find((t) => t.slug === preview.slug);
              if (!template) return null;

              return (
                <motion.div
                  key={preview.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={`/demo-std/${template.slug}`}
                    className="block aspect-[3/4] rounded-xl overflow-hidden relative shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    style={{ background: preview.gradient }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <p
                        className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-light mb-2"
                        style={{ color: preview.accentColor }}
                      >
                        Save the Date
                      </p>
                      <p
                        className="font-heading text-sm sm:text-base font-semibold"
                        style={{ color: preview.textColor }}
                      >
                        {template.name}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA below templates on mobile */}
          <div className="lg:hidden">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/templates?tab=save-the-date">
                Ontdek Save the Date
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
