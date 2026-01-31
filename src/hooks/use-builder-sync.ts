"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useBuilderStore } from "@/stores/builder-store";

const DEBOUNCE_MS = 2000;

export function useBuilderSync() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isDirty,
    isSaving,
    saveToDatabase,
    invitationId,
    templateId,
    partner1Name,
    partner2Name,
    weddingDate,
  } = useBuilderStore();

  // Auto-save to database when dirty and authenticated
  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToDatabase();
    }, DEBOUNCE_MS);
  }, [saveToDatabase]);

  useEffect(() => {
    // Only auto-save if:
    // 1. User is authenticated
    // 2. State is dirty
    // 3. Not currently saving
    // 4. Has minimum required fields
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

  // Force save (bypasses debounce)
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
    invitationId,
    forceSave,
  };
}

// Hook to load invitation from database
export function useLoadInvitation(invitationId: string | null) {
  const { loadFromDatabase } = useBuilderStore();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isAuthenticated || !invitationId) return;

    async function load() {
      try {
        const response = await fetch(`/api/invitations/${invitationId}`);
        if (response.ok) {
          const invitation = await response.json();
          loadFromDatabase(invitation);
        }
      } catch (error) {
        console.error("Failed to load invitation:", error);
      }
    }

    load();
  }, [isAuthenticated, invitationId, loadFromDatabase]);
}
