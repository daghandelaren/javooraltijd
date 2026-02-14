"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Template } from "@/lib/templates";

interface DresscodeColor {
  hex: string;
  name: string;
}

interface DresscodeSectionProps {
  dresscode: string;
  template: Template;
  colors?: DresscodeColor[];
  className?: string;
}

export function DresscodeSection({
  dresscode,
  template,
  colors,
  className,
}: DresscodeSectionProps) {
  if (!dresscode) return null;

  const isBotanical = template.style === "botanical";

  if (isBotanical) {
    return (
      <section
        className={cn("py-16 px-4", className)}
        style={{ background: template.colors.background }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Elegant botanical card */}
          <div
            className="relative rounded-2xl px-8 py-10 sm:px-10 sm:py-12 text-center overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.55)",
              border: `1px solid ${template.colors.primary}20`,
              boxShadow: `0 4px 24px ${template.colors.primary}08`,
            }}
          >
            {/* Decorative corner flourishes */}
            <div
              className="absolute top-4 left-4 w-8 h-8 border-t border-l rounded-tl-sm"
              style={{ borderColor: `${template.colors.primary}30` }}
            />
            <div
              className="absolute top-4 right-4 w-8 h-8 border-t border-r rounded-tr-sm"
              style={{ borderColor: `${template.colors.primary}30` }}
            />
            <div
              className="absolute bottom-4 left-4 w-8 h-8 border-b border-l rounded-bl-sm"
              style={{ borderColor: `${template.colors.primary}30` }}
            />
            <div
              className="absolute bottom-4 right-4 w-8 h-8 border-b border-r rounded-br-sm"
              style={{ borderColor: `${template.colors.primary}30` }}
            />

            {/* Label */}
            <p
              className="text-[0.65rem] uppercase tracking-[0.25em] mb-3"
              style={{ color: template.colors.textMuted }}
            >
              Dresscode
            </p>

            {/* Dresscode name */}
            <h3
              className="text-2xl sm:text-3xl mb-1"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {dresscode}
            </h3>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 my-5">
              <div
                className="h-px w-10"
                style={{ backgroundColor: `${template.colors.primary}30` }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: `${template.colors.primary}40` }}
              />
              <div
                className="h-px w-10"
                style={{ backgroundColor: `${template.colors.primary}30` }}
              />
            </div>

            {/* Color swatches */}
            {colors && colors.length > 0 && (
              <div className="flex items-center justify-center gap-5">
                {colors.map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-sm"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: `0 2px 8px ${color.hex}30, inset 0 1px 2px rgba(255,255,255,0.3)`,
                      }}
                    />
                    <span
                      className="text-[0.6rem] uppercase tracking-[0.15em]"
                      style={{ color: template.colors.textMuted }}
                    >
                      {color.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    );
  }

  // Default non-botanical variant
  return (
    <section
      className={cn("py-12 px-4", className)}
      style={{ background: template.colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto text-center"
      >
        <div
          className="inline-flex flex-col items-center gap-4 px-8 py-6 rounded-2xl"
          style={{
            backgroundColor: template.colors.accent,
            border: `1px solid ${template.colors.primary}20`,
          }}
        >
          <div>
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: template.colors.textMuted }}
            >
              Dresscode
            </p>
            <p
              className="font-medium text-lg"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.body}', serif`,
              }}
            >
              {dresscode}
            </p>
          </div>

          {/* Color swatches */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-4 pt-1">
              {colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-full border"
                    style={{
                      backgroundColor: color.hex,
                      borderColor: `${template.colors.primary}20`,
                    }}
                  />
                  <span
                    className="text-[0.6rem] uppercase tracking-wider"
                    style={{ color: template.colors.textMuted }}
                  >
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
