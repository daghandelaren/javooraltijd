"use client";

import dynamic from "next/dynamic";
import { WaxSealPlaceholder } from "./wax-seal-3d";
import type { WaxSeal3DProps } from "./wax-seal-3d";
import type { SealSize, SealStyle } from "./seal-geometry";

// Dynamic import with SSR disabled - Three.js requires browser APIs
export const WaxSeal3D = dynamic(
  () => import("./wax-seal-3d").then((mod) => mod.WaxSeal3DComponent),
  {
    ssr: false,
    loading: () => <WaxSealPlaceholder />,
  }
);

// Re-export types and placeholder
export type { WaxSeal3DProps, SealSize, SealStyle };
export { WaxSealPlaceholder };
