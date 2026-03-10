import { db } from "@/lib/db";
import { PLANS, STD_PLAN, type PlanId } from "@/lib/mollie";
import { getTemplateById } from "@/lib/templates";
import { getStdTemplateById } from "@/lib/std-templates";
import {
  Euro,
  ShoppingCart,
  Send,
  Users,
  Eye,
  Hammer,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AdminOverviewPage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    paidInvitations,
    paidStds,
    activeInvitations,
    totalRsvps,
    pageViewsToday,
    pageViewsTotal,
    builderUsers,
  ] = await Promise.all([
    db.invitation.findMany({
      where: { paidAt: { not: null } },
      select: {
        id: true,
        planId: true,
        discountAmount: true,
        paidAt: true,
        status: true,
        templateId: true,
        user: { select: { email: true } },
      },
      orderBy: { paidAt: "desc" },
    }),
    db.saveTheDate.findMany({
      where: { paidAt: { not: null } },
      select: {
        id: true,
        discountAmount: true,
        paidAt: true,
        status: true,
        templateId: true,
        user: { select: { email: true } },
      },
      orderBy: { paidAt: "desc" },
    }),
    db.invitation.count({ where: { status: "PUBLISHED" } }),
    db.rSVP.count(),
    db.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    db.pageView.count(),
    db.invitation
      .findMany({ select: { userId: true }, distinct: ["userId"] })
      .then(async (invUsers) => {
        const stdUsers = await db.saveTheDate.findMany({
          select: { userId: true },
          distinct: ["userId"],
        });
        return new Set([...invUsers.map((u) => u.userId), ...stdUsers.map((u) => u.userId)])
          .size;
      }),
  ]);

  // Calculate total revenue
  let totalRevenue = 0;
  paidInvitations.forEach((inv) => {
    const planId = inv.planId as PlanId | null;
    const planPrice = planId && PLANS[planId] ? PLANS[planId].price : 0;
    totalRevenue += planPrice - (inv.discountAmount || 0);
  });
  paidStds.forEach((std) => {
    totalRevenue += STD_PLAN.price - (std.discountAmount || 0);
  });

  const totalOrders = paidInvitations.length + paidStds.length;

  // Recent orders (last 10)
  const allOrders = [
    ...paidInvitations.map((inv) => {
      const planId = inv.planId as PlanId | null;
      const planPrice = planId && PLANS[planId] ? PLANS[planId].price : 0;
      const template = getTemplateById(inv.templateId);
      return {
        id: inv.id,
        type: "Uitnodiging" as const,
        email: inv.user.email,
        templateName: template?.name || inv.templateId,
        amount: planPrice - (inv.discountAmount || 0),
        status: inv.status,
        paidAt: inv.paidAt!,
      };
    }),
    ...paidStds.map((std) => {
      const template = getStdTemplateById(std.templateId);
      return {
        id: std.id,
        type: "Save the Date" as const,
        email: std.user.email,
        templateName: template?.name || std.templateId,
        amount: STD_PLAN.price - (std.discountAmount || 0),
        status: std.status,
        paidAt: std.paidAt!,
      };
    }),
  ]
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    .slice(0, 10);

  const stats = [
    {
      label: "Totale Omzet",
      value: formatCents(totalRevenue),
      icon: Euro,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Totale Bestellingen",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Actieve Uitnodigingen",
      value: activeInvitations.toString(),
      icon: Send,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Totale RSVPs",
      value: totalRsvps.toString(),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Bezoekers Vandaag",
      value: `${pageViewsToday} / ${pageViewsTotal} totaal`,
      icon: Eye,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      label: "Builder Gebruikers",
      value: builderUsers.toString(),
      icon: Hammer,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const statusVariant = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "success";
      case "PAID":
        return "warning";
      case "EXPIRED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-stone-200 p-5 flex items-start gap-4"
          >
            <div className={`${stat.bg} p-2.5 rounded-lg`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-stone-500">{stat.label}</p>
              <p className="text-xl font-semibold text-stone-800 mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <h2 className="font-semibold text-stone-800">
            Recente Bestellingen
          </h2>
          <Link
            href="/admin/dashboard/orders"
            className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium"
          >
            Bekijk alle bestellingen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-5 py-3 font-medium text-stone-500">
                  Datum
                </th>
                <th className="text-left px-5 py-3 font-medium text-stone-500">
                  E-mail
                </th>
                <th className="text-left px-5 py-3 font-medium text-stone-500">
                  Type
                </th>
                <th className="text-left px-5 py-3 font-medium text-stone-500">
                  Template
                </th>
                <th className="text-left px-5 py-3 font-medium text-stone-500">
                  Bedrag
                </th>
                <th className="text-left px-5 py-3 font-medium text-stone-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {allOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-stone-400"
                  >
                    Nog geen bestellingen
                  </td>
                </tr>
              ) : (
                allOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-stone-50 hover:bg-stone-50/50"
                  >
                    <td className="px-5 py-3 text-stone-600">
                      {formatDate(order.paidAt)}
                    </td>
                    <td className="px-5 py-3 text-stone-800 font-medium">
                      {order.email}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={
                          order.type === "Uitnodiging" ? "default" : "secondary"
                        }
                      >
                        {order.type}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-stone-600">
                      {order.templateName}
                    </td>
                    <td className="px-5 py-3 text-stone-800 font-medium">
                      {formatCents(order.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={statusVariant(order.status) as "success" | "warning" | "destructive" | "secondary"}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
