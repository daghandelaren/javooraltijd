import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SEAL_COLOR } from "@/lib/wax-colors";
import { DEFAULT_SEAL_FONT, type SealFontId } from "@/lib/wax-fonts";
import { DEFAULT_ENVELOPE_COLOR, DEFAULT_ENVELOPE_LINER } from "@/lib/envelope-colors";

// Package/Plan types
export type PlanId = "basic" | "signature" | "premium";

export interface GuestGroup {
  id: string;
  name: string;
  includedEvents: string[]; // Event IDs this group can see
  rsvpFields: {
    dietary: boolean;
    message: boolean;
    guestCount: boolean;
  };
}

export interface Location {
  id: string;
  name: string;
  address: string;
  time: string;
  type: string;
  icon?: string;
  notes?: string;
  mapsUrl?: string;
  order: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  time: string;
  description?: string;
  icon?: string;
  iconType?: "emoji" | "lucide"; // Support for Lucide icons
  order: number;
}

export interface CustomQuestion {
  id: string;
  question: string;
}

export interface RSVPConfig {
  enabled: boolean;
  deadline?: string;
  fields: {
    email: boolean;
    guestCount: boolean;
    maxGuests: number;
    dietary: boolean;
    message: boolean;
    events: boolean;
  };
  customQuestions: CustomQuestion[];
}

export interface MusicConfig {
  enabled: boolean;
  source: "library" | "upload" | null;
  trackId?: string; // ID from music library
  uploadedUrl?: string; // URL if uploaded
  autoPlay: boolean;
  volume: number; // 0-100
}

export interface GiftConfig {
  enabled: boolean;
  message: string;
  preferMoney: boolean;
  registryUrl?: string;
  iban?: string;
  accountHolder?: string;
}

export interface DresscodeColor {
  hex: string;
  name: string;
}

export interface EnvelopeConfig {
  enabled: boolean;
  color: string;
  linerPattern: string;
  personalizedText: string; // Text below seal, e.g., "Deze uitnodiging is speciaal voor jou"
  showDateOnEnvelope: boolean; // Show formatted wedding date as seal text
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Styling {
  sealColor: string; // Hex color string
  sealFont: SealFontId;
  monogram: string;
  accentColor?: string;
  fontPairing: "elegant" | "modern" | "romantic";
  background: {
    type: "solid" | "gradient" | "pattern";
    value: string;
  };
  envelopeConfig: EnvelopeConfig;
}

export interface BuilderState {
  // Database reference
  invitationId: string | null;

  // Current step
  currentStep: number;

  // Step 1: Package selection (NEW)
  selectedPlan: PlanId | null;

  // Step 2: Template
  templateId: string | null;

  // Step 3: Details
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  weddingTime: string;
  headline: string;
  dresscode: string;
  dresscodeColors: DresscodeColor[];

  // Step 4: Locations
  locations: Location[];

  // Step 5: Timeline
  timeline: TimelineItem[];

  // Step 6: RSVP Config
  rsvpConfig: RSVPConfig;

  // Step 7: Styling
  styling: Styling;

  // Gift/Cadeau config
  giftConfig: GiftConfig;

  // Guest groups for segmentation
  guestGroups: GuestGroup[];

  // Music config (Signature/Premium only)
  musicConfig: MusicConfig;

  // FAQ Items
  faqItems: FAQItem[];

  // Meta
  lastSaved: string | null;
  isDirty: boolean;
  isSaving: boolean;
  saveError: string | null;
}

interface BuilderActions {
  // Navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step 1: Package
  setSelectedPlan: (plan: PlanId) => void;

  // Step 2: Template
  setTemplateId: (id: string) => void;

  // Step 3: Details
  setPartner1Name: (name: string) => void;
  setPartner2Name: (name: string) => void;
  setWeddingDate: (date: string) => void;
  setWeddingTime: (time: string) => void;
  setHeadline: (headline: string) => void;
  setDresscode: (dresscode: string) => void;
  setDresscodeColors: (colors: DresscodeColor[]) => void;

