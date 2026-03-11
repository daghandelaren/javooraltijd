import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "crypto";

const IP_SALT = process.env.IP_HASH_SALT || "javooraltijd-inv-view-salt";

function hashIp(ip: string): string {
  return createHash("sha256").update(`${IP_SALT}:${ip}`).digest("hex");
}

// POST /api/invitations/[id]/view - Track a unique view
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invitation = await db.invitation.findUnique({
      where: { id: params.id },
      select: { id: true, status: true },
    });

    if (!invitation || (invitation.status !== "PUBLISHED" && invitation.status !== "PAID")) {
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
    await db.invitationView.upsert({
      where: {
        invitationId_ipHash: {
          invitationId: params.id,
          ipHash,
        },
      },
      create: {
        invitationId: params.id,
        ipHash,
        userAgent,
      },
      update: {},
    });

    // Update the cached view count
    const viewCount = await db.invitationView.count({
      where: { invitationId: params.id },
    });

    await db.invitation.update({
      where: { id: params.id },
      data: { viewCount },
    });

    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ tracked: false }, { status: 500 });
  }
}
