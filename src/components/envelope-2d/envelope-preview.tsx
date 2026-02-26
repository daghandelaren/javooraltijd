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

export function EnvelopePreview({
  sealColor,
  sealFont,
  monogram = "J&B",
  sealText,
  className,
}: EnvelopePreviewProps) {
  const sealStyle = {
    fontFamily: getSealFontCss("lavishly-yours"),
    color: "rgba(90, 78, 65, 0.45)",
    filter: "blur(0.5px)",
    textShadow:
      "0 1px 1px rgba(255,255,255,0.5), 0 -1px 1px rgba(60,50,40,0.12), 1px 0 1px rgba(255,255,255,0.25), -1px 0 1px rgba(60,50,40,0.06)",
    letterSpacing: "0.02em",
  };

  const sealShadow = { filter: "drop-shadow(6px 8px 10px rgba(70,42,18,0.45))" };

  return (
    <div className={cn("relative w-full select-none", className)}>

      {/* ─── MOBILE (< sm): landscape image, smaller seal ─── */}
      <div className="block sm:hidden relative w-full">
        <Image
          src="/images/envelope/under-desktop.png"
          alt="Envelop"
          width={1200}
          height={900}
          className="w-full h-auto block"
          priority
        />
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
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: "46%" }}
        >
          {sealText && (
            <p
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none"
              style={{
                bottom: "calc(100% + 0.3rem)",
                fontSize: "1rem",
                ...sealStyle,
              }}
            >
              {sealText}
            </p>
          )}
          <div style={sealShadow}>
            <WaxSeal
              initials={monogram}
              color={sealColor}
              font={sealFont}
              size="md"
              blur={0.5}
              interactive={false}
            />
          </div>
        </div>
      </div>

      {/* ─── DESKTOP (≥ sm): landscape image, full-size seal ─── */}
      <div className="hidden sm:block relative w-full">
        <Image
          src="/images/envelope/under-desktop.png"
          alt="Envelop"
          width={1200}
          height={900}
          className="w-full h-auto block"
          priority
        />
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
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: "46%" }}
        >
          {sealText && (
            <p
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none"
              style={{
                bottom: "calc(100% + 0.5rem)",
                fontSize: "1.9rem",
                ...sealStyle,
              }}
            >
              {sealText}
            </p>
          )}
          <div style={sealShadow}>
            <WaxSeal
              initials={monogram}
              color={sealColor}
              font={sealFont}
              size="xl"
              blur={0.5}
              interactive={false}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
