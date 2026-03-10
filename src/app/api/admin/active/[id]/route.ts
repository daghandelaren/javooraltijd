import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { PLANS, type PlanId } from "@/lib/mollie";
import { getTemplateById } from "@/lib/templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const invitation = await db.invitation.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        rsvps: {
          orderBy: { createdAt: "desc" },
        },
        locations: {
          orderBy: { order: "asc" },
        },
        timeline: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const template = getTemplateById(invitation.templateId);
    const planId = invitation.planId as PlanId | null;
    const planPrice = planId && PLANS[planId] ? PLANS[planId].price : 0;
    const planName = planId && PLANS[planId] ? PLANS[planId].name : "-";

    return NextResponse.json({
      id: invitation.id,
      partner1Name: invitation.partner1Name,
      partner2Name: invitation.partner2Name,
      weddingDate: invitation.weddingDate,
      weddingTime: invitation.weddingTime,
      headline: invitation.headline,
      dresscode: invitation.dresscode,
      templateName: template?.name || invitation.templateId,
      templateId: invitation.templateId,
      status: invitation.status,
      email: invitation.user.email,
      shareUrl: invitation.shareUrl,
      shareId: invitation.shareId,
      publishedAt: invitation.publishedAt,
      expiresAt: invitation.expiresAt,
      rsvps: invitation.rsvps.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        attending: r.attending,
        guestCount: r.guestCount,
        dietary: r.dietary,
        message: r.message,
        createdAt: r.createdAt,
      })),
      locations: invitation.locations.map((l) => ({
        id: l.id,
        name: l.name,
        type: l.type,
        address: l.address,
        time: l.time,
        notes: l.notes,
        mapsUrl: l.mapsUrl,
      })),
      timeline: invitation.timeline.map((t) => ({
        id: t.id,
        title: t.title,
        time: t.time,
        description: t.description,
        icon: t.icon,
      })),
      payment: {
        planName,
        planPrice,
        discount: invitation.discountAmount || 0,
        discountCode: invitation.discountCode,
        paidAt: invitation.paidAt,
      },
      styling: {
        sealColor: invitation.sealColor,
        sealFont: invitation.sealFont,
        sealStyle: invitation.sealStyle,
        fontPairing: invitation.fontPairing,
        monogram: invitation.monogram,
      },
    });
  } catch (error) {
    console.error("Admin active invitation detail error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
