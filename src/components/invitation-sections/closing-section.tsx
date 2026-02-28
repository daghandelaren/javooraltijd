"use client";

import { Heart } from "lucide-react";
import { type Template } from "@/lib/templates";

interface ClosingSectionProps {
  partner1Name: string;
  partner2Name: string;
  weddingDate: Date;
  template: Template;
}

export function ClosingSection({
  partner1Name,
  partner2Name,
  weddingDate,
  template,
}: ClosingSectionProps) {
  const formattedDate = weddingDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (template.style === "botanical") {
    return (
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "#4A5D4A" }}
      >
        <Heart
          className="w-6 h-6 mx-auto mb-4"
          style={{ color: "rgba(253,251,247,0.5)" }}
        />
        <h3
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{
            color: "#FDFBF7",
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          {partner1Name} & {partner2Name}
        </h3>
        <p
          className="text-sm mb-8 capitalize"
          style={{
            color: "rgba(253,251,247,0.7)",
            fontFamily: `'${template.fonts.body}', serif`,
          }}
        >
          {formattedDate}
        </p>
        <p
          className="text-xs tracking-wider"
          style={{ color: "rgba(253,251,247,0.4)" }}
        >
          Ja, Voor Altijd
        </p>
      </section>
    );
  }

  if (template.style === "coastal") {
    return (
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "#C4A47C" }}
      >
        <Heart
          className="w-6 h-6 mx-auto mb-4"
          style={{ color: "rgba(253,251,247,0.5)" }}
        />
        <h3 className="text-2xl sm:text-3xl mb-2">
          <span
            className="font-bold uppercase tracking-[0.08em]"
            style={{
              color: "#FDFBF7",
              fontFamily: `'${template.fonts.heading}', serif`,
            }}
          >
            {partner1Name}
          </span>
          <span
            className="inline-block mx-2 text-xl sm:text-2xl"
            style={{
              color: "rgba(253,251,247,0.8)",
              fontFamily: `'${template.fonts.accent}', cursive`,
              fontWeight: 400,
            }}
          >
            &
          </span>
          <span
            className="font-bold uppercase tracking-[0.08em]"
            style={{
              color: "#FDFBF7",
              fontFamily: `'${template.fonts.heading}', serif`,
            }}
          >
            {partner2Name}
          </span>
        </h3>
        <p
          className="text-sm mb-8 capitalize"
          style={{
            color: "rgba(253,251,247,0.7)",
            fontFamily: `'${template.fonts.body}', serif`,
          }}
        >
          {formattedDate}
        </p>
        <p
          className="text-xs tracking-wider"
          style={{ color: "rgba(253,251,247,0.4)" }}
        >
          Ja, Voor Altijd
        </p>
      </section>
    );
  }

  if (template.style === "mediterranean") {
    return (
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: template.colors.accent }}
      >
        <Heart
          className="w-6 h-6 mx-auto mb-4"
          style={{ color: `${template.colors.secondary}80` }}
        />
        <h3
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{
            color: template.colors.text,
            fontFamily: `'${template.fonts.heading}', serif`,
          }}
        >
          {partner1Name} & {partner2Name}
        </h3>
        <p
          className="text-sm mb-8 capitalize"
          style={{
            color: template.colors.textMuted,
            fontFamily: `'${template.fonts.body}', serif`,
          }}
        >
          {formattedDate}
        </p>
        <p
          className="text-xs tracking-wider"
          style={{ color: `${template.colors.textMuted}80` }}
        >
          Ja, Voor Altijd
        </p>
      </section>
    );
  }

  if (template.style === "minimalist") {
    return (
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl sm:text-3xl font-light tracking-[0.1em] uppercase mb-3">
            <span
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner1Name}
            </span>
            <span
              className="inline-block mx-3 text-xl sm:text-2xl normal-case tracking-normal"
              style={{
                color: template.colors.textMuted,
                fontFamily: `'${template.fonts.accent}', cursive`,
                fontWeight: 400,
              }}
            >
              &
            </span>
            <span
              style={{
                color: template.colors.text,
                fontFamily: `'${template.fonts.heading}', serif`,
              }}
            >
              {partner2Name}
            </span>
          </h3>
          <div
            className="w-16 h-px mx-auto mb-3"
            style={{ backgroundColor: "#E0E0E0" }}
          />
          <p
            className="text-sm capitalize tracking-wide"
            style={{
              color: template.colors.textMuted,
              fontFamily: `'${template.fonts.body}', serif`,
            }}
          >
            {formattedDate}
          </p>
        </div>
      </section>
    );
  }

  // Fallback for any other styles
  return (
    <section
      className="py-20 px-4 text-center"
      style={{ backgroundColor: template.colors.background }}
    >
      <Heart
        className="w-6 h-6 mx-auto mb-4"
        style={{ color: template.colors.primary }}
      />
      <h3
        className="text-2xl sm:text-3xl font-semibold mb-2"
        style={{
          color: template.colors.text,
          fontFamily: `'${template.fonts.heading}', serif`,
        }}
      >
        {partner1Name} & {partner2Name}
      </h3>
      <p
        className="text-sm mb-8 capitalize"
        style={{
          color: template.colors.textMuted,
          fontFamily: `'${template.fonts.body}', serif`,
        }}
      >
        {formattedDate}
      </p>
      <p
        className="text-xs tracking-wider"
        style={{ color: template.colors.textMuted }}
      >
        Ja, Voor Altijd
      </p>
    </section>
  );
}
