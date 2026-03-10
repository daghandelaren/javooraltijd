import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { STD_PLAN } from "@/lib/mollie";
import { getStdTemplateById } from "@/lib/std-templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const std = await db.saveTheDate.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        views: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!std) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const template = getStdTemplateById(std.templateId);

    return NextResponse.json({
      id: std.id,
      partner1Name: std.partner1Name,
      partner2Name: std.partner2Name,
      weddingDate: std.weddingDate,
      headline: std.headline,
      templateName: template?.name || std.templateId,
      templateId: std.templateId,
      status: std.status,
      email: std.user.email,
      shareUrl: std.shareUrl,
      shareId: std.shareId,
      publishedAt: std.publishedAt,
      expiresAt: std.expiresAt,
      viewCount: std.viewCount,
      views: std.views.map((v) => ({
        id: v.id,
        ipHash: v.ipHash,
        userAgent: v.userAgent,
        createdAt: v.createdAt,
      })),
      payment: {
        planName: STD_PLAN.name,
        planPrice: STD_PLAN.price,
        discount: std.discountAmount || 0,
        discountCode: std.discountCode,
        paidAt: std.paidAt,
      },
      styling: {
        sealColor: std.sealColor,
        sealFont: std.sealFont,
        fontPairing: std.fontPairing,
        monogram: std.monogram,
      },
    });
  } catch (error) {
    console.error("Admin active STD detail error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
