"use client";

import Image from "next/image";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { type SealFontId, getSealFontCss } from "@/lib/wax-fonts";
import { cn } from "@/lib/utils";

interface EnvelopePreviewProps {
  sealColor: string;
  sealFont?: SealFontId;
  monogram?: string;
  sealText?: string;
  className?: string;
}

/**
 * Static, non-interactive envelope preview for use inside the builder styling step.
 * Renders the envelope body + flap images with the wax seal positioned at ~87.5%
 * from the top (same position as the full-screen Envelope2D).
 */
export function EnvelopePreview({
  sealColor,
  sealFont,
  monogram = "J&B",
  sealText,
  className,
}: EnvelopePreviewProps) {
  return (
    <div className={cn("relative w-full select-none", className)}>
      {/* Envelope body (under layer) */}
      <div className="relative w-full">
        <Image
          src="/images/envelope/under-desktop.png"
          alt="Envelop"
          width={1200}
          height={900}
          className="w-full h-auto block"
          priority
        />

        {/* Flap on top */}
        <div className="absolute top-0 left-0 right-0">
          <Image
            src="/images/envelope/flap-desktop.png"
            alt=""
            width={1200}
            height={450}
            className="w-full h-auto block"
            style={{ filter: "drop-shadow(6px 3px 16px rgba(90,50,20,0.45))" }}
          />
        </div>

        {/* Wax seal — centered at flap/body junction */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: "53%" }}
        >
          {sealText && (
            <p
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none"
              style={{
                bottom: "calc(100% + 0.5rem)",
                fontFamily: getSealFontCss(sealFont ?? "lavishly-yours"),
                fontSize: "1.5rem",
                color: "rgba(90, 78, 65, 0.45)",
                filter: "blur(0.5px)",
                textShadow:
                  "0 1px 1px rgba(255, 255, 255, 0.5), 0 -1px 1px rgba(60, 50, 40, 0.12), 1px 0 1px rgba(255, 255, 255, 0.25), -1px 0 1px rgba(60, 50, 40, 0.06)",
                letterSpacing: "0.02em",
              }}
            >
              {sealText}
            </p>
          )}
          <WaxSeal
            initials={monogram}
            color={sealColor}
            font={sealFont}
            size="lg"
            blur={0.5}
            interactive={false}
          />
        </div>
      </div>
    </div>
  );
}