  // Step 4: Locations
  addLocation: (location: Omit<Location, "id" | "order">) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  removeLocation: (id: string) => void;
  reorderLocations: (locations: Location[]) => void;

  // Step 5: Timeline
  addTimelineItem: (item: Omit<TimelineItem, "id" | "order">) => void;
  updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
  removeTimelineItem: (id: string) => void;
  reorderTimeline: (items: TimelineItem[]) => void;

  // Step 6: RSVP
  setRSVPConfig: (config: Partial<RSVPConfig>) => void;

  // Step 7: Styling
  setStyling: (styling: Partial<Styling>) => void;

  // Gift config
  setGiftConfig: (config: Partial<GiftConfig>) => void;

  // Guest groups
  addGuestGroup: (group: Omit<GuestGroup, "id">) => void;
  updateGuestGroup: (id: string, updates: Partial<GuestGroup>) => void;
  removeGuestGroup: (id: string) => void;

  // Music config
  setMusicConfig: (config: Partial<MusicConfig>) => void;

  // FAQ Items
  addFAQItem: (item: Omit<FAQItem, "id" | "order">) => void;
  updateFAQItem: (id: string, updates: Partial<FAQItem>) => void;
  removeFAQItem: (id: string) => void;
  reorderFAQItems: (items: FAQItem[]) => void;

  // Meta
  markSaved: () => void;
  resetBuilder: () => void;

