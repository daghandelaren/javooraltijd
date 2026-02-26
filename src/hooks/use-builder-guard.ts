"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/stores/builder-store";

/**
 * Guard hook that redirects users who haven't completed prerequisite steps.
 * @param minRequired - 1 = needs plan selected; 2 = needs plan + template selected
 */
export function useBuilderGuard(minRequired: 1 | 2) {
  const router = useRouter();
  const { selectedPlan, templateId } = useBuilderStore();

  useEffect(() => {
    if (!selectedPlan) {
      router.replace("/builder/package");
      return;
    }
    if (minRequired === 2 && !templateId) {
      router.replace("/builder/template");
    }
  }, [selectedPlan, templateId, minRequired, router]);
}
