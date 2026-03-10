import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { PLANS, STD_PLAN, type PlanId } from "@/lib/mollie";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const [
      paidInvitations,
      paidStds,
      rsvpStats,
      stdViewTotal,
      invitationsByStatus,
      stdsByStatus,
      totalUsers,
      usersWithInvitations,
      usersWithStds,
      usersWhoPaid,
      pageViewsTotal,
      pageViewsToday,
      uniqueVisitors,
      pageViewsLast30Days,
      topPages,
    ] = await Promise.all([
      // Paid invitations with plan info
      db.invitation.findMany({
        where: { paidAt: { not: null } },
        select: { planId: true, discountAmount: true, paidAt: true, templateId: true },
      }),
      // Paid STDs
      db.saveTheDate.findMany({
        where: { paidAt: { not: null } },
        select: { discountAmount: true, paidAt: true, templateId: true },
      }),
      // RSVP stats
      db.rSVP.groupBy({
        by: ["attending"],
        _count: { id: true },
      }),
      // STD view totals
      db.saveTheDate.aggregate({
        _sum: { viewCount: true },
      }),
      // Invitations by status
      db.invitation.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      // STDs by status
      db.saveTheDate.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      // Total users
      db.user.count(),
      // Users who started building (have ≥1 invitation)
      db.invitation.findMany({
        select: { userId: true },
        distinct: ["userId"],
      }),
      // Users who started building (have ≥1 STD)
      db.saveTheDate.findMany({
        select: { userId: true },
        distinct: ["userId"],
      }),
      // Users who paid
      db.invitation.findMany({
        where: { paidAt: { not: null } },
        select: { userId: true },
        distinct: ["userId"],
      }),
      // Website: total page views
      db.pageView.count(),
      // Website: page views today
      db.pageView.count({
        where: { createdAt: { gte: todayStart } },
      }),
      // Website: unique visitors (distinct ipHash)
      db.pageView.findMany({
        select: { ipHash: true },
        distinct: ["ipHash"],
      }),
      // Website: page views last 30 days (for daily chart)
      db.pageView.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, ipHash: true },
      }),
      // Website: top pages
      db.pageView.groupBy({
        by: ["path"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
    ]);

    // Calculate revenue
    let totalRevenue = 0;
    paidInvitations.forEach((inv) => {
      const planId = inv.planId as PlanId | null;
      const planPrice = planId && PLANS[planId] ? PLANS[planId].price : 0;
      totalRevenue += planPrice - (inv.discountAmount || 0);
    });
    paidStds.forEach((std) => {
      totalRevenue += STD_PLAN.price - (std.discountAmount || 0);
    });

    // Monthly revenue (last 12 months)
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("nl-NL", { month: "short", year: "2-digit" });
      let revenue = 0;

      paidInvitations.forEach((inv) => {
        if (inv.paidAt) {
          const pd = new Date(inv.paidAt);
          if (pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()) {
            const planId = inv.planId as PlanId | null;
            const planPrice = planId && PLANS[planId] ? PLANS[planId].price : 0;
            revenue += planPrice - (inv.discountAmount || 0);
          }
        }
      });
      paidStds.forEach((std) => {
        if (std.paidAt) {
          const pd = new Date(std.paidAt);
          if (pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()) {
            revenue += STD_PLAN.price - (std.discountAmount || 0);
          }
        }
      });

      monthlyRevenue.push({ month: label, revenue });
    }

    // Template popularity
    const templateCounts: Record<string, { name: string; count: number; type: string }> = {};
    paidInvitations.forEach((inv) => {
      const key = `inv-${inv.templateId}`;
      if (!templateCounts[key]) {
        templateCounts[key] = { name: inv.templateId, count: 0, type: "invitation" };
      }
      templateCounts[key].count++;
    });
    paidStds.forEach((std) => {
      const key = `std-${std.templateId}`;
      if (!templateCounts[key]) {
        templateCounts[key] = { name: std.templateId, count: 0, type: "std" };
      }
      templateCounts[key].count++;
    });
    const templatePopularity = Object.values(templateCounts).sort((a, b) => b.count - a.count);

    // RSVP formatted
    const rsvpFormatted = {
      yes: rsvpStats.find((r) => r.attending === "YES")?._count.id || 0,
      no: rsvpStats.find((r) => r.attending === "NO")?._count.id || 0,
      maybe: rsvpStats.find((r) => r.attending === "MAYBE")?._count.id || 0,
    };

    // Conversion funnel
    const statusToCount = (items: { status: string; _count: { id: number } }[]) => {
      const map: Record<string, number> = {};
      items.forEach((s) => {
        map[s.status] = s._count.id;
      });
      return map;
    };
    const invStatusMap = statusToCount(invitationsByStatus);
    const stdStatusMap = statusToCount(stdsByStatus);

    // Active invitations
    const activeInvitations = invStatusMap["PUBLISHED"] || 0;

    // Builder funnel
    const builderUserIds = new Set([
      ...usersWithInvitations.map((u) => u.userId),
      ...usersWithStds.map((u) => u.userId),
    ]);
    const paidUserIds = new Set(usersWhoPaid.map((u) => u.userId));
    // Also add STD paid users
    const stdPaidUsers = await db.saveTheDate.findMany({
      where: { paidAt: { not: null } },
      select: { userId: true },
      distinct: ["userId"],
    });
    stdPaidUsers.forEach((u) => paidUserIds.add(u.userId));

    // Daily visitors (last 30 days)
    const dailyVisitors: { date: string; views: number; unique: number }[] = [];
    const dayMap: Record<string, { views: number; ips: Set<string> }> = {};
    pageViewsLast30Days.forEach((pv) => {
      const d = new Date(pv.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!dayMap[key]) dayMap[key] = { views: 0, ips: new Set() };
      dayMap[key].views++;
      dayMap[key].ips.add(pv.ipHash);
    });
    // Fill in all 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = `${d.getDate()} ${d.toLocaleString("nl-NL", { month: "short" })}`;
      dailyVisitors.push({
        date: label,
        views: dayMap[key]?.views || 0,
        unique: dayMap[key]?.ips.size || 0,
      });
    }

    return NextResponse.json({
      totalRevenue,
      totalOrders: paidInvitations.length + paidStds.length,
      activeInvitations,
      totalRsvps: rsvpFormatted.yes + rsvpFormatted.no + rsvpFormatted.maybe,
      monthlyRevenue,
      templatePopularity,
      rsvp: rsvpFormatted,
      stdViews: stdViewTotal._sum.viewCount || 0,
      conversionFunnel: {
        invitations: {
          draft: invStatusMap["DRAFT"] || 0,
          paid: invStatusMap["PAID"] || 0,
          published: invStatusMap["PUBLISHED"] || 0,
          expired: invStatusMap["EXPIRED"] || 0,
        },
        stds: {
          draft: stdStatusMap["DRAFT"] || 0,
          paid: stdStatusMap["PAID"] || 0,
          published: stdStatusMap["PUBLISHED"] || 0,
          expired: stdStatusMap["EXPIRED"] || 0,
        },
      },
      visitors: {
        total: pageViewsTotal,
        today: pageViewsToday,
        unique: uniqueVisitors.length,
        topPages: topPages.map((p) => ({ path: p.path, count: p._count.id })),
        daily: dailyVisitors,
      },
      builderFunnel: {
        signedUp: totalUsers,
        startedBuilding: builderUserIds.size,
        paid: paidUserIds.size,
        published: (invStatusMap["PUBLISHED"] || 0) + (stdStatusMap["PUBLISHED"] || 0),
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
