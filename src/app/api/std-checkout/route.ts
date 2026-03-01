import { NextRequest, NextResponse } from "next/server";
import { mollieClient, STD_PLAN, centsToMollieAmount, Locale } from "@/lib/mollie";
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
    const { saveTheDateId, discountCode } = body as {
      saveTheDateId: string;
      discountCode?: string;
    };

    // Validate save-the-date exists and belongs to user
    const saveTheDate = await db.saveTheDate.findFirst({
      where: {
        id: saveTheDateId,
        userId: user.id,
      },
    });

    if (!saveTheDate) {
      return NextResponse.json(
        { error: "Save the Date not found" },
        { status: 404 }
      );
    }

    let totalCents: number = STD_PLAN.price;

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
      expiresAt.setMonth(expiresAt.getMonth() + STD_PLAN.features.durationMonths);

      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://javooraltijd.nl";
      const shareUrl = `${baseUrl}/s/${saveTheDate.shareId}`;

      await db.saveTheDate.update({
        where: { id: saveTheDateId },
        data: {
          status: "PUBLISHED",
          paidAt: new Date(),
          publishedAt: new Date(),
          expiresAt,
          shareUrl,
          discountCode: appliedCode,
          discountAmount,
        },
      });

      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success&type=std`;
      return NextResponse.json({ url: successUrl });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = process.env.NEXTAUTH_URL || baseUrl;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: centsToMollieAmount(totalCents),
      },
      description: `Save the Date - Digitale kaart`,
      redirectUrl: `${baseUrl}/dashboard?payment=success&type=std`,
      webhookUrl: `${webhookUrl}/api/webhooks/mollie`,
      metadata: {
        type: "save-the-date",
        userId: user.id,
        saveTheDateId,
        discountCode: appliedCode || "",
        discountAmount: String(discountAmount),
      },
      locale: Locale.nl_NL,
    });

    await db.saveTheDate.update({
      where: { id: saveTheDateId },
      data: {
        molliePaymentId: payment.id,
        discountCode: appliedCode,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
      },
    });

    return NextResponse.json({ url: payment.getCheckoutUrl() });
  } catch (error) {
    console.error("STD checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
