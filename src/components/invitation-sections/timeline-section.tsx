"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgramIcon } from "@/components/builder/icon-picker";
import { type Template } from "@/lib/templates";

interface TimelineItem {
  id: string;
  title: string;
  time: string;
  description?: string | null;
  icon?: string | null;
}

interface TimelineSectionProps {
  timeline: TimelineItem[];
  template: Template;
  className?: string;
}

export function TimelineSection({
  timeline,
  template,
  className,
}: TimelineSectionProps) {
  if (!timeline.length) return null;

  const isBotanical = template.style === "botanical";

  if (isBotanical) {
    return (
      <HorizontalTimeline
        timeline={timeline}
        template={template}
        className={className}
      />
    );
  }

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
        className="max-w-2xl mx-auto"
      >
        <h2
          className="font-heading text-2xl sm:text-3xl text-center mb-10"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          <Clock className="w-6 h-6 inline-block mr-2 -mt-1" style={{ color: template.colors.primary }} />
          Dagprogramma
        </h2>

        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: template.colors.accent }}
          />

          <div className="space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-4 w-5 h-5 rounded-full border-2 bg-white -translate-x-1/2"
                  style={{ borderColor: template.colors.primary }}
                />

                {/* Content card */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${template.colors.primary}15`,
                      color: template.colors.primary,
                    }}
                  >
                    <ProgramIcon
                      iconId={item.icon || "map-pin"}
                      size="lg"
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 pt-1">
                    <p
                      className="text-sm font-semibold mb-0.5"
                      style={{ color: template.colors.primary }}
                    >
                      {item.time}
                    </p>
                    <h3
                      className="font-heading text-lg font-medium"
                      style={{
                        color: template.colors.text,
                        fontFamily: `'${template.fonts.heading}', serif`,
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className="text-sm mt-1"
                        style={{ color: template.colors.textMuted }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function HorizontalTimeline({
  timeline,
  template,
  className,
}: TimelineSectionProps) {
  return (
    <section
      className={cn("py-16 px-4 overflow-hidden", className)}
      style={{ background: template.colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h2
          className="font-heading text-2xl sm:text-3xl text-center mb-12"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          Dagprogramma
        </h2>

        {/* Horizontal timeline */}
        <div className="relative">
          {/* Horizontal connecting line — positioned at center of icon circles */}
          <div
            className="hidden sm:block absolute left-0 right-0 h-px top-7"
            style={{ backgroundColor: template.colors.accent }}
          />

          {/* Items row — 2 cols on mobile, all items in one row on sm+ */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-2 sm:flex-nowrap">
            {timeline.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center text-center relative w-[calc(50%-12px)] sm:w-0 sm:flex-1"
              >
                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center relative z-10 border-2"
                  style={{
                    backgroundColor: template.colors.background,
                    borderColor: template.colors.primary,
                    color: template.colors.primary,
                  }}
                >
                  <ProgramIcon
                    iconId={item.icon || "map-pin"}
                    size="lg"
                  />
                </div>

                {/* Time */}
                <p
                  className="text-sm font-semibold mt-3"
                  style={{ color: template.colors.primary }}
                >
                  {item.time}
                </p>

                {/* Title */}
                <h3
                  className="font-heading text-base font-medium mt-1"
                  style={{
                    color: template.colors.text,
                    fontFamily: `'${template.fonts.heading}', serif`,
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                {item.description && (
                  <p
                    className="text-xs mt-1 max-w-[140px]"
                    style={{ color: template.colors.textMuted }}
                  >
                    {item.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
