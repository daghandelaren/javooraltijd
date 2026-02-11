import { NextRequest, NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("id");

    if (!invitationId) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    // Get invitation and check its Mollie payment
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId },
      select: {
        id: true,
        shareId: true,
        partner1Name: true,
        partner2Name: true,
        status: true,
        molliePaymentId: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // If already published, it's paid
    if (invitation.status === "PUBLISHED") {
      return NextResponse.json({
        success: true,
        invitation: {
          id: invitation.id,
          shareId: invitation.shareId,
          partner1Name: invitation.partner1Name,
          partner2Name: invitation.partner2Name,
          status: invitation.status,
        },
      });
    }

    // Otherwise check with Mollie
    if (invitation.molliePaymentId) {
      const payment = await mollieClient.payments.get(invitation.molliePaymentId);
      return NextResponse.json({
        success: payment.status === "paid",
        invitation: {
          id: invitation.id,
          shareId: invitation.shareId,
          partner1Name: invitation.partner1Name,
          partner2Name: invitation.partner2Name,
          status: invitation.status,
        },
      });
    }

    return NextResponse.json({
      success: false,
      invitation: {
        id: invitation.id,
        shareId: invitation.shareId,
        partner1Name: invitation.partner1Name,
        partner2Name: invitation.partner2Name,
        status: invitation.status,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify checkout" },
      { status: 500 }
    );
  }
}
