import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SEAL_COLOR } from "@/lib/wax-colors";
import { DEFAULT_SEAL_FONT, type SealFontId } from "@/lib/wax-fonts";
import { DEFAULT_ENVELOPE_COLOR, DEFAULT_ENVELOPE_LINER } from "@/lib/envelope-colors";
import { MUSIC_LIBRARY } from "@/components/builder/music-selector";

export interface StdMusicConfig {
  enabled: boolean;
  source: "library" | "upload" | null;
  trackId?: string;
  uploadedUrl?: string;
  autoPlay: boolean;
  volume: number;
}

// Map trackId to music file URL
const TRACK_URL_MAP: Record<string, string> = Object.fromEntries(
  MUSIC_LIBRARY.map((t) => [t.id, t.url])
);

export function getStdMusicUrl(config: StdMusicConfig): string | null {
  if (!config.enabled) return null;
  if (config.source === "upload" && config.uploadedUrl) return config.uploadedUrl;
  if (config.trackId && TRACK_URL_MAP[config.trackId]) return TRACK_URL_MAP[config.trackId];
  return null;
}

export interface StdEnvelopeConfig {
  enabled: boolean;
  color: string;
  linerPattern: string;
  personalizedText: string;
  showDateOnEnvelope: boolean;
}

export interface StdStyling {
  sealColor: string;
  sealFont: SealFontId;
  monogram: string;
  fontPairing: "elegant" | "modern" | "romantic";
  envelopeConfig: StdEnvelopeConfig;
}

export interface StdBuilderState {
  saveTheDateId: string | null;
  currentStep: number;
  templateId: string | null;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  headline: string;
  styling: StdStyling;
  musicConfig: StdMusicConfig;

  // Meta
  lastSaved: string | null;
  isDirty: boolean;
  isSaving: boolean;
  saveError: string | null;
}

interface StdBuilderActions {
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTemplateId: (id: string) => void;
  setPartner1Name: (name: string) => void;
  setPartner2Name: (name: string) => void;
  setWeddingDate: (date: string) => void;
  setHeadline: (headline: string) => void;
  setStyling: (styling: Partial<StdStyling>) => void;
  setMusicConfig: (config: Partial<StdMusicConfig>) => void;

  markSaved: () => void;
  resetBuilder: () => void;
  setSaveTheDateId: (id: string | null) => void;
  loadFromDatabase: (std: DatabaseSaveTheDate) => void;
  saveToDatabase: () => Promise<void>;
  setSaving: (isSaving: boolean) => void;
  setSaveError: (error: string | null) => void;
}

export interface DatabaseSaveTheDate {
  id: string;
  templateId: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  headline: string | null;
  sealColor: string;
  sealFont: string;
  monogram: string | null;
  fontPairing: string;
  envelopeEnabled: boolean;
  envelopeColor: string | null;
  envelopeLiner: string | null;
  envelopePersonalizedText: string | null;
  musicEnabled?: boolean;
  musicUrl?: string | null;
}

const initialState: StdBuilderState = {
  saveTheDateId: null,
  currentStep: 1,
  templateId: null,
  partner1Name: "",
  partner2Name: "",
  weddingDate: "",
  headline: "Save the Date",
  styling: {
    sealColor: DEFAULT_SEAL_COLOR,
    sealFont: DEFAULT_SEAL_FONT,
    monogram: "",
    fontPairing: "elegant",
    envelopeConfig: {
      enabled: true,
      color: DEFAULT_ENVELOPE_COLOR,
      linerPattern: DEFAULT_ENVELOPE_LINER,
      personalizedText: "Noteer de datum in je agenda",
      showDateOnEnvelope: true,
    },
  },
  musicConfig: {
    enabled: false,
    source: null,
    autoPlay: true,
    volume: 50,
  },
  lastSaved: null,
  isDirty: false,
  isSaving: false,
  saveError: null,
};

