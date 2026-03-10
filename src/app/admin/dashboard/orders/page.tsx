"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  type: "invitation" | "std";
  email: string;
  templateName: string;
  plan: string;
  amount: number;
  discount: number;
  status: string;
  paidAt: string;
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const statusVariant = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "success" as const;
    case "PAID":
      return "warning" as const;
    case "EXPIRED":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        type: typeFilter,
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, search]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Zoek op e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
            />
          </div>
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="all">Alle types</option>
            <option value="invitation">Uitnodigingen</option>
            <option value="std">Save the Dates</option>
          </select>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="">Alle statussen</option>
            <option value="PAID">Betaald</option>
            <option value="PUBLISHED">Gepubliceerd</option>
            <option value="EXPIRED">Verlopen</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left px-4 py-3 font-medium text-stone-500">Datum</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">E-mail</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Template</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Bedrag</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Korting</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-stone-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin" />
                      Laden...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-stone-400">
                    Geen bestellingen gevonden
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-stone-100 hover:bg-stone-50/50"
                  >
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">
                      {formatDate(order.paidAt)}
                    </td>
                    <td className="px-4 py-3 text-stone-800 font-medium max-w-[200px] truncate">
                      {order.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={order.type === "invitation" ? "default" : "secondary"}>
                        {order.type === "invitation" ? "Uitnodiging" : "STD"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                      {order.templateName}
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                      {order.plan}
                    </td>
                    <td className="px-4 py-3 text-stone-800 font-medium whitespace-nowrap">
                      {formatCents(order.amount)}
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden lg:table-cell">
                      {order.discount > 0 ? (
                        <span className="text-emerald-600">
                          -{formatCents(order.discount)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              {total} resultaten &middot; Pagina {page} van {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-stone-300 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-stone-300 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
