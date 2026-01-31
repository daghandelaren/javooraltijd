import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { getSealFont3DPath, getSealFontConfig, SEAL_FONT_PRESETS, DEFAULT_SEAL_FONT, type SealFontId } from "@/lib/wax-fonts";

// Fallback font from CDN
const FALLBACK_FONT_URL = "https://cdn.jsdelivr.net/npm/three/examples/fonts/droid/droid_serif_bold.typeface.json";

// Font cache - keyed by font ID
const fontCache = new Map<SealFontId, Font>();
const fontLoadPromises = new Map<SealFontId, Promise<Font>>();

// Load font by ID with fallback
export async function loadFont(fontId: SealFontId = DEFAULT_SEAL_FONT): Promise<Font> {
  if (fontCache.has(fontId)) return fontCache.get(fontId)!;
  if (fontLoadPromises.has(fontId)) return fontLoadPromises.get(fontId)!;

  const loader = new FontLoader();
  const primaryPath = getSealFont3DPath(fontId);

  const loadPromise = new Promise<Font>((resolve, reject) => {
    // Try primary font first
    loader.load(
      primaryPath,
      (font) => {
        fontCache.set(fontId, font);
        resolve(font);
      },
      undefined,
      () => {
        // Fallback to CDN font
        loader.load(
          FALLBACK_FONT_URL,
          (font) => {
            fontCache.set(fontId, font);
            resolve(font);
          },
          undefined,
          (error) => {
            reject(error);
          }
        );
      }
    );
  });

  fontLoadPromises.set(fontId, loadPromise);
  return loadPromise;
}

// Text configuration for embossing
export interface EmbossedTextConfig {
  text: string;
  size: number;
  depth: number; // How deep the text is pressed into the wax
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  curveSegments: number;
}

const defaultConfig: EmbossedTextConfig = {
  text: "L & J",
  size: 0.18,  // Smaller text size
  depth: 0.025, // Shallow emboss depth
  bevelEnabled: true,
  bevelThickness: 0.008,
  bevelSize: 0.005,
  bevelSegments: 3,
  curveSegments: 8,
};

// Create 3D text geometry for CSG subtraction (engraving)
export function createTextGeometry(
  font: Font,
  config: Partial<EmbossedTextConfig> = {},
  fontId?: SealFontId
): THREE.BufferGeometry {
  const finalConfig = { ...defaultConfig, ...config };

  const geometry = new TextGeometry(finalConfig.text, {
    font,
    size: finalConfig.size,
    depth: finalConfig.depth,
    bevelEnabled: false, // Cleaner for CSG operations
    curveSegments: finalConfig.curveSegments,
  });

  // Center the geometry
  geometry.computeBoundingBox();
  geometry.center();

  // Rotate so text faces up (Y-up coordinate system)
  // Text will extrude in +Y direction, ready for CSG subtraction
  geometry.rotateX(-Math.PI / 2);

  // Apply font-specific vertical offset after rotation (Z axis on seal surface)
  if (fontId) {
    const fontConfig = getSealFontConfig(fontId);
    if (fontConfig.verticalOffset) {
      geometry.translate(0, 0, -fontConfig.verticalOffset);
    }
  }

  return geometry;
}

// Calculate text scale based on seal radius to fit properly
export function calculateTextScale(
  textWidth: number,
  sealInnerRadius: number,
  padding: number = 0.15
): number {
  const maxWidth = sealInnerRadius * 2 * (1 - padding);
  return maxWidth / textWidth;
}

// Get text bounding dimensions after creating geometry
export function getTextDimensions(geometry: THREE.BufferGeometry): {
  width: number;
  height: number;
  depth: number;
} {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox!;
  return {
    width: bbox.max.x - bbox.min.x,
    height: bbox.max.z - bbox.min.z, // Z because rotated
    depth: bbox.max.y - bbox.min.y, // Y is now depth
  };
}

// Pre-load all fonts on module import for faster initial render
if (typeof window !== "undefined") {
  SEAL_FONT_PRESETS.forEach((preset) => {
    loadFont(preset.id).catch(() => {
      console.warn(`Failed to preload wax seal font: ${preset.id}`);
    });
  });
}
