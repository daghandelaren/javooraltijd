import * as THREE from "three";

// HSL color utilities
interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToHSL(hex: string): HSL {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 50, l: 50 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Wax color palette derived from single base color
export interface WaxColorPalette {
  base: string;
  lighter: string;
  darker: string;
  subsurface: string;
  sheen: string;
  emboss: string;
}

export function createWaxColorPalette(baseColor: string): WaxColorPalette {
  const hsl = hexToHSL(baseColor);

  return {
    base: baseColor,
    lighter: hslToHex(hsl.h, Math.max(0, hsl.s - 5), Math.min(100, hsl.l + 15)),
    darker: hslToHex(hsl.h, Math.min(100, hsl.s + 5), Math.max(0, hsl.l - 20)),
    subsurface: hslToHex(hsl.h, Math.min(100, hsl.s + 10), Math.min(100, hsl.l + 20)),
    sheen: hslToHex(hsl.h, Math.max(0, hsl.s - 15), Math.min(100, hsl.l + 25)),
    emboss: hslToHex(hsl.h, Math.min(100, hsl.s + 8), Math.max(0, hsl.l - 25)),
  };
}

// Create photorealistic wax material using MeshPhysicalMaterial
export function createWaxMaterial(baseColor: string): THREE.MeshPhysicalMaterial {
  const palette = createWaxColorPalette(baseColor);

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(palette.base),
    roughness: 0.45, // Soft matte wax finish
    metalness: 0.0,
    clearcoat: 0.15, // Subtle waxy surface shine
    clearcoatRoughness: 0.5,
    sheen: 0.4, // Soft waxy sheen like reference
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(palette.lighter),
    transmission: 0.02, // Very subtle translucency
    thickness: 0.8,
    ior: 1.45, // Wax refraction index
    side: THREE.FrontSide,
  });
}

// Create material for embossed/pressed text (darker, more matte)
export function createEmbossMaterial(baseColor: string): THREE.MeshPhysicalMaterial {
  const palette = createWaxColorPalette(baseColor);

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(palette.emboss),
    roughness: 0.55, // More matte in the pressed areas
    metalness: 0.0,
    clearcoat: 0.05, // Less shine in recessed areas
    clearcoatRoughness: 0.6,
    sheen: 0.15,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(palette.darker),
    transmission: 0.01,
    thickness: 0.3,
    ior: 1.45,
    side: THREE.FrontSide,
  });
}

// Create material for raised rim elements
export function createRimMaterial(baseColor: string): THREE.MeshPhysicalMaterial {
  const palette = createWaxColorPalette(baseColor);

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(palette.base),
    roughness: 0.3, // Slightly more polished on raised areas
    metalness: 0.0,
    clearcoat: 0.15,
    clearcoatRoughness: 0.35,
    sheen: 0.3,
    sheenRoughness: 0.4,
    sheenColor: new THREE.Color(palette.lighter),
    transmission: 0.02,
    thickness: 0.5,
    ior: 1.45,
    side: THREE.FrontSide,
  });
}

// Dispose materials properly
export function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(material)) {
    material.forEach((m) => m.dispose());
  } else {
    material.dispose();
  }
}
