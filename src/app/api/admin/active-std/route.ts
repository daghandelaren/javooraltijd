import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { getStdTemplateById } from "@/lib/std-templates";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stds = await db.saveTheDate.findMany({
      where: { status: "PUBLISHED" },
      include: {
        user: { select: { email: true } },
        views: { select: { id: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    const items = stds.map((std) => {
      const template = getStdTemplateById(std.templateId);

      return {
        id: std.id,
        partner1Name: std.partner1Name,
        partner2Name: std.partner2Name,
        weddingDate: std.weddingDate,
        templateName: template?.name || std.templateId,
        email: std.user.email,
        viewCount: std.viewCount,
        shareUrl: std.shareUrl,
        publishedAt: std.publishedAt,
        expiresAt: std.expiresAt,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Admin active STDs error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
