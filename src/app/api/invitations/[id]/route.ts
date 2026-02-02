import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";

// GET /api/invitations/[id] - Get a specific invitation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const invitation = await db.invitation.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        locations: { orderBy: { order: "asc" } },
        timeline: { orderBy: { order: "asc" } },
        rsvps: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Failed to fetch invitation:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
}

// PUT /api/invitations/[id] - Update invitation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check ownership
    const existing = await db.invitation.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      templateId,
      partner1Name,
      partner2Name,
      weddingDate,
      weddingTime,
      headline,
      dresscode,
      giftConfig,
      locations,
      timeline,
      rsvpConfig,
      styling,
    } = body;

    // Update invitation with transaction for locations and timeline
    const invitation = await db.$transaction(async (tx) => {
      // Delete existing locations and timeline if new ones provided
      if (locations) {
        await tx.location.deleteMany({
          where: { invitationId: params.id },
        });
      }
      if (timeline) {
        await tx.timelineItem.deleteMany({
          where: { invitationId: params.id },
        });
      }

      // Update invitation
      const updated = await tx.invitation.update({
        where: { id: params.id },
        data: {
          ...(templateId && { templateId }),
          ...(partner1Name && { partner1Name }),
          ...(partner2Name && { partner2Name }),
          ...(weddingDate && { weddingDate: new Date(weddingDate) }),
          ...(weddingTime !== undefined && { weddingTime }),
          ...(headline !== undefined && { headline }),
          ...(dresscode !== undefined && { dresscode: dresscode || null }),
          ...(giftConfig !== undefined && { giftConfig: giftConfig?.enabled ? giftConfig : null }),
          ...(rsvpConfig && {
            rsvpEnabled: rsvpConfig.enabled,
            rsvpDeadline: rsvpConfig.deadline ? new Date(rsvpConfig.deadline) : null,
            rsvpConfig: rsvpConfig.fields ? rsvpConfig : undefined,
          }),
          ...(styling && {
            sealColor: styling.sealColor,
            sealFont: styling.sealFont,
            sealStyle: styling.sealStyle,
            sealFloral: styling.sealFloral,
            monogram: styling.monogram,
            accentColor: styling.accentColor,
            fontPairing: styling.fontPairing,
            background: styling.background,
            envelopeEnabled: styling.envelopeConfig?.enabled ?? true,
            envelopeColor: styling.envelopeConfig?.color ?? "#FDF8F3",
            envelopeLiner: styling.envelopeConfig?.linerPattern ?? "floral",
            envelopePersonalizedText: styling.envelopeConfig?.personalizedText ?? "Deze uitnodiging is speciaal voor jou",
          }),
        },
      });

      // Create new locations
      if (locations?.length > 0) {
        await tx.location.createMany({
          data: locations.map((loc: {
            name: string;
            address: string;
            time: string;
            type: string;
            notes?: string;
            mapsUrl?: string;
            order: number;
          }) => ({
            invitationId: params.id,
            name: loc.name,
            address: loc.address,
            time: loc.time,
            type: loc.type,
            notes: loc.notes,
            mapsUrl: loc.mapsUrl,
            order: loc.order,
          })),
        });
      }

      // Create new timeline
      if (timeline?.length > 0) {
        await tx.timelineItem.createMany({
          data: timeline.map((item: {
            title: string;
            time: string;
            description?: string;
            icon?: string;
            order: number;
          }) => ({
            invitationId: params.id,
            title: item.title,
            time: item.time,
            description: item.description,
            icon: item.icon,
            order: item.order,
          })),
        });
      }

      return tx.invitation.findUnique({
        where: { id: params.id },
        include: {
          locations: { orderBy: { order: "asc" } },
          timeline: { orderBy: { order: "asc" } },
        },
      });
    });

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Failed to update invitation:", error);
    return NextResponse.json(
      { error: "Failed to update invitation" },
      { status: 500 }
    );
  }
}

// DELETE /api/invitations/[id] - Delete invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check ownership
    const existing = await db.invitation.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    await db.invitation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete invitation:", error);
    return NextResponse.json(
      { error: "Failed to delete invitation" },
      { status: 500 }
    );
  }
}
