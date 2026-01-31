"use client";

import * as React from "react";
import { createWaxColorPalette } from "@/lib/wax-colors";
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
 * EmbossedInitials - Renders initials with realistic SVG filter-based embossing
 *
 * Uses feDiffuseLighting and feSpecularLighting to simulate light hitting
 * a pressed-in surface, creating a convincing "stamped into wax" effect.
 *
 * Colors are now generated dynamically from the base color using createWaxColorPalette.
 */
export function EmbossedInitials({
  initials,
  color,
  size,
  fontSize,
  fontId = DEFAULT_SEAL_FONT,
  className,
}: EmbossedInitialsProps) {
  // Generate colors dynamically from the input hex color
  const palette = createWaxColorPalette(color);
  const colors = {
    base: palette.base,
    dark: palette.emboss,
    light: palette.lighter,
  };

  // Get font config for vertical offset and size multiplier (matches 3D seal behavior)
  const fontConfig = getSealFontConfig(fontId);
  const verticalOffsetPercent = (fontConfig.verticalOffset || 0) * 18; // Convert 3D units to %
  const yPosition = `${51 - verticalOffsetPercent}%`;
  const adjustedFontSize = fontSize * (fontConfig.sizeMultiplier || 1);

  const filterId = React.useId().replace(/:/g, '_');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Embossed/inset filter - simulates pressed-in text */}
        <filter
          id={`emboss-${filterId}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          {/* Step 1: Create alpha channel from source */}
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="0.8"
            result="blur"
          />

          {/* Step 2: Diffuse lighting - main surface shading */}
          {/* Light from top-left creates shadow on top-left edges (inset effect) */}
          <feDiffuseLighting
            in="blur"
            result="diffuse"
            surfaceScale="3"
            diffuseConstant="0.8"
            lightingColor={colors.light}
          >
            <fePointLight x={-size * 0.3} y={-size * 0.3} z={size * 0.4} />
          </feDiffuseLighting>

          {/* Step 3: Specular lighting - wax shine/highlights */}
          <feSpecularLighting
            in="blur"
            result="specular"
            surfaceScale="2"
            specularConstant="0.6"
            specularExponent="20"
            lightingColor="#ffffff"
          >
            <fePointLight x={-size * 0.3} y={-size * 0.3} z={size * 0.5} />
          </feSpecularLighting>

          {/* Step 4: Multiply diffuse with base color */}
          <feFlood floodColor={colors.base} result="baseColor" />
          <feComposite
            in="baseColor"
            in2="diffuse"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="-0.5"
            result="coloredDiffuse"
          />

          {/* Step 5: Clip to original text shape */}
          <feComposite
            in="coloredDiffuse"
            in2="SourceAlpha"
            operator="in"
            result="clippedDiffuse"
          />

          {/* Step 6: Add subtle specular highlights */}
          <feComposite
            in="specular"
            in2="SourceAlpha"
            operator="in"
            result="clippedSpecular"
          />

          {/* Step 7: Blend specular onto diffuse */}
          <feBlend
            in="clippedSpecular"
            in2="clippedDiffuse"
            mode="screen"
            result="lit"
          />

          {/* Step 8: Add inner shadow for depth */}
          <feOffset in="SourceAlpha" dx="1" dy="1" result="offsetAlpha" />
          <feGaussianBlur in="offsetAlpha" stdDeviation="1" result="blurredOffset" />
          <feFlood floodColor={colors.dark} floodOpacity="0.4" result="shadowColor" />
          <feComposite in="shadowColor" in2="blurredOffset" operator="in" result="shadow" />

          {/* Step 9: Combine shadow with lit text */}
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="lit" />
          </feMerge>
        </filter>
      </defs>

      {/* Rendered text with emboss filter */}
      <text
        x="50%"
        y={yPosition}
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fontFamily: getSealFontCss(fontId),
          fontSize: adjustedFontSize,
          fontWeight: 400,
          letterSpacing: "0.02em",
          fill: colors.base,
          filter: `url(#emboss-${filterId})`,
        }}
      >
        {initials}
      </text>
    </svg>
  );
}
