"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useStdBuilderStore } from "@/stores/std-builder-store";

const DEBOUNCE_MS = 2000;

export function useStdBuilderSync() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isDirty,
    isSaving,
    saveToDatabase,
    saveTheDateId,
    templateId,
    partner1Name,
    partner2Name,
    weddingDate,
  } = useStdBuilderStore();

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToDatabase();
    }, DEBOUNCE_MS);
  }, [saveToDatabase]);

  useEffect(() => {
    if (
      isAuthenticated &&
      isDirty &&
      !isSaving &&
      templateId &&
      partner1Name &&
      partner2Name &&
      weddingDate
    ) {
      debouncedSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    isAuthenticated,
    isDirty,
    isSaving,
    debouncedSave,
    templateId,
    partner1Name,
    partner2Name,
    weddingDate,
  ]);

  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveToDatabase();
  }, [saveToDatabase]);

  return {
    isAuthenticated,
    isSaving,
    isDirty,
    saveTheDateId,
    forceSave,
  };
}

// Hook to load save-the-date from database
export function useLoadSaveTheDate(saveTheDateId: string | null) {
  const { loadFromDatabase } = useStdBuilderStore();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isAuthenticated || !saveTheDateId) return;

    async function load() {
      try {
        const response = await fetch(`/api/save-the-date/${saveTheDateId}`);
        if (response.ok) {
          const data = await response.json();
          loadFromDatabase(data);
        }
      } catch (error) {
        console.error("Failed to load save-the-date:", error);
      }
    }

    load();
  }, [isAuthenticated, saveTheDateId, loadFromDatabase]);
}
