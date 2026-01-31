import * as THREE from "three";

// Seeded pseudo-random number generator for reproducible edges
export function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// Smooth interpolation function (cubic)
const smoothStep = (t: number) => t * t * (3 - 2 * t);

const interpolate = (arr: number[], t: number): number => {
  const len = arr.length;
  const idx = t * len;
  const i0 = Math.floor(idx) % len;
  const i1 = (i0 + 1) % len;
  const frac = smoothStep(idx - Math.floor(idx));
  return arr[i0] * (1 - frac) + arr[i1] * frac;
};

// Generate organic edge points with multi-frequency noise (3 frequencies as per plan)
export function generateOrganicEdgePoints(
  baseRadius: number,
  seed: number = 42,
  segments: number = 128
): THREE.Vector2[] {
  const random = seededRandom(seed);
  const points: THREE.Vector2[] = [];

  // Pre-generate noise values for smooth interpolation
  // 3-frequency noise for natural wax edge
  const primaryWave: number[] = []; // Large undulations
  const secondaryWave: number[] = []; // Medium detail
  const tertiaryNoise: number[] = []; // Fine detail

  // Generate noise at different resolutions
  const primaryRes = 6; // Fewer points for larger waves
  const secondaryRes = 14;
  const tertiaryRes = 32;

  for (let i = 0; i < primaryRes; i++) {
    primaryWave.push((random() - 0.5) * 2);
  }
  for (let i = 0; i < secondaryRes; i++) {
    secondaryWave.push((random() - 0.5) * 2);
  }
  for (let i = 0; i < tertiaryRes; i++) {
    tertiaryNoise.push((random() - 0.5) * 2);
  }

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2;

    // Multi-frequency displacement for natural wax edge
    const primary = interpolate(primaryWave, t) * baseRadius * 0.05; // Large waves
    const secondary = interpolate(secondaryWave, t) * baseRadius * 0.025; // Medium detail
    const tertiary = interpolate(tertiaryNoise, t) * baseRadius * 0.012; // Fine detail

    const displacement = primary + secondary + tertiary;
    const r = baseRadius + displacement;

    points.push(new THREE.Vector2(Math.cos(angle) * r, Math.sin(angle) * r));
  }

  return points;
}

// Create the main seal geometry with organic edges and improved bevel
export function createSealGeometry(
  baseRadius: number = 1,
  thickness: number = 0.18, // Increased thickness
  seed: number = 42,
  segments: number = 128
): THREE.ExtrudeGeometry {
  const points = generateOrganicEdgePoints(baseRadius, seed, segments);
  const shape = new THREE.Shape(points);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.3, // More pronounced bevel
    bevelSize: thickness * 0.25,
    bevelOffset: 0,
    bevelSegments: 10, // Smoother bevel
    curveSegments: segments,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Center the geometry
  geometry.center();

  // Rotate so the seal faces the camera (Z-up to Y-up)
  geometry.rotateX(-Math.PI / 2);

  return geometry;
}

// Create raised outer rim ring (concentric border like reference photo)
export function createOuterRimGeometry(
  innerRadius: number = 0.72,
  outerRadius: number = 0.78,
  height: number = 0.04,
  segments: number = 64
): THREE.BufferGeometry {
  // Create a torus-like shape for the raised rim
  const shape = new THREE.Shape();

  // Outer circle
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  // Inner hole
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: height,
    bevelEnabled: true,
    bevelThickness: height * 0.3,
    bevelSize: height * 0.2,
    bevelOffset: 0,
    bevelSegments: 4,
    curveSegments: segments,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(-Math.PI / 2);

  return geometry;
}

// Create inner rim ring (secondary decorative ring)
export function createInnerRimGeometry(
  innerRadius: number = 0.62,
  outerRadius: number = 0.66,
  height: number = 0.025,
  segments: number = 64
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: height,
    bevelEnabled: true,
    bevelThickness: height * 0.25,
    bevelSize: height * 0.15,
    bevelOffset: 0,
    bevelSegments: 3,
    curveSegments: segments,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(-Math.PI / 2);

  return geometry;
}

// Create recessed center area for text placement
export function createRecessedCenterGeometry(
  radius: number = 0.58,
  depth: number = 0.02,
  segments: number = 64
): THREE.CylinderGeometry {
  const geometry = new THREE.CylinderGeometry(radius, radius, depth, segments);
  return geometry;
}

// Create inner flat area for text placement (visual reference)
export function createInnerCircleGeometry(
  radius: number,
  segments: number = 64
): THREE.CircleGeometry {
  const geometry = new THREE.CircleGeometry(radius, segments);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

// Create simple ring geometry for decorative rings (flat)
export function createRingGeometry(
  innerRadius: number,
  outerRadius: number,
  segments: number = 64
): THREE.RingGeometry {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

// Size configurations - adjusted for CSG engraving
export const sizeConfig = {
  sm: { pixels: 100, scale: 0.55, fontSize: 0.12, innerRadius: 0.45 },
  md: { pixels: 150, scale: 0.8, fontSize: 0.15, innerRadius: 0.48 },
  lg: { pixels: 200, scale: 1.0, fontSize: 0.18, innerRadius: 0.52 },
  xl: { pixels: 260, scale: 1.3, fontSize: 0.22, innerRadius: 0.55 },
} as const;

export type SealSize = keyof typeof sizeConfig;

// Seal style presets
export interface SealStylePreset {
  outerRimInner: number;
  outerRimOuter: number;
  innerRimInner: number;
  innerRimOuter: number;
  textAreaRadius: number;
  rimHeight: number;
  innerRimHeight: number;
}

export const sealStyles: Record<string, SealStylePreset> = {
  classic: {
    outerRimInner: 0.70,
    outerRimOuter: 0.76,
    innerRimInner: 0.60,
    innerRimOuter: 0.64,
    textAreaRadius: 0.55,
    rimHeight: 0.045,
    innerRimHeight: 0.028,
  },
  modern: {
    outerRimInner: 0.72,
    outerRimOuter: 0.78,
    innerRimInner: 0.0, // No inner rim
    innerRimOuter: 0.0,
    textAreaRadius: 0.65,
    rimHeight: 0.035,
    innerRimHeight: 0,
  },
  romantic: {
    outerRimInner: 0.68,
    outerRimOuter: 0.75,
    innerRimInner: 0.58,
    innerRimOuter: 0.62,
    textAreaRadius: 0.52,
    rimHeight: 0.05,
    innerRimHeight: 0.03,
  },
};

export type SealStyle = keyof typeof sealStyles;
