import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "crypto";

const IP_SALT = process.env.IP_HASH_SALT || "javooraltijd-std-view-salt";

function hashIp(ip: string): string {
  return createHash("sha256").update(`${IP_SALT}:${ip}`).digest("hex");
}

// POST /api/save-the-date/[id]/view - Track a unique view
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saveTheDate = await db.saveTheDate.findUnique({
      where: { id: params.id },
      select: { id: true, status: true },
    });

    if (!saveTheDate || saveTheDate.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = hashIp(ip);
    const userAgent = request.headers.get("user-agent") || null;

    // Upsert: only creates a new view if this IP hasn't viewed before
    await db.saveTheDateView.upsert({
      where: {
        saveTheDateId_ipHash: {
          saveTheDateId: params.id,
          ipHash,
        },
      },
      create: {
        saveTheDateId: params.id,
        ipHash,
        userAgent,
      },
      update: {},
    });

    // Update the cached view count
    const viewCount = await db.saveTheDateView.count({
      where: { saveTheDateId: params.id },
    });

    await db.saveTheDate.update({
      where: { id: params.id },
      data: { viewCount },
    });

    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ tracked: false }, { status: 500 });
  }
}
