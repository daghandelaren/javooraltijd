"use client";

import * as React from "react";
import { getSealFontCss, getSealFontConfig, DEFAULT_SEAL_FONT, type SealFontId } from "@/lib/wax-fonts";

interface EmbossedInitialsProps {
  initials: string;
  color: string; // Hex color
  size: number; // Size in pixels
  fontSize: number;
  fontId?: SealFontId;
  className?: string;
}

/**
 * EmbossedInitials - Renders initials with SVG lighting-based emboss effect
 *
 * Uses feDiffuseLighting + feSpecularLighting to compute physically-based
 * bevel shading from a height map, combined with mix-blend-mode: soft-light
 * so the wax texture shows through naturally.
 */
export function EmbossedInitials({
  initials,
  color,
  size,
  fontSize,
  fontId = DEFAULT_SEAL_FONT,
  className,
}: EmbossedInitialsProps) {
  const fontConfig = getSealFontConfig(fontId);
  const verticalOffsetPercent = (fontConfig.verticalOffset || 0) * 18;
  const hasWideChar = /[MW]/i.test(initials);
  const adjustedFontSize = fontSize * (fontConfig.sizeMultiplier || 1) * (hasWideChar ? 0.8 : 1);

  // Scale factor normalized around "lg" size (200px)
  const s = size / 200;

  // Unique filter ID for this component instance
  const reactId = React.useId();
  const filterId = `engrave-${reactId.replace(/:/g, "")}`;

  // Bevel parameters
  const bevelBlur = 1.2 * s;     // Controls bevel width — rounded pressed-in look
  const surfaceScale = 8 * s;    // Controls emboss depth — clearly visible 3D letters
  const dc = 0.6;                // diffuseConstant — slightly bright for natural wax tone

  // Drop shadow — Photoshop-style: 105° angle, 8px distance, 24% spread, 6px size, 15% opacity
  const dsDx = 0.3 * s;
  const dsDy = 1 * s;
  const dsBlur = 1 * s;
  const dsDilate = 0.5 * s;

  return (
    <>
      {/* Inline SVG filter definition — zero-size, invisible */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            {/* === DROP SHADOW (behind everything, matching PS Slagschaduw) === */}
            <feOffset in="SourceAlpha" dx={dsDx} dy={dsDy} result="dsOff" />
            <feMorphology in="dsOff" operator="dilate" radius={dsDilate} result="dsSpread" />
            <feGaussianBlur in="dsSpread" stdDeviation={dsBlur} result="dsBlur" />
            <feFlood floodColor="#000000" floodOpacity="0.50" result="dsColor" />
            <feComposite in="dsColor" in2="dsBlur" operator="in" result="dropShadow" />

            {/* Create height map from text shape */}
            <feGaussianBlur in="SourceAlpha" stdDeviation={bevelBlur} result="bump" />

            {/* Diffuse lighting — base shadow/highlight shading */}
            <feDiffuseLighting
              in="bump"
              surfaceScale={surfaceScale}
              diffuseConstant={dc}
              lightingColor="#ffffff"
              result="diffuse"
            >
              <feDistantLight azimuth={270} elevation={45} />
            </feDiffuseLighting>

            {/* Specular lighting — crisp edge highlights */}
            <feSpecularLighting
              in="bump"
              surfaceScale={surfaceScale}
              specularConstant={0.35}
              specularExponent={18}
              lightingColor="#ffffff"
              result="specular"
            >
              <feDistantLight azimuth={270} elevation={45} />
            </feSpecularLighting>

            {/* Combine: add specular highlights on top of diffuse base */}
            <feBlend in="specular" in2="diffuse" mode="screen" result="lit" />

            {/* Clip to text shape */}
            <feComposite in="lit" in2="SourceAlpha" operator="in" result="emboss" />

            {/* Output: drop shadow + emboss */}
            <feMerge>
              <feMergeNode in="dropShadow" />
              <feMergeNode in="emboss" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <span
        className={className}
        aria-hidden="true"
        style={{
          color: "#000000",
          fontFamily: getSealFontCss(fontId),
          fontSize: adjustedFontSize,
          fontWeight: 400,
          letterSpacing: "0.02em",
          lineHeight: 1,
          filter: `url(#${filterId})`,
          mixBlendMode: "soft-light",
          marginTop: `${-verticalOffsetPercent * 0.36}%`,
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {initials.split("").map((char, i) =>
          char === "&" ? (
            <span key={i} style={{ fontSize: "50%", verticalAlign: "middle" }}>{char}</span>
          ) : (
            <React.Fragment key={i}>{char}</React.Fragment>
          )
        )}
      </span>
    </>
  );
}
