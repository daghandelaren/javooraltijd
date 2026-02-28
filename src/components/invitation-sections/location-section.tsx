"use client";

import { motion } from "framer-motion";
import { Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Template } from "@/lib/templates";
import { RivieraTileAccent } from "@/components/riviera-tile-accent";
import { BloementuinSectionAccent } from "@/components/bloementuin-floral-bg";
import { LaDolceVitaSectionAccent } from "@/components/ladolcevita-citrus-bg";
import { ProgramIcon } from "@/components/builder/icon-picker";

interface Location {
  id: string;
  name: string;
  address: string;
  time: string;
  type: string;
  icon?: string;
  notes?: string | null;
  mapsUrl?: string | null;
}

interface LocationSectionProps {
  locations: Location[];
  template: Template;
  className?: string;
}

const locationTypeLabels: Record<string, string> = {
  ceremony: "Ceremonie",
  reception: "Receptie",
  dinner: "Diner",
  party: "Feest",
  other: "Overig",
};

export function LocationSection({
  locations,
  template,
  className,
}: LocationSectionProps) {
  if (!locations.length) return null;

  return (
    <section
      className={cn("py-16 px-4 relative overflow-hidden", className)}
      style={{ background: template.colors.backgroundGradient }}
    >
      {template.style === "coastal" && <RivieraTileAccent />}
      {template.style === "botanical" && (
        <>
          <BloementuinSectionAccent side="left" />
          <BloementuinSectionAccent side="right" />
        </>
      )}
      {template.style === "mediterranean" && (
        <>
          <LaDolceVitaSectionAccent side="left" />
          <LaDolceVitaSectionAccent side="right" />
        </>
      )}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <h2
          className="font-heading text-2xl sm:text-3xl text-center mb-10"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          Locatie{locations.length > 1 ? "s" : ""}
        </h2>

        <div className="space-y-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <LocationCard location={location} template={template} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function LocationCard({
  location,
  template,
}: {
  location: Location;
  template: Template;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-sm"
      style={{
        backgroundColor: template.style === "mediterranean" ? "#FFF8E7" : "rgba(255,255,255,0.8)",
        border: `1px solid ${template.colors.accent}`,
      }}
    >
      {/* Accent stripe */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: template.colors.primary }}
      />

      <div className="p-6 pl-8">
        {/* Type badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
          style={{
            backgroundColor: `${template.colors.primary}15`,
            color: template.colors.primary,
          }}
        >
          {location.icon ? (
            <ProgramIcon iconId={location.icon} size="sm" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {locationTypeLabels[location.type] || location.type} - {location.time}
        </div>

        {/* Venue name */}
        <h3
          className="font-heading text-xl font-semibold mb-2"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          {location.name}
        </h3>

        {/* Address */}
        <p
          className="text-sm mb-3"
          style={{ color: template.colors.textMuted }}
        >
          {location.address}
        </p>

        {/* Notes */}
        {location.notes && (
          <p
            className="text-sm italic mb-3"
            style={{ color: template.colors.textMuted }}
          >
            {location.notes}
          </p>
        )}

        {/* Maps link */}
        {location.mapsUrl && (
          <a
            href={location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: template.colors.primary }}
          >
            Bekijk op kaart
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
