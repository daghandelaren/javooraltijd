import { NextRequest, NextResponse } from "next/server";
import { mollieClient, PLANS, ADDONS, centsToMollieAmount, Locale, type PlanId, type AddonId } from "@/lib/mollie";
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

    // Calculate total in cents
    let totalCents = plan.price;

    if (addonIds?.length) {
      for (const addonId of addonIds) {
        const addon = ADDONS[addonId];
        if (addon) {
          totalCents += addon.price;
        }
      }
    }

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = process.env.NEXTAUTH_URL || baseUrl;

    // Create Mollie payment
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: centsToMollieAmount(totalCents),
      },
      description: `${plan.name} Pakket - Digitale trouwuitnodiging`,
      redirectUrl: `${baseUrl}/checkout/success?id=${invitationId}`,
      webhookUrl: `${webhookUrl}/api/webhooks/mollie`,
      metadata: {
        userId: user.id,
        invitationId,
        planId,
        addonIds: addonIds?.join(",") || "",
      },
      locale: Locale.nl_NL,
    });

    // Store payment ID in invitation
    await db.invitation.update({
      where: { id: invitationId },
      data: {
        molliePaymentId: payment.id,
        planId,
      },
    });

    return NextResponse.json({ url: payment.getCheckoutUrl() });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
