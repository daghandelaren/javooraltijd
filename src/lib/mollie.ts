import createMollieClient, { Locale } from "@mollie/api-client";

const mollieApiKey = process.env.MOLLIE_API_KEY;

export const mollieClient = mollieApiKey
  ? createMollieClient({ apiKey: mollieApiKey })
  : (null as unknown as ReturnType<typeof createMollieClient>);

export { Locale };

// Pricing configuration
export const PLANS = {
  basis: {
    id: "basis",
    name: "Basis",
    price: 4900, // in cents
    features: {
      maxGuests: 100,
      allTemplates: false,
      mediaUpload: false,
      customSeal: false,
      prioritySupport: false,
      durationMonths: 6,
    },
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 7900,
    features: {
      maxGuests: -1, // unlimited
      allTemplates: true,
      mediaUpload: true,
      customSeal: false,
      prioritySupport: false,
      durationMonths: 12,
    },
  },
  deluxe: {
    id: "deluxe",
    name: "Deluxe",
    price: 11900,
    features: {
      maxGuests: -1,
      allTemplates: true,
      mediaUpload: true,
      customSeal: true,
      prioritySupport: true,
      durationMonths: 24,
    },
  },
} as const;

export const ADDONS = {
  extension: {
    id: "extension",
    name: "12 maanden verlenging",
    price: 1900,
  },
  monogram: {
    id: "monogram",
    name: "Custom monogram design",
    price: 2900,
  },
  rush: {
    id: "rush",
    name: "Rush delivery (24u)",
    price: 1500,
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type AddonId = keyof typeof ADDONS;

/** Convert cents to Mollie decimal string format (e.g. 4900 → "49.00") */
export function centsToMollieAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
