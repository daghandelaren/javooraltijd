import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe, PLANS, type PlanId } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendPaymentConfirmation } from "@/lib/email";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, invitationId, planId } = session.metadata || {};

  if (!userId || !invitationId || !planId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  const plan = PLANS[planId as PlanId];
  if (!plan) {
    console.error("Invalid plan in metadata:", planId);
    return;
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
    return;
  }

  // Generate the public share URL
  const baseUrl = process.env.NEXTAUTH_URL || "https://javooraltijd.nl";
  const shareUrl = `${baseUrl}/u/${invitation.shareId}`;

  // Update invitation with payment info and publish
  await db.invitation.update({
    where: { id: invitationId },
    data: {
      status: "PUBLISHED",
      stripePaymentId: session.payment_intent as string,
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
