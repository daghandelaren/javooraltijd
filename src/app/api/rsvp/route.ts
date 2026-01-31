import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendRSVPNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      invitationId,
      name,
      email,
      attending,
      guestCount,
      dietary,
      message,
      events,
    } = body;

    // Validate required fields
    if (!invitationId || !name || !attending) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate attending status
    if (!["YES", "NO", "MAYBE"].includes(attending)) {
      return NextResponse.json(
        { error: "Invalid attending status" },
        { status: 400 }
      );
    }

    // Check invitation exists and is active
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId },
      select: {
        id: true,
        status: true,
        rsvpEnabled: true,
        rsvpDeadline: true,
        partner1Name: true,
        partner2Name: true,
        user: {
          select: { email: true },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (!invitation.rsvpEnabled) {
      return NextResponse.json(
        { error: "RSVP is not enabled for this invitation" },
        { status: 400 }
      );
    }

    // Check deadline
    if (invitation.rsvpDeadline && invitation.rsvpDeadline < new Date()) {
      return NextResponse.json(
        { error: "RSVP deadline has passed" },
        { status: 400 }
      );
    }

    // Check for existing RSVP from same email (if provided)
    if (email) {
      const existingRSVP = await db.rSVP.findFirst({
        where: {
          invitationId,
          email,
        },
      });

      if (existingRSVP) {
        // Update existing RSVP
        const updatedRSVP = await db.rSVP.update({
          where: { id: existingRSVP.id },
          data: {
            name,
            attending,
            guestCount: guestCount || 1,
            dietary,
            message,
            events,
          },
        });

        // Send notification for updated RSVP
        const coupleNames = `${invitation.partner1Name} & ${invitation.partner2Name}`;
        await sendRSVPNotification(
          invitation.user.email,
          coupleNames,
          name,
          attending,
          guestCount || 1,
          dietary || null,
          message || null
        );

        return NextResponse.json(updatedRSVP);
      }
    }

    // Create new RSVP
    const rsvp = await db.rSVP.create({
      data: {
        invitationId,
        name,
        email,
        attending,
        guestCount: guestCount || 1,
        dietary,
        message,
        events,
      },
    });

    // Send notification for new RSVP
    const coupleNames = `${invitation.partner1Name} & ${invitation.partner2Name}`;
    await sendRSVPNotification(
      invitation.user.email,
      coupleNames,
      name,
      attending,
      guestCount || 1,
      dietary || null,
      message || null
    );

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}
