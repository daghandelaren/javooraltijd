import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";

// GET /api/invitations - List user's invitations
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const invitations = await db.invitation.findMany({
      where: { userId: user.id },
      include: {
        locations: { orderBy: { order: "asc" } },
        timeline: { orderBy: { order: "asc" } },
        _count: { select: { rsvps: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

// POST /api/invitations - Create new invitation
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

    // Validate required fields
    if (!templateId || !partner1Name || !partner2Name || !weddingDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const invitation = await db.invitation.create({
      data: {
        userId: user.id,
        templateId,
        partner1Name,
        partner2Name,
        weddingDate: new Date(weddingDate),
        weddingTime,
        headline,
        dresscode: dresscode || null,
        giftConfig: giftConfig?.enabled ? giftConfig : null,
        rsvpEnabled: rsvpConfig?.enabled ?? true,
        rsvpDeadline: rsvpConfig?.deadline ? new Date(rsvpConfig.deadline) : null,
        rsvpConfig: rsvpConfig?.fields ? rsvpConfig : null,
        sealColor: styling?.sealColor ?? "#9E1F3F",
        sealFont: styling?.sealFont ?? "great-vibes",
        sealStyle: styling?.sealStyle ?? "classic",
        sealFloral: styling?.sealFloral ?? true,
        monogram: styling?.monogram,
        accentColor: styling?.accentColor,
        fontPairing: styling?.fontPairing ?? "elegant",
        background: styling?.background,
        locations: locations?.length > 0 ? {
          create: locations.map((loc: {
            name: string;
            address: string;
            time: string;
            type: string;
            notes?: string;
            mapsUrl?: string;
            order: number;
          }) => ({
            name: loc.name,
            address: loc.address,
            time: loc.time,
            type: loc.type,
            notes: loc.notes,
            mapsUrl: loc.mapsUrl,
            order: loc.order,
          })),
        } : undefined,
        timeline: timeline?.length > 0 ? {
          create: timeline.map((item: {
            title: string;
            time: string;
            description?: string;
            icon?: string;
            order: number;
          }) => ({
            title: item.title,
            time: item.time,
            description: item.description,
            icon: item.icon,
            order: item.order,
          })),
        } : undefined,
      },
      include: {
        locations: { orderBy: { order: "asc" } },
        timeline: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error("Failed to create invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}
