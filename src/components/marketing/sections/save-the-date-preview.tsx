"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarHeart, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stdTemplates } from "@/lib/std-templates";

const miniPreviews = [
  {
    slug: "std-watercolor-villa",
    bgImage: "/images/std/watercolor-villa/hero.png",
    gradient: "#FDFCFA",
    textColor: "#2C3E50",
    accentColor: "#6B8299",
    namePreview: (
      <div className="flex flex-col items-center text-[#2C3E50] drop-shadow-[0_1px_3px_rgba(255,255,255,0.5)] translate-y-12 sm:translate-y-11">
        <span className="flex items-baseline gap-0.5 sm:gap-1">
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-[6px] sm:text-[8px] uppercase">Thomas</span>
          <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-[8px] sm:text-xs">&amp;</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, letterSpacing: "0.15em" }} className="text-[6px] sm:text-[8px] uppercase">Suzanna</span>
        </span>
        <span className="text-[5px] sm:text-[7px] mt-0.5 tracking-widest uppercase text-[#6B8299]">Save the Date</span>
      </div>
    ),
  },
  {
    slug: "std-limoncello",
    bgImage: "/images/std/limoncello/hero.png",
    gradient: "#4d583f",
    textColor: "#F5F0E0",
    accentColor: "#B8C4A8",
    namePreview: (
      <div className="flex flex-col items-center text-[#F5F0E0]">
        <svg viewBox="0 0 200 30" className="w-20 sm:w-28 mb-0.5 ml-2" aria-hidden="true">
          <defs>
            <path id="std-mini-arc" d="M 15,28 Q 100,2 185,28" fill="none" />
          </defs>
          <text fill="#B8C4A8" fontSize="12" letterSpacing="1.5" style={{ fontFamily: "'Dancing Script', cursive" }}>
            <textPath href="#std-mini-arc" startOffset="55%" textAnchor="middle">save the date</textPath>
          </text>
        </svg>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.08em" }} className="text-[9px] sm:text-xs uppercase">
          JARNO <span style={{ fontStyle: "italic", fontWeight: 400 }}>&amp;</span>
        </span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.08em" }} className="text-[9px] sm:text-xs uppercase">BRYONIE</span>
      </div>
    ),
  },
  {
    slug: "std-minimalist",
    bgImage: null,
    gradient: "linear-gradient(160deg, #FFFFFF 0%, #FAFAFA 40%, #F5F5F5 100%)",
    textColor: "#2C2C2C",
    accentColor: "#999999",
    namePreview: (
      <div className="flex flex-col items-center text-[#2C2C2C]">
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }} className="text-[10px] sm:text-sm uppercase">Ian</span>
        <span style={{ fontFamily: "'Lavishly Yours', cursive" }} className="text-base sm:text-2xl -my-0.5">&amp;</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.2em" }} className="text-[10px] sm:text-sm uppercase">Indy</span>
        <span className="text-[6px] sm:text-[8px] mt-1 tracking-widest uppercase text-[#999]">Save the Date</span>
      </div>
    ),
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
                  <p className="text-sm text-stone-500">Dezelfde elegante openingsanimatie als onze uitnodiging</p>
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
                    {preview.bgImage && (
                      <Image
                        src={preview.bgImage}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 33vw, 20vw"
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-[1]">
                      {preview.namePreview}
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
