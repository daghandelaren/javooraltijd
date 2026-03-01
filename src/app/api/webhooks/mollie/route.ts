import { NextRequest, NextResponse } from "next/server";
import { mollieClient, PLANS, STD_PLAN, type PlanId } from "@/lib/mollie";
import { db } from "@/lib/db";
import { sendPaymentConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const paymentId = body.get("id") as string;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Missing payment id" },
        { status: 400 }
      );
    }

    // Fetch payment from Mollie to verify status
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status === "paid") {
      const metadata = payment.metadata as {
        type?: string;
        userId?: string;
        invitationId?: string;
        saveTheDateId?: string;
        planId?: string;
      };

      // Handle Save the Date payments
      if (metadata.type === "save-the-date") {
        await handleStdPayment(payment.id, metadata);
        return NextResponse.json({ received: true });
      }

      // Handle regular invitation payments
      const { userId, invitationId, planId } = metadata;

      if (!userId || !invitationId || !planId) {
        console.error("Missing metadata in Mollie payment");
        return NextResponse.json({ received: true });
      }

      const plan = PLANS[planId as PlanId];
      if (!plan) {
        console.error("Invalid plan in metadata:", planId);
        return NextResponse.json({ received: true });
      }

      // Calculate expiration date based on plan
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + plan.features.durationMonths);

      // Get the invitation and user info for confirmation email
      const invitation = await db.invitation.findUnique({
        where: { id: invitationId },
        select: {
          shareId: true,
          partner1Name: true,
          partner2Name: true,
          user: {
            select: { email: true },
          },
        },
      });

      if (!invitation) {
        console.error("Invitation not found:", invitationId);
        return NextResponse.json({ received: true });
      }

      // Generate the public share URL
      const baseUrl = process.env.NEXTAUTH_URL || "https://javooraltijd.nl";
      const shareUrl = `${baseUrl}/u/${invitation.shareId}`;

      // Update invitation with payment info and publish
      await db.invitation.update({
        where: { id: invitationId },
        data: {
          status: "PUBLISHED",
          molliePaymentId: payment.id,
          paidAt: new Date(),
          publishedAt: new Date(),
          planId,
          expiresAt,
          shareUrl,
        },
      });

      console.log(`Invitation ${invitationId} published with URL: ${shareUrl}`);

      // Send payment confirmation email
      const coupleNames = `${invitation.partner1Name} & ${invitation.partner2Name}`;
      await sendPaymentConfirmation(
        invitation.user.email,
        coupleNames,
        plan.name,
        shareUrl
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleStdPayment(
  molliePaymentId: string,
  metadata: { userId?: string; saveTheDateId?: string }
) {
  const { userId, saveTheDateId } = metadata;

  if (!userId || !saveTheDateId) {
    console.error("Missing STD metadata in Mollie payment");
    return;
  }

  const saveTheDate = await db.saveTheDate.findUnique({
    where: { id: saveTheDateId },
    select: {
      shareId: true,
      partner1Name: true,
      partner2Name: true,
      user: {
        select: { email: true },
      },
    },
  });

  if (!saveTheDate) {
    console.error("Save the Date not found:", saveTheDateId);
    return;
  }

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + STD_PLAN.features.durationMonths);

  const baseUrl = process.env.NEXTAUTH_URL || "https://javooraltijd.nl";
  const shareUrl = `${baseUrl}/s/${saveTheDate.shareId}`;

  await db.saveTheDate.update({
    where: { id: saveTheDateId },
    data: {
      status: "PUBLISHED",
      molliePaymentId,
      paidAt: new Date(),
      publishedAt: new Date(),
      expiresAt,
      shareUrl,
    },
  });

  console.log(`Save the Date ${saveTheDateId} published with URL: ${shareUrl}`);

  const coupleNames = `${saveTheDate.partner1Name} & ${saveTheDate.partner2Name}`;
  await sendPaymentConfirmation(
    saveTheDate.user.email,
    coupleNames,
    STD_PLAN.name,
    shareUrl
  );
}
