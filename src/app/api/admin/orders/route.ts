import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { PLANS, STD_PLAN, type PlanId } from "@/lib/mollie";
import { getTemplateById } from "@/lib/templates";
import { getStdTemplateById } from "@/lib/std-templates";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const type = url.searchParams.get("type") || "all";
  const status = url.searchParams.get("status") || "";
  const search = url.searchParams.get("search") || "";

  try {
    // Build where clauses
    const invitationWhere: Record<string, unknown> = { paidAt: { not: null } };
    const stdWhere: Record<string, unknown> = { paidAt: { not: null } };

    if (status) {
      invitationWhere.status = status;
      stdWhere.status = status;
    }

    if (search) {
      invitationWhere.user = { email: { contains: search, mode: "insensitive" } };
      stdWhere.user = { email: { contains: search, mode: "insensitive" } };
    }

    // Fetch based on type filter
    let invitations: Array<Record<string, unknown>> = [];
    let stds: Array<Record<string, unknown>> = [];

    if (type === "all" || type === "invitation") {
      invitations = await db.invitation.findMany({
        where: invitationWhere,
        include: { user: { select: { email: true } } },
        orderBy: { paidAt: "desc" },
      });
    }

    if (type === "all" || type === "std") {
      stds = await db.saveTheDate.findMany({
        where: stdWhere,
        include: { user: { select: { email: true } } },
        orderBy: { paidAt: "desc" },
      });
    }

    // Merge into unified list
    const orders = [
      ...invitations.map((inv: Record<string, unknown>) => {
        const planId = inv.planId as PlanId | null;
        const planPrice = planId && PLANS[planId] ? PLANS[planId].price : 0;
        const discount = (inv.discountAmount as number) || 0;
        const template = getTemplateById(inv.templateId as string);
        return {
          id: inv.id,
          type: "invitation" as const,
          email: (inv.user as { email: string }).email,
          templateName: template?.name || inv.templateId,
          plan: planId ? PLANS[planId]?.name || planId : "-",
          amount: planPrice - discount,
          discount,
          status: inv.status,
          paidAt: inv.paidAt,
          createdAt: inv.createdAt,
        };
      }),
      ...stds.map((std: Record<string, unknown>) => {
        const discount = (std.discountAmount as number) || 0;
        const template = getStdTemplateById(std.templateId as string);
        return {
          id: std.id,
          type: "std" as const,
          email: (std.user as { email: string }).email,
          templateName: template?.name || std.templateId,
          plan: STD_PLAN.name,
          amount: STD_PLAN.price - discount,
          discount,
          status: std.status,
          paidAt: std.paidAt,
          createdAt: std.createdAt,
        };
      }),
    ];

    // Sort by paidAt descending
    orders.sort((a, b) => {
      const dateA = new Date(a.paidAt as string).getTime();
      const dateB = new Date(b.paidAt as string).getTime();
      return dateB - dateA;
    });

    const total = orders.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = orders.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      orders: paginated,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
