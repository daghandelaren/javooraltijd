import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";

// GET /api/save-the-date/[id]
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

    const saveTheDate = await db.saveTheDate.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        _count: { select: { views: true } },
      },
    });

    if (!saveTheDate) {
      return NextResponse.json(
        { error: "Save the Date not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(saveTheDate);
  } catch (error) {
    console.error("Failed to fetch save-the-date:", error);
    return NextResponse.json(
      { error: "Failed to fetch save-the-date" },
      { status: 500 }
    );
  }
}

// PUT /api/save-the-date/[id]
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

    const existing = await db.saveTheDate.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Save the Date not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      templateId,
      partner1Name,
      partner2Name,
      weddingDate,
      headline,
      styling,
      musicEnabled,
      musicUrl,
    } = body;

    const saveTheDate = await db.saveTheDate.update({
      where: { id: params.id },
      data: {
        ...(templateId && { templateId }),
        ...(partner1Name && { partner1Name }),
        ...(partner2Name && { partner2Name }),
        ...(weddingDate && { weddingDate: new Date(weddingDate) }),
        ...(headline !== undefined && { headline: headline || null }),
        ...(styling && {
          sealColor: styling.sealColor,
          sealFont: styling.sealFont,
          monogram: styling.monogram || null,
          fontPairing: styling.fontPairing,
          envelopeEnabled: styling.envelopeConfig?.enabled ?? true,
          envelopeColor: styling.envelopeConfig?.color ?? "#FDF8F3",
          envelopeLiner: styling.envelopeConfig?.linerPattern ?? "floral",
          envelopePersonalizedText: styling.envelopeConfig?.personalizedText ?? "Noteer de datum in je agenda",
        }),
        ...(musicEnabled !== undefined && { musicEnabled }),
        ...(musicUrl !== undefined && { musicUrl: musicUrl || null }),
      },
    });

    return NextResponse.json(saveTheDate);
  } catch (error) {
    console.error("Failed to update save-the-date:", error);
    return NextResponse.json(
      { error: "Failed to update save-the-date" },
      { status: 500 }
    );
  }
}

// DELETE /api/save-the-date/[id]
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

    const existing = await db.saveTheDate.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Save the Date not found" },
        { status: 404 }
      );
    }

    await db.saveTheDate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete save-the-date:", error);
    return NextResponse.json(
      { error: "Failed to delete save-the-date" },
      { status: 500 }
    );
  }
}
