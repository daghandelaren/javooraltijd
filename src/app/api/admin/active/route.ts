import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { getTemplateById } from "@/lib/templates";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invitations = await db.invitation.findMany({
      where: { status: "PUBLISHED" },
      include: {
        user: { select: { email: true } },
        rsvps: { select: { attending: true } },
        locations: { select: { id: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    const items = invitations.map((inv) => {
      const template = getTemplateById(inv.templateId);
      const rsvpYes = inv.rsvps.filter((r) => r.attending === "YES").length;
      const rsvpNo = inv.rsvps.filter((r) => r.attending === "NO").length;
      const rsvpMaybe = inv.rsvps.filter((r) => r.attending === "MAYBE").length;

      return {
        id: inv.id,
        partner1Name: inv.partner1Name,
        partner2Name: inv.partner2Name,
        weddingDate: inv.weddingDate,
        templateName: template?.name || inv.templateId,
        email: inv.user.email,
        rsvpYes,
        rsvpNo,
        rsvpMaybe,
        rsvpTotal: inv.rsvps.length,
        locationCount: inv.locations.length,
        shareUrl: inv.shareUrl,
        publishedAt: inv.publishedAt,
        expiresAt: inv.expiresAt,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Admin active invitations error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
