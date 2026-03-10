"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Eye, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StdView {
  id: string;
  ipHash: string;
  userAgent: string | null;
  createdAt: string;
}

interface StdDetail {
  id: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  headline: string | null;
  templateName: string;
  status: string;
  email: string;
  shareUrl: string | null;
  shareId: string;
  publishedAt: string | null;
  expiresAt: string | null;
  viewCount: number;
  views: StdView[];
  payment: {
    planName: string;
    planPrice: number;
    discount: number;
    discountCode: string | null;
    paidAt: string | null;
  };
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function ActiveStdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<StdDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/active-std/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch STD:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400">Save the Date niet gevonden</p>
        <button
          onClick={() => router.push("/admin/dashboard/active-std")}
          className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium"
        >
          Terug naar overzicht
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/admin/dashboard/active-std")}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar overzicht
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-stone-800">
              {data.partner1Name} & {data.partner2Name}
            </h2>
            <p className="text-stone-500 mt-1">{formatDate(data.weddingDate)}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="success">{data.status}</Badge>
              <span className="text-sm text-stone-500">{data.templateName}</span>
              <span className="text-sm text-stone-400">&middot;</span>
              <span className="text-sm text-stone-500">{data.email}</span>
            </div>
          </div>
          {data.shareUrl && (
            <a
              href={data.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              Bekijk Save the Date
            </a>
          )}
        </div>
        {data.publishedAt && (
          <p className="text-xs text-stone-400 mt-3">
            Gepubliceerd op {formatDateTime(data.publishedAt)}
            {data.expiresAt && ` · Verloopt op ${formatDateTime(data.expiresAt)}`}
          </p>
        )}
      </div>

      {/* Views */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Weergaven
        </h3>

        <div className="bg-stone-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-3xl font-semibold text-stone-800">{data.viewCount}</p>
          <p className="text-sm text-stone-500">Totaal weergaven</p>
        </div>

        {data.views.length === 0 ? (
          <p className="text-sm text-stone-400">Nog geen weergaven geregistreerd</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left px-3 py-2 font-medium text-stone-500">IP Hash</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-500 hidden md:table-cell">User Agent</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-500">Datum</th>
                </tr>
              </thead>
              <tbody>
                {data.views.map((view) => (
                  <tr key={view.id} className="border-b border-stone-100">
                    <td className="px-3 py-2.5 text-stone-600 font-mono text-xs">
                      {view.ipHash.substring(0, 12)}...
                    </td>
                    <td className="px-3 py-2.5 text-stone-500 hidden md:table-cell max-w-[300px] truncate text-xs">
                      {view.userAgent || "-"}
                    </td>
                    <td className="px-3 py-2.5 text-stone-600 whitespace-nowrap">
                      {formatDateTime(view.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Betaling
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-stone-500">Bedrag</p>
            <p className="font-medium text-stone-800">{formatCents(data.payment.planPrice)}</p>
          </div>
          <div>
            <p className="text-stone-500">Korting</p>
            <p className="font-medium text-stone-800">
              {data.payment.discount > 0 ? (
                <span className="text-emerald-600">
                  -{formatCents(data.payment.discount)}
                  {data.payment.discountCode && (
                    <span className="text-stone-400 ml-1">({data.payment.discountCode})</span>
                  )}
                </span>
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <p className="text-stone-500">Betaald op</p>
            <p className="font-medium text-stone-800">
              {data.payment.paidAt ? formatDate(data.payment.paidAt) : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
