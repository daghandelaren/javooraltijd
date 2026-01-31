import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, ADDONS, type PlanId, type AddonId } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, addonIds, invitationId } = body as {
      planId: PlanId;
      addonIds?: AddonId[];
      invitationId: string;
    };

    // Validate plan
    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Validate invitation exists and belongs to user
    const invitation = await db.invitation.findFirst({
      where: {
        id: invitationId,
        userId: user.id,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Build line items
    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string; description?: string };
        unit_amount: number;
      };
      quantity: number;
    }[] = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${plan.name} Pakket`,
            description: `Digitale trouwuitnodiging - ${plan.features.durationMonths} maanden online`,
          },
          unit_amount: plan.price,
        },
        quantity: 1,
      },
    ];

    // Add selected addons
    if (addonIds?.length) {
      for (const addonId of addonIds) {
        const addon = ADDONS[addonId];
        if (addon) {
          lineItems.push({
            price_data: {
              currency: "eur",
              product_data: {
                name: addon.name,
              },
              unit_amount: addon.price,
            },
            quantity: 1,
          });
        }
      }
    }

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/builder/checkout?canceled=true`,
      customer_email: user.email || undefined,
      metadata: {
        userId: user.id,
        invitationId,
        planId,
        addonIds: addonIds?.join(",") || "",
      },
      locale: "nl",
      allow_promotion_codes: true,
    });

    // Store session ID in invitation
    await db.invitation.update({
      where: { id: invitationId },
      data: {
        stripeSessionId: session.id,
        planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
