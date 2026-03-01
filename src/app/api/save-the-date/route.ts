import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";

// GET /api/save-the-date - List user's save-the-dates
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const saveTheDates = await db.saveTheDate.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { views: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(saveTheDates);
  } catch (error) {
    console.error("Failed to fetch save-the-dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch save-the-dates" },
      { status: 500 }
    );
  }
}

// POST /api/save-the-date - Create new save-the-date
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
      headline,
      styling,
    } = body;

    if (!templateId || !partner1Name || !partner2Name || !weddingDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const saveTheDate = await db.saveTheDate.create({
      data: {
        userId: user.id,
        templateId,
        partner1Name,
        partner2Name,
        weddingDate: new Date(weddingDate),
        headline: headline || null,
        sealColor: styling?.sealColor ?? "#D08088",
        sealFont: styling?.sealFont ?? "lavishly-yours",
        monogram: styling?.monogram || null,
        fontPairing: styling?.fontPairing ?? "elegant",
        envelopeEnabled: styling?.envelopeConfig?.enabled ?? true,
        envelopeColor: styling?.envelopeConfig?.color ?? "#FDF8F3",
        envelopeLiner: styling?.envelopeConfig?.linerPattern ?? "floral",
        envelopePersonalizedText: styling?.envelopeConfig?.personalizedText ?? "Noteer de datum in je agenda",
      },
    });

    return NextResponse.json(saveTheDate, { status: 201 });
  } catch (error) {
    console.error("Failed to create save-the-date:", error);
    return NextResponse.json(
      { error: "Failed to create save-the-date" },
      { status: 500 }
    );
  }
}
