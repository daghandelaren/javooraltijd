"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStdBuilderStore } from "@/stores/std-builder-store";

/**
 * Guard hook that redirects users who haven't selected a template yet.
 */
export function useStdBuilderGuard() {
  const router = useRouter();
  const { templateId } = useStdBuilderStore();

  useEffect(() => {
    if (!templateId) {
      router.replace("/std-builder/template");
    }
  }, [templateId, router]);
}
