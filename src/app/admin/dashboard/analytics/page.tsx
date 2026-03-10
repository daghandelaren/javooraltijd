import { db } from "@/lib/db";
import { PLANS, STD_PLAN, type PlanId } from "@/lib/mollie";
import { getTemplateById } from "@/lib/templates";
import { getStdTemplateById } from "@/lib/std-templates";
import {
  Euro,
  Eye,
  TrendingUp,
  Users,
  ArrowDown,
} from "lucide-react";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    paidInvitations,
    paidStds,
    rsvpStats,
    invitationsByStatus,
    stdsByStatus,
    totalUsers,
    usersWithInvitations,
    usersWithStds,
    paidInvUsers,
    paidStdUsers,
    pageViewsTotal,
    pageViewsToday,
    uniqueVisitors,
    pageViewsLast30Days,
    topPages,
  ] = await Promise.all([
    db.invitation.findMany({
      where: { paidAt: { not: null } },
      select: { planId: true, discountAmount: true, paidAt: true, templateId: true },
    }),
    db.saveTheDate.findMany({
      where: { paidAt: { not: null } },
      select: { discountAmount: true, paidAt: true, templateId: true },
    }),
    db.rSVP.groupBy({ by: ["attending"], _count: { id: true } }),
    db.invitation.groupBy({ by: ["status"], _count: { id: true } }),
    db.saveTheDate.groupBy({ by: ["status"], _count: { id: true } }),
    db.user.count(),
    db.invitation.findMany({ select: { userId: true }, distinct: ["userId"] }),
    db.saveTheDate.findMany({ select: { userId: true }, distinct: ["userId"] }),
    db.invitation.findMany({
      where: { paidAt: { not: null } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    db.saveTheDate.findMany({
      where: { paidAt: { not: null } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    db.pageView.count(),
    db.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    db.pageView.findMany({ select: { ipHash: true }, distinct: ["ipHash"] }),
    db.pageView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, ipHash: true },
    }),
    db.pageView.groupBy({
      by: ["path"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  // Revenue calculations
  let totalRevenue = 0;
  const monthlyRevenue: { month: string; revenue: number }[] = [];

  paidInvitations.forEach((inv) => {
    const planId = inv.planId as PlanId | null;
    const planPrice = planId && PLANS[planId] ? PLANS[planId].price : 0;
    totalRevenue += planPrice - (inv.discountAmount || 0);
  });
  paidStds.forEach((std) => {
    totalRevenue += STD_PLAN.price - (std.discountAmount || 0);
  });

  // Monthly revenue (last 12 months)
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("nl-NL", { month: "short" });
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
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  // Template popularity
  const templateCounts: Record<string, { name: string; count: number; type: string }> = {};
  paidInvitations.forEach((inv) => {
    const key = `inv-${inv.templateId}`;
    const template = getTemplateById(inv.templateId);
    if (!templateCounts[key]) {
      templateCounts[key] = { name: template?.name || inv.templateId, count: 0, type: "invitation" };
    }
    templateCounts[key].count++;
  });
  paidStds.forEach((std) => {
    const key = `std-${std.templateId}`;
    const template = getStdTemplateById(std.templateId);
    if (!templateCounts[key]) {
      templateCounts[key] = { name: template?.name || std.templateId, count: 0, type: "std" };
    }
    templateCounts[key].count++;
  });
  const templatePopularity = Object.values(templateCounts).sort((a, b) => b.count - a.count);
  const maxTemplateCount = Math.max(...templatePopularity.map((t) => t.count), 1);

  // RSVP
  const rsvpYes = rsvpStats.find((r) => r.attending === "YES")?._count.id || 0;
  const rsvpNo = rsvpStats.find((r) => r.attending === "NO")?._count.id || 0;
  const rsvpMaybe = rsvpStats.find((r) => r.attending === "MAYBE")?._count.id || 0;
  const rsvpTotal = rsvpYes + rsvpNo + rsvpMaybe;

  // Status maps
  const invStatusMap: Record<string, number> = {};
  invitationsByStatus.forEach((s) => { invStatusMap[s.status] = s._count.id; });
  const stdStatusMap: Record<string, number> = {};
  stdsByStatus.forEach((s) => { stdStatusMap[s.status] = s._count.id; });

  // Builder funnel
  const builderUserIds = new Set([
    ...usersWithInvitations.map((u) => u.userId),
    ...usersWithStds.map((u) => u.userId),
  ]);
  const paidUserIds = new Set([
    ...paidInvUsers.map((u) => u.userId),
    ...paidStdUsers.map((u) => u.userId),
  ]);
  const publishedCount = (invStatusMap["PUBLISHED"] || 0) + (stdStatusMap["PUBLISHED"] || 0);

  const funnelSteps = [
    { label: "Aangemeld", value: totalUsers },
    { label: "Begonnen met bouwen", value: builderUserIds.size },
    { label: "Betaald", value: paidUserIds.size },
    { label: "Gepubliceerd", value: publishedCount },
  ];
  const maxFunnel = Math.max(...funnelSteps.map((s) => s.value), 1);

  // Daily visitors (last 30 days)
  const dayMap: Record<string, { views: number; ips: Set<string> }> = {};
  pageViewsLast30Days.forEach((pv) => {
    const d = new Date(pv.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!dayMap[key]) dayMap[key] = { views: 0, ips: new Set() };
    dayMap[key].views++;
    dayMap[key].ips.add(pv.ipHash);
  });
  const dailyVisitors: { date: string; views: number; unique: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label = `${d.getDate()}`;
    dailyVisitors.push({
      date: label,
      views: dayMap[key]?.views || 0,
      unique: dayMap[key]?.ips.size || 0,
    });
  }
  const maxDailyViews = Math.max(...dailyVisitors.map((d) => d.views), 1);

  // Conversion funnel for invitations + STDs
  const invFunnel = [
    { label: "Concept", value: invStatusMap["DRAFT"] || 0, color: "bg-stone-400" },
    { label: "Betaald", value: invStatusMap["PAID"] || 0, color: "bg-amber-500" },
    { label: "Gepubliceerd", value: invStatusMap["PUBLISHED"] || 0, color: "bg-emerald-500" },
    { label: "Verlopen", value: invStatusMap["EXPIRED"] || 0, color: "bg-red-400" },
  ];
  const stdFunnel = [
    { label: "Concept", value: stdStatusMap["DRAFT"] || 0, color: "bg-stone-400" },
    { label: "Betaald", value: stdStatusMap["PAID"] || 0, color: "bg-amber-500" },
    { label: "Gepubliceerd", value: stdStatusMap["PUBLISHED"] || 0, color: "bg-emerald-500" },
    { label: "Verlopen", value: stdStatusMap["EXPIRED"] || 0, color: "bg-red-400" },
  ];
  const maxInvFunnel = Math.max(...invFunnel.map((s) => s.value), 1);
  const maxStdFunnel = Math.max(...stdFunnel.map((s) => s.value), 1);

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <Euro className="w-4 h-4" />
            Totale Omzet
          </div>
          <p className="text-2xl font-semibold text-stone-800">{formatCents(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            Totale Bestellingen
          </div>
          <p className="text-2xl font-semibold text-stone-800">{paidInvitations.length + paidStds.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <Eye className="w-4 h-4" />
            Website Bezoekers
          </div>
          <p className="text-2xl font-semibold text-stone-800">{uniqueVisitors.length}</p>
          <p className="text-xs text-stone-400 mt-0.5">{pageViewsToday} vandaag &middot; {pageViewsTotal} totaal</p>
        </div>
      </div>

      {/* Visitors chart (last 30 days) */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">Dagelijkse Bezoekers (30 dagen)</h3>
        <div className="flex items-end gap-[2px] h-32">
          {dailyVisitors.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-amber-500/80 rounded-t-sm min-h-[2px] transition-colors hover:bg-amber-600"
                style={{ height: `${(day.views / maxDailyViews) * 100}%` }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-stone-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {day.views} views, {day.unique} uniek
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-stone-400">
          <span>{dailyVisitors[0]?.date}</span>
          <span>{dailyVisitors[14]?.date}</span>
          <span>{dailyVisitors[29]?.date}</span>
        </div>
      </div>

      {/* Builder funnel + Top pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder funnel */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Builder Funnel
          </h3>
          <div className="space-y-3">
            {funnelSteps.map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-stone-600">{step.label}</span>
                  <span className="font-semibold text-stone-800">{step.value}</span>
                </div>
                <div className="h-8 bg-stone-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg transition-all flex items-center justify-end pr-2"
                    style={{ width: `${Math.max((step.value / maxFunnel) * 100, 2)}%` }}
                  >
                    {step.value > 0 && (
                      <span className="text-xs text-white font-medium">
                        {i > 0 && funnelSteps[i - 1].value > 0
                          ? `${Math.round((step.value / funnelSteps[i - 1].value) * 100)}%`
                          : ""}
                      </span>
                    )}
                  </div>
                </div>
                {i < funnelSteps.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-3 h-3 text-stone-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top pages */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Populairste Pagina&apos;s</h3>
          <div className="space-y-2">
            {topPages.length === 0 ? (
              <p className="text-sm text-stone-400">Nog geen data</p>
            ) : (
              topPages.map((page) => (
                <div key={page.path} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-700 truncate font-mono">{page.path}</p>
                  </div>
                  <span className="text-sm font-semibold text-stone-800 tabular-nums">
                    {page._count.id}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly revenue chart */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">Maandelijkse Omzet</h3>
        <div className="flex items-end gap-2 h-40">
          {monthlyRevenue.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-amber-500 rounded-t min-h-[2px] transition-colors hover:bg-amber-600"
                style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
              />
              <span className="text-[10px] text-stone-400 mt-1 truncate w-full text-center">
                {m.month}
              </span>
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-stone-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {formatCents(m.revenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template popularity + RSVP stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template popularity */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Template Populariteit</h3>
          <div className="space-y-3">
            {templatePopularity.length === 0 ? (
              <p className="text-sm text-stone-400">Nog geen data</p>
            ) : (
              templatePopularity.map((t) => (
                <div key={`${t.type}-${t.name}`}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-stone-600">
                      {t.name}
                      <span className="text-stone-400 ml-1 text-xs">
                        ({t.type === "invitation" ? "Uitnodiging" : "STD"})
                      </span>
                    </span>
                    <span className="font-semibold text-stone-800">{t.count}</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${t.type === "invitation" ? "bg-amber-500" : "bg-blue-500"}`}
                      style={{ width: `${(t.count / maxTemplateCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RSVP stats */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">RSVP Statistieken</h3>
          {rsvpTotal === 0 ? (
            <p className="text-sm text-stone-400">Nog geen RSVPs</p>
          ) : (
            <>
              {/* SVG ring chart */}
              <div className="flex items-center justify-center mb-4">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="55" fill="none" stroke="#F5F5F4" strokeWidth="16" />
                  {/* Yes slice */}
                  <circle
                    cx="70"
                    cy="70"
                    r="55"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="16"
                    strokeDasharray={`${(rsvpYes / rsvpTotal) * 345.6} 345.6`}
                    strokeDashoffset="0"
                    transform="rotate(-90 70 70)"
                  />
                  {/* No slice */}
                  <circle
                    cx="70"
                    cy="70"
                    r="55"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="16"
                    strokeDasharray={`${(rsvpNo / rsvpTotal) * 345.6} 345.6`}
                    strokeDashoffset={`${-((rsvpYes / rsvpTotal) * 345.6)}`}
                    transform="rotate(-90 70 70)"
                  />
                  {/* Maybe slice */}
                  <circle
                    cx="70"
                    cy="70"
                    r="55"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="16"
                    strokeDasharray={`${(rsvpMaybe / rsvpTotal) * 345.6} 345.6`}
                    strokeDashoffset={`${-(((rsvpYes + rsvpNo) / rsvpTotal) * 345.6)}`}
                    transform="rotate(-90 70 70)"
                  />
                  <text x="70" y="66" textAnchor="middle" className="text-2xl font-bold fill-stone-800">
                    {rsvpTotal}
                  </text>
                  <text x="70" y="82" textAnchor="middle" className="text-xs fill-stone-400">
                    totaal
                  </text>
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-emerald-50 rounded-lg py-2">
                  <p className="font-semibold text-emerald-700">{rsvpYes}</p>
                  <p className="text-emerald-600 text-xs">Ja</p>
                </div>
                <div className="bg-red-50 rounded-lg py-2">
                  <p className="font-semibold text-red-700">{rsvpNo}</p>
                  <p className="text-red-600 text-xs">Nee</p>
                </div>
                <div className="bg-amber-50 rounded-lg py-2">
                  <p className="font-semibold text-amber-700">{rsvpMaybe}</p>
                  <p className="text-amber-600 text-xs">Misschien</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Conversion funnels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invitation conversion */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Conversie: Uitnodigingen</h3>
          <div className="space-y-2">
            {invFunnel.map((step) => (
              <div key={step.label} className="flex items-center gap-3">
                <span className="text-sm text-stone-600 w-28">{step.label}</span>
                <div className="flex-1 h-6 bg-stone-100 rounded overflow-hidden">
                  <div
                    className={`h-full ${step.color} rounded transition-all`}
                    style={{ width: `${Math.max((step.value / maxInvFunnel) * 100, 1)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-stone-800 w-8 text-right">
                  {step.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STD conversion */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Conversie: Save the Dates</h3>
          <div className="space-y-2">
            {stdFunnel.map((step) => (
              <div key={step.label} className="flex items-center gap-3">
                <span className="text-sm text-stone-600 w-28">{step.label}</span>
                <div className="flex-1 h-6 bg-stone-100 rounded overflow-hidden">
                  <div
                    className={`h-full ${step.color} rounded transition-all`}
                    style={{ width: `${Math.max((step.value / maxStdFunnel) * 100, 1)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-stone-800 w-8 text-right">
                  {step.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