  // Database sync
  setInvitationId: (id: string | null) => void;
  loadFromDatabase: (invitation: DatabaseInvitation) => void;
  saveToDatabase: () => Promise<void>;
  setSaving: (isSaving: boolean) => void;
  setSaveError: (error: string | null) => void;
}

// Type for database invitation data
export interface DatabaseInvitation {
  id: string;
  templateId: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  weddingTime: string | null;
  headline: string | null;
  dresscode: string | null;
  giftConfig: GiftConfig | null;
  locations: Location[];
  timeline: TimelineItem[];
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  rsvpConfig: RSVPConfig | null;
  sealColor: string; // Hex color string
  sealFont: string;
  monogram: string | null;
  accentColor: string | null;
  fontPairing: string;
  background: Styling["background"] | null;
  envelopeEnabled: boolean;
  envelopeColor: string | null;
  envelopeLiner: string | null;
  envelopePersonalizedText: string | null;
  faqItems: FAQItem[] | null;
}

const initialState: BuilderState = {
  invitationId: null,
  currentStep: 1,
  selectedPlan: null,
  templateId: null,
  partner1Name: "",
  partner2Name: "",
  weddingDate: "",
  weddingTime: "",
  headline: "",
  dresscode: "",
  dresscodeColors: [],
  locations: [],
  timeline: [],
  rsvpConfig: {
    enabled: true,
    fields: {
      email: true,
      guestCount: true,
      maxGuests: 5,
      dietary: true,
      message: true,
      events: false,
    },
    customQuestions: [],
  },
  styling: {
    sealColor: DEFAULT_SEAL_COLOR,
    sealFont: DEFAULT_SEAL_FONT,
    monogram: "",
    fontPairing: "elegant",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #FDF8F3 0%, #F9EDE1 100%)",
    },
    envelopeConfig: {
      enabled: true,
      color: DEFAULT_ENVELOPE_COLOR,
      linerPattern: DEFAULT_ENVELOPE_LINER,
      personalizedText: "Deze uitnodiging is speciaal voor jou",
      showDateOnEnvelope: true,
    },
  },
  giftConfig: {
    enabled: false,
    message: "",
    preferMoney: false,
  },
  guestGroups: [],
  faqItems: [],
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

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const useBuilderStore = create<BuilderState & BuilderActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 9) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      // Step 1: Package
      setSelectedPlan: (plan) => set({ selectedPlan: plan, isDirty: true }),

      // Step 2: Template
      setTemplateId: (id) => set({ templateId: id, isDirty: true }),

      // Step 3: Details
      setPartner1Name: (name) => set({ partner1Name: name, isDirty: true }),
      setPartner2Name: (name) => set({ partner2Name: name, isDirty: true }),
      setWeddingDate: (date) => set({ weddingDate: date, isDirty: true }),
      setWeddingTime: (time) => set({ weddingTime: time, isDirty: true }),
      setHeadline: (headline) => set({ headline: headline, isDirty: true }),
      setDresscode: (dresscode) => set({ dresscode: dresscode, isDirty: true }),
      setDresscodeColors: (colors) => set({ dresscodeColors: colors, isDirty: true }),

      // Step 3
      addLocation: (location) =>
        set((state) => ({
          locations: [
            ...state.locations,
            { ...location, id: generateId(), order: state.locations.length },
          ],
          isDirty: true,
        })),
      updateLocation: (id, updates) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...updates } : loc
          ),
          isDirty: true,
        })),
      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations
            .filter((loc) => loc.id !== id)
            .map((loc, index) => ({ ...loc, order: index })),
          isDirty: true,
        })),
      reorderLocations: (locations) => set({ locations, isDirty: true }),

      // Step 4
      addTimelineItem: (item) =>
        set((state) => ({
          timeline: [
            ...state.timeline,
            { ...item, id: generateId(), order: state.timeline.length },
          ],
          isDirty: true,
        })),
      updateTimelineItem: (id, updates) =>
        set((state) => ({
          timeline: state.timeline.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
          isDirty: true,
        })),
      removeTimelineItem: (id) =>
        set((state) => ({
          timeline: state.timeline
            .filter((item) => item.id !== id)
            .map((item, index) => ({ ...item, order: index })),
          isDirty: true,
        })),
      reorderTimeline: (items) => set({ timeline: items, isDirty: true }),

      // Step 5
      setRSVPConfig: (config) =>
        set((state) => ({
          rsvpConfig: { ...state.rsvpConfig, ...config },
          isDirty: true,
        })),

      // Step 7: Styling
      setStyling: (styling) =>
        set((state) => ({
          styling: { ...state.styling, ...styling },
          isDirty: true,
        })),

      // Gift config
      setGiftConfig: (config) =>
        set((state) => ({
          giftConfig: { ...state.giftConfig, ...config },
          isDirty: true,
        })),

      // Guest groups
      addGuestGroup: (group) =>
        set((state) => ({
          guestGroups: [
            ...state.guestGroups,
            { ...group, id: generateId() },
          ],
          isDirty: true,
        })),
      updateGuestGroup: (id, updates) =>
        set((state) => ({
          guestGroups: state.guestGroups.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
          isDirty: true,
        })),
      removeGuestGroup: (id) =>
        set((state) => ({
          guestGroups: state.guestGroups.filter((g) => g.id !== id),
          isDirty: true,
        })),

      // Music config
      setMusicConfig: (config) =>
        set((state) => ({
          musicConfig: { ...state.musicConfig, ...config },
          isDirty: true,
        })),

      // FAQ Items
      addFAQItem: (item) =>
        set((state) => ({
          faqItems: [
            ...state.faqItems,
            { ...item, id: generateId(), order: state.faqItems.length },
          ],
          isDirty: true,
        })),
      updateFAQItem: (id, updates) =>
        set((state) => ({
          faqItems: state.faqItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
          isDirty: true,
        })),
      removeFAQItem: (id) =>
        set((state) => ({
          faqItems: state.faqItems
            .filter((item) => item.id !== id)
            .map((item, index) => ({ ...item, order: index })),
          isDirty: true,
        })),
      reorderFAQItems: (items) => set({ faqItems: items, isDirty: true }),

      // Meta
      markSaved: () => set({ lastSaved: new Date().toISOString(), isDirty: false }),
      resetBuilder: () => set(initialState),

      // Database sync
      setInvitationId: (id) => set({ invitationId: id }),
      setSaving: (isSaving) => set({ isSaving }),
      setSaveError: (error) => set({ saveError: error }),

      loadFromDatabase: (invitation) => {
        set({
          invitationId: invitation.id,
          templateId: invitation.templateId,
          partner1Name: invitation.partner1Name,
          partner2Name: invitation.partner2Name,
          weddingDate: invitation.weddingDate.split("T")[0],
          weddingTime: invitation.weddingTime || "",
          headline: invitation.headline || "",
          dresscode: invitation.dresscode || "",
          giftConfig: invitation.giftConfig || {
            enabled: false,
            message: "",
            preferMoney: false,
          },
          locations: invitation.locations.map((loc) => ({
            id: loc.id,
            name: loc.name,
            address: loc.address,
            time: loc.time,
            type: loc.type,
            icon: loc.icon,
            notes: loc.notes,
            mapsUrl: loc.mapsUrl,
            order: loc.order,
          })),
          timeline: invitation.timeline.map((item) => ({
            id: item.id,
            title: item.title,
            time: item.time,
            description: item.description,
            icon: item.icon,
            order: item.order,
          })),
          rsvpConfig: invitation.rsvpConfig
            ? { customQuestions: [], ...invitation.rsvpConfig }
            : {
                enabled: invitation.rsvpEnabled,
                deadline: invitation.rsvpDeadline || undefined,
                fields: {
                  email: true,
                  guestCount: true,
                  maxGuests: 5,
                  dietary: true,
                  message: true,
                  events: false,
                },
                customQuestions: [],
              },
          styling: {
            sealColor: invitation.sealColor,
            sealFont: (invitation.sealFont as SealFontId) || DEFAULT_SEAL_FONT,
            monogram: invitation.monogram || "",
            accentColor: invitation.accentColor || undefined,
            fontPairing: invitation.fontPairing as Styling["fontPairing"],
            background: invitation.background || {
              type: "gradient",
              value: "linear-gradient(135deg, #FDF8F3 0%, #F9EDE1 100%)",
            },
            envelopeConfig: {
              enabled: invitation.envelopeEnabled ?? true,
              color: invitation.envelopeColor || DEFAULT_ENVELOPE_COLOR,
              linerPattern: invitation.envelopeLiner || DEFAULT_ENVELOPE_LINER,
              personalizedText: invitation.envelopePersonalizedText || "Deze uitnodiging is speciaal voor jou",
              showDateOnEnvelope: true,
            },
          },
          faqItems: invitation.faqItems || [],
          isDirty: false,
          lastSaved: new Date().toISOString(),
        });
      },

      saveToDatabase: async () => {
        const state = get();

        // Don't save if not dirty or already saving
        if (!state.isDirty || state.isSaving) return;

        // Validate required fields
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
            weddingTime: state.weddingTime || null,
            headline: state.headline || null,
            dresscode: state.dresscode || null,
            giftConfig: state.giftConfig,
            locations: state.locations,
            timeline: state.timeline,
            rsvpConfig: state.rsvpConfig,
            styling: state.styling,
          };

          const url = state.invitationId
            ? `/api/invitations/${state.invitationId}`
            : "/api/invitations";

          const method = state.invitationId ? "PUT" : "POST";

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
            invitationId: data.id,
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
      name: "javooraltijd-builder",
      partialize: (state) => ({
        invitationId: state.invitationId,
        selectedPlan: state.selectedPlan,
        templateId: state.templateId,
        partner1Name: state.partner1Name,
        partner2Name: state.partner2Name,
        weddingDate: state.weddingDate,
        weddingTime: state.weddingTime,
        headline: state.headline,
        dresscode: state.dresscode,
        dresscodeColors: state.dresscodeColors,
        locations: state.locations,
        timeline: state.timeline,
        rsvpConfig: state.rsvpConfig,
        styling: state.styling,
        giftConfig: state.giftConfig,
        guestGroups: state.guestGroups,
        faqItems: state.faqItems,
        musicConfig: state.musicConfig,
        currentStep: state.currentStep,
      }),
    }
  )
);
