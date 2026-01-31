"use client";

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import {
  createSealGeometry,
  createOuterRimGeometry,
  createInnerRimGeometry,
  sizeConfig,
  sealStyles,
  type SealSize,
  type SealStyle,
} from "./seal-geometry";
import {
  createWaxMaterial,
  createEmbossMaterial,
  createRimMaterial,
  disposeMaterial,
} from "./wax-material";
import { loadFont, createTextGeometry } from "./text-geometry";
import type { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { DEFAULT_SEAL_FONT, type SealFontId } from "@/lib/wax-fonts";

// Camera controller - angled view to show 3D depth
function CameraSetup() {
  const { camera } = useThree();
  React.useEffect(() => {
    camera.position.set(0, 6, 2.5);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

export interface WaxSeal3DProps {
  initials?: string;
  color?: string;
  font?: SealFontId;
  size?: SealSize;
  style?: SealStyle;
  seed?: number;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

// Geometry cache to avoid re-computation
const geometryCache = new Map<string, THREE.ExtrudeGeometry>();

function getOrCreateSealGeometry(seed: number): THREE.ExtrudeGeometry {
  const key = `seal-${seed}`;
  if (!geometryCache.has(key)) {
    geometryCache.set(key, createSealGeometry(1, 0.18, seed, 128));
  }
  return geometryCache.get(key)!;
}

interface SealMeshProps {
  color: string;
  initials: string;
  font: SealFontId;
  seed: number;
  style: SealStyle;
  interactive: boolean;
  onClick?: () => void;
  fontSize: number;
}

function SealMesh({
  color,
  initials,
  font: fontId,
  seed,
  style,
  interactive,
  onClick,
  fontSize,
}: SealMeshProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const textMeshRef = React.useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);
  const [loadedFont, setLoadedFont] = React.useState<Font | null>(null);
  const [textGeometry, setTextGeometry] = React.useState<THREE.BufferGeometry | null>(null);

  // Load font
  React.useEffect(() => {
    loadFont(fontId)
      .then(setLoadedFont)
      .catch((err) => console.warn("Font load failed:", err));
  }, [fontId]);

  // Create text geometry when font and initials are ready
  React.useEffect(() => {
    if (loadedFont && initials) {
      const geom = createTextGeometry(loadedFont, {
        text: initials,
        size: fontSize,
        depth: 0.012, // Shallow engraving depth
        bevelEnabled: true,
        bevelThickness: 0.003,
        bevelSize: 0.002,
        bevelSegments: 2,
        curveSegments: 12,
      }, fontId);
      setTextGeometry(geom);

      return () => {
        geom.dispose();
      };
    }
  }, [loadedFont, initials, fontSize, fontId]);

  const stylePreset = sealStyles[style] || sealStyles.classic;

  // Create seal geometry (cached)
  const sealGeometry = React.useMemo(() => getOrCreateSealGeometry(seed), [seed]);

  // Create rim geometries
  const outerRimGeometry = React.useMemo(
    () =>
      createOuterRimGeometry(
        stylePreset.outerRimInner,
        stylePreset.outerRimOuter,
        stylePreset.rimHeight,
        64
      ),
    [stylePreset]
  );

  const innerRimGeometry = React.useMemo(() => {
    if (stylePreset.innerRimInner > 0) {
      return createInnerRimGeometry(
        stylePreset.innerRimInner,
        stylePreset.innerRimOuter,
        stylePreset.innerRimHeight,
        64
      );
    }
    return null;
  }, [stylePreset]);

  // Materials
  const waxMaterial = React.useMemo(() => createWaxMaterial(color), [color]);
  const rimMaterial = React.useMemo(() => createRimMaterial(color), [color]);
  const embossMaterial = React.useMemo(() => createEmbossMaterial(color), [color]);

  // Text material - same as wax but DoubleSide for flipped geometry
  const textMaterial = React.useMemo(() => {
    const mat = createWaxMaterial(color);
    mat.side = THREE.DoubleSide;
    return mat;
  }, [color]);

  // Subtle rotation animation
  useFrame((state) => {
    if (groupRef.current && interactive) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.015;

      const targetScale = hovered ? 1.03 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }
  });

  // Cleanup materials on unmount
  React.useEffect(() => {
    return () => {
      disposeMaterial(waxMaterial);
      disposeMaterial(rimMaterial);
      disposeMaterial(embossMaterial);
      disposeMaterial(textMaterial);
    };
  }, [waxMaterial, rimMaterial, embossMaterial, textMaterial]);

  // Base height where seal surface is
  const surfaceY = 0.09;
  const rimY = surfaceY + 0.01;
  // Text now extrudes DOWNWARD, so position at surface level
  // The text will carve down into the wax from this point
  const textY = surfaceY + 0.002;

  return (
    <group
      ref={groupRef}
      onClick={interactive ? onClick : undefined}
      onPointerOver={interactive ? () => setHovered(true) : undefined}
      onPointerOut={interactive ? () => setHovered(false) : undefined}
    >
      {/* Main seal body */}
      <mesh
        geometry={sealGeometry}
        material={waxMaterial}
        castShadow
        receiveShadow
      />

      {/* Outer raised rim */}
      <mesh
        geometry={outerRimGeometry}
        material={rimMaterial}
        position={[0, rimY, 0]}
        castShadow
      />

      {/* Inner raised rim (if style has it) */}
      {innerRimGeometry && (
        <mesh
          geometry={innerRimGeometry}
          material={rimMaterial}
          position={[0, rimY - 0.005, 0]}
          castShadow
        />
      )}

      {/* Engraved text - carved down into the wax */}
      {textGeometry && (
        <mesh
          ref={textMeshRef}
          geometry={textGeometry}
          material={textMaterial}
          position={[0, textY, 0]}
          castShadow
          receiveShadow
        />
      )}
    </group>
  );
}

interface SceneProps extends SealMeshProps {
  scale: number;
}

function Scene({
  color,
  initials,
  font,
  seed,
  style,
  interactive,
  onClick,
  scale,
  fontSize,
}: SceneProps) {
  return (
    <>
      {/* Camera setup */}
      <CameraSetup />

      {/* Soft natural lighting for realistic wax appearance */}
      {/* Ambient fill - soft overall illumination */}
      <ambientLight intensity={0.4} />

      {/* Main key light - angled to create shadows in engraved areas */}
      <directionalLight
        position={[-3, 5, 2]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={15}
        shadow-bias={-0.0005}
      />

      {/* Fill light (warm, soft, from right) */}
      <directionalLight
        position={[4, 3, 2]}
        intensity={0.5}
        color="#FFF8F0"
      />

      {/* Top light - directly above to illuminate engravings */}
      <directionalLight
        position={[0, 6, 0]}
        intensity={0.6}
      />

      {/* Soft rim light for edge definition */}
      <pointLight position={[0, 2, -2]} intensity={0.3} color="#FFFFFF" />

      {/* Seal mesh group - minimal tilt for top-down view like reference */}
      <group scale={scale} rotation={[-0.08, 0, 0.02]}>
        <SealMesh
          color={color}
          initials={initials}
          font={font}
          seed={seed}
          style={style}
          interactive={interactive}
          onClick={onClick}
          fontSize={fontSize}
        />
      </group>

      {/* Contact shadow on "paper" surface */}
      <ContactShadows
        position={[0, -0.15, 0]}
        opacity={0.35}
        scale={3}
        blur={2.5}
        far={4}
        color="#000000"
      />
    </>
  );
}

export function WaxSeal3DComponent({
  initials = "L & J",
  color = "#9E1F3F",
  font = DEFAULT_SEAL_FONT,
  size = "lg",
  style = "classic",
  seed = 42,
  interactive = false,
  onClick,
  className,
}: WaxSeal3DProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "relative",
        interactive && "cursor-pointer",
        className
      )}
      style={{
        width: config.pixels,
        height: config.pixels,
      }}
    >
      <Canvas
        camera={{
          position: [0, 2.5, 0],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{ background: "transparent" }}
      >
        <Scene
          color={color}
          initials={initials}
          font={font}
          seed={seed}
          style={style}
          interactive={interactive}
          onClick={onClick}
          scale={config.scale}
          fontSize={config.fontSize}
        />
      </Canvas>
    </div>
  );
}

// Loading placeholder
export function WaxSealPlaceholder({
  size = "lg",
  className,
}: {
  size?: SealSize;
  className?: string;
}) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "relative rounded-full bg-gradient-to-br from-burgundy-200 to-burgundy-300 animate-pulse",
        className
      )}
      style={{
        width: config.pixels,
        height: config.pixels,
      }}
    />
  );
}
