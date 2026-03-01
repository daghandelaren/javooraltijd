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
    const { planId, addonIds, invitationId, discountCode } = body as {
      planId: PlanId;
      addonIds?: AddonId[];
      invitationId: string;
      discountCode?: string;
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
    let totalCents: number = plan.price;

    if (addonIds?.length) {
      for (const addonId of addonIds) {
        const addon = ADDONS[addonId];
        if (addon) {
          totalCents += addon.price;
        }
      }
    }

    // Apply discount if provided
    let discountAmount = 0;
    let appliedCode: string | undefined;

    if (discountCode) {
      const discount = await db.discountCode.findUnique({
        where: { code: discountCode.toUpperCase().trim() },
      });

      if (
        discount &&
        discount.isActive &&
        (!discount.expiresAt || discount.expiresAt >= new Date()) &&
        (discount.maxUsages === null || discount.currentUsages < discount.maxUsages) &&
        (discount.minOrderCents === null || totalCents >= discount.minOrderCents)
      ) {
        if (discount.type === "PERCENTAGE") {
          discountAmount = Math.round((totalCents * discount.value) / 100);
        } else {
          discountAmount = Math.min(discount.value, totalCents);
        }

        // Increment usage
        await db.discountCode.update({
          where: { id: discount.id },
          data: { currentUsages: { increment: 1 } },
        });

        appliedCode = discount.code;
      }
    }

    totalCents = Math.max(0, totalCents - discountAmount);

    // If total is 0 after discount, skip Mollie and publish directly
    if (totalCents === 0) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + plan.features.durationMonths);

      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://javooraltijd.nl";
      const shareId = invitation.shareId;
      const shareUrl = `${baseUrl}/u/${shareId}`;

      await db.invitation.update({
        where: { id: invitationId },
        data: {
          status: "PUBLISHED",
          paidAt: new Date(),
          publishedAt: new Date(),
          planId,
          expiresAt,
          shareUrl,
          discountCode: appliedCode,
          discountAmount,
        },
      });

      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?id=${invitationId}`;
      return NextResponse.json({ url: successUrl });
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
        discountCode: appliedCode || "",
        discountAmount: String(discountAmount),
      },
      locale: Locale.nl_NL,
    });

    // Store payment ID and discount info in invitation
    await db.invitation.update({
      where: { id: invitationId },
      data: {
        molliePaymentId: payment.id,
        planId,
        discountCode: appliedCode,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
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
