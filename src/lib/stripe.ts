import Stripe from "stripe";

// Create stripe instance - will be null during build if key not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    })
  : (null as unknown as Stripe);

// Pricing configuration
export const PLANS = {
  basis: {
    id: "basis",
    name: "Basis",
    price: 4900, // in cents
    priceId: process.env.STRIPE_PRICE_BASIS,
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
    priceId: process.env.STRIPE_PRICE_PREMIUM,
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
    priceId: process.env.STRIPE_PRICE_DELUXE,
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
    priceId: process.env.STRIPE_PRICE_EXTENSION,
  },
  monogram: {
    id: "monogram",
    name: "Custom monogram design",
    price: 2900,
    priceId: process.env.STRIPE_PRICE_MONOGRAM,
  },
  rush: {
    id: "rush",
    name: "Rush delivery (24u)",
    price: 1500,
    priceId: process.env.STRIPE_PRICE_RUSH,
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type AddonId = keyof typeof ADDONS;