export const useStdBuilderStore = create<StdBuilderState & StdBuilderActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      setTemplateId: (id) => set({ templateId: id, isDirty: true }),
      setPartner1Name: (name) => set({ partner1Name: name, isDirty: true }),
      setPartner2Name: (name) => set({ partner2Name: name, isDirty: true }),
      setWeddingDate: (date) => set({ weddingDate: date, isDirty: true }),
      setHeadline: (headline) => set({ headline, isDirty: true }),

      setStyling: (styling) =>
        set((state) => ({
          styling: { ...state.styling, ...styling },
          isDirty: true,
        })),

      setMusicConfig: (config) =>
        set((state) => ({
          musicConfig: { ...state.musicConfig, ...config },
          isDirty: true,
        })),

      markSaved: () => set({ lastSaved: new Date().toISOString(), isDirty: false }),
      resetBuilder: () => set(initialState),

      setSaveTheDateId: (id) => set({ saveTheDateId: id }),
      setSaving: (isSaving) => set({ isSaving }),
      setSaveError: (error) => set({ saveError: error }),

      loadFromDatabase: (std) => {
        // Restore musicConfig from DB fields
        const restoredMusic: StdMusicConfig = {
          enabled: std.musicEnabled ?? false,
          source: null,
          autoPlay: true,
          volume: 50,
        };
        if (std.musicUrl) {
          // Try to find matching library track
          const libraryTrack = MUSIC_LIBRARY.find((t) => t.url === std.musicUrl);
          if (libraryTrack) {
            restoredMusic.source = "library";
            restoredMusic.trackId = libraryTrack.id;
          } else {
            restoredMusic.source = "upload";
            restoredMusic.uploadedUrl = std.musicUrl;
          }
        }

        set({
          saveTheDateId: std.id,
          templateId: std.templateId,
          partner1Name: std.partner1Name,
          partner2Name: std.partner2Name,
          weddingDate: std.weddingDate.split("T")[0],
          headline: std.headline || "Save the Date",
          styling: {
            sealColor: std.sealColor,
            sealFont: (std.sealFont as SealFontId) || DEFAULT_SEAL_FONT,
            monogram: std.monogram || "",
            fontPairing: std.fontPairing as StdStyling["fontPairing"],
            envelopeConfig: {
              enabled: std.envelopeEnabled ?? true,
              color: std.envelopeColor || DEFAULT_ENVELOPE_COLOR,
              linerPattern: std.envelopeLiner || DEFAULT_ENVELOPE_LINER,
              personalizedText: std.envelopePersonalizedText || "Noteer de datum in je agenda",
              showDateOnEnvelope: true,
            },
          },
          musicConfig: restoredMusic,
          isDirty: false,
          lastSaved: new Date().toISOString(),
        });
      },

      saveToDatabase: async () => {
        const state = get();

        if (!state.isDirty || state.isSaving) return;

        if (!state.templateId || !state.partner1Name || !state.partner2Name || !state.weddingDate) {
          return;
        }

        set({ isSaving: true, saveError: null });

        try {
          const payload = {
            templateId: state.templateId,
            partner1Name: state.partner1Name,
            partner2Name: state.partner2Name,
            weddingDate: state.weddingDate,
            headline: state.headline || null,
            styling: state.styling,
            musicEnabled: state.musicConfig.enabled,
            musicUrl: getStdMusicUrl(state.musicConfig),
          };

          const url = state.saveTheDateId
            ? `/api/save-the-date/${state.saveTheDateId}`
            : "/api/save-the-date";

          const method = state.saveTheDateId ? "PUT" : "POST";

          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error("Failed to save");
          }

          const data = await response.json();

          set({
            saveTheDateId: data.id,
            isDirty: false,
            lastSaved: new Date().toISOString(),
            isSaving: false,
          });
        } catch (error) {
          set({
            isSaving: false,
            saveError: error instanceof Error ? error.message : "Failed to save",
          });
        }
      },
    }),
    {
      name: "javooraltijd-std-builder",
      partialize: (state) => ({
        saveTheDateId: state.saveTheDateId,
        templateId: state.templateId,
        partner1Name: state.partner1Name,
        partner2Name: state.partner2Name,
        weddingDate: state.weddingDate,
        headline: state.headline,
        styling: state.styling,
        musicConfig: state.musicConfig,
        currentStep: state.currentStep,
      }),
    }
  )
);
