"use client";

import { motion } from "framer-motion";
import { Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Template } from "@/lib/templates";

interface DresscodeSectionProps {
  dresscode: string;
  template: Template;
  className?: string;
}

export function DresscodeSection({
  dresscode,
  template,
  className,
}: DresscodeSectionProps) {
  if (!dresscode) return null;

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
          className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl"
          style={{
            backgroundColor: `${template.colors.accent}`,
            border: `1px solid ${template.colors.primary}20`,
          }}
        >
          <Shirt className="w-5 h-5" style={{ color: template.colors.primary }} />
          <div>
            <p
              className="text-xs uppercase tracking-wider mb-0.5"
              style={{ color: template.colors.textMuted }}
            >
              Dresscode
            </p>
            <p
              className="font-medium"
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.body}', serif`,
              }}
            >
              {dresscode}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
