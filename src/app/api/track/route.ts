import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "crypto";

const IP_SALT = process.env.IP_HASH_SALT || "javooraltijd-std-view-salt";

function hashIp(ip: string): string {
  return createHash("sha256").update(`${IP_SALT}:${ip}`).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();
    if (!path || typeof path !== "string") {
      return NextResponse.json({ tracked: false }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = hashIp(ip);
    const userAgent = request.headers.get("user-agent") || null;
    const referrer = request.headers.get("referer") || null;

    // Rate limit: skip if same ipHash+path combo exists within last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recent = await db.pageView.findFirst({
      where: {
        ipHash,
        path,
        createdAt: { gte: thirtyMinutesAgo },
      },
      select: { id: true },
    });

    if (recent) {
      return NextResponse.json({ tracked: false, reason: "recent" });
    }

    await db.pageView.create({
      data: { path, ipHash, userAgent, referrer },
    });

    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("Page view tracking error:", error);
    return NextResponse.json({ tracked: false }, { status: 500 });
  }
}
