"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RSVP {
  id: string;
  name: string;
  email: string | null;
  attending: "YES" | "NO" | "MAYBE";
  guestCount: number;
  dietary: string | null;
  message: string | null;
  createdAt: string;
}

interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  time: string;
  notes: string | null;
  mapsUrl: string | null;
}

interface TimelineItem {
  id: string;
  title: string;
  time: string;
  description: string | null;
  icon: string | null;
}

interface InvitationDetail {
  id: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  weddingTime: string | null;
  headline: string | null;
  dresscode: string | null;
  templateName: string;
  status: string;
  email: string;
  shareUrl: string | null;
  shareId: string;
  publishedAt: string | null;
  expiresAt: string | null;
  rsvps: RSVP[];
  locations: Location[];
  timeline: TimelineItem[];
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

const attendingVariant = (status: string) => {
  switch (status) {
    case "YES": return "success" as const;
    case "NO": return "destructive" as const;
    case "MAYBE": return "warning" as const;
    default: return "secondary" as const;
  }
};

const attendingLabel = (status: string) => {
  switch (status) {
    case "YES": return "Ja";
    case "NO": return "Nee";
    case "MAYBE": return "Misschien";
    default: return status;
  }
};

export default function ActiveInvitationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<InvitationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/active/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch invitation:", error);
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
        <p className="text-stone-400">Uitnodiging niet gevonden</p>
        <button
          onClick={() => router.push("/admin/dashboard/active")}
          className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium"
        >
          Terug naar overzicht
        </button>
      </div>
    );
  }

  const rsvpYes = data.rsvps.filter((r) => r.attending === "YES");
  const rsvpNo = data.rsvps.filter((r) => r.attending === "NO");
  const rsvpMaybe = data.rsvps.filter((r) => r.attending === "MAYBE");
  const totalGuests = data.rsvps
    .filter((r) => r.attending === "YES")
    .reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/admin/dashboard/active")}
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
            <p className="text-stone-500 mt-1">
              {formatDate(data.weddingDate)}
              {data.weddingTime && ` om ${data.weddingTime}`}
            </p>
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
              Bekijk uitnodiging
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

      {/* RSVP overview */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">RSVP Overzicht</h3>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-semibold text-emerald-700">{rsvpYes.length}</p>
            <p className="text-xs text-emerald-600">Ja</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-semibold text-red-700">{rsvpNo.length}</p>
            <p className="text-xs text-red-600">Nee</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-semibold text-amber-700">{rsvpMaybe.length}</p>
            <p className="text-xs text-amber-600">Misschien</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-semibold text-stone-700">{totalGuests}</p>
            <p className="text-xs text-stone-500">Gasten (Ja)</p>
          </div>
        </div>

        {/* RSVP table */}
        {data.rsvps.length === 0 ? (
          <p className="text-sm text-stone-400">Nog geen RSVPs ontvangen</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left px-3 py-2 font-medium text-stone-500">Naam</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-500 hidden md:table-cell">E-mail</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-500">Status</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-500">Gasten</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-500 hidden lg:table-cell">Dieetwensen</th>
                  <th className="text-left px-3 py-2 font-medium text-stone-500 hidden lg:table-cell">Bericht</th>
                </tr>
              </thead>
              <tbody>
                {data.rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-stone-100">
                    <td className="px-3 py-2.5 text-stone-800 font-medium">{rsvp.name}</td>
                    <td className="px-3 py-2.5 text-stone-600 hidden md:table-cell">{rsvp.email || "-"}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant={attendingVariant(rsvp.attending)}>
                        {attendingLabel(rsvp.attending)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-stone-600">{rsvp.guestCount}</td>
                    <td className="px-3 py-2.5 text-stone-600 hidden lg:table-cell max-w-[150px] truncate">
                      {rsvp.dietary || "-"}
                    </td>
                    <td className="px-3 py-2.5 text-stone-600 hidden lg:table-cell max-w-[200px] truncate">
                      {rsvp.message || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Locations */}
      {data.locations.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Locaties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.locations.map((loc) => (
              <div key={loc.id} className="border border-stone-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-stone-800">{loc.name}</p>
                    <Badge variant="secondary" className="mt-1">{loc.type}</Badge>
                  </div>
                  <span className="text-sm text-stone-500">{loc.time}</span>
                </div>
                <p className="text-sm text-stone-600 mt-2">{loc.address}</p>
                {loc.notes && (
                  <p className="text-sm text-stone-400 mt-1">{loc.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {data.timeline.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Tijdlijn
          </h3>
          <div className="space-y-3">
            {data.timeline.map((item) => (
              <div key={item.id} className="flex items-start gap-4 pl-2">
                <div className="w-16 shrink-0 text-sm font-medium text-amber-600">{item.time}</div>
                <div className="flex-1 border-l-2 border-stone-200 pl-4 pb-3">
                  <p className="font-medium text-stone-800">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-stone-500 mt-0.5">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Betaling
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-stone-500">Plan</p>
            <p className="font-medium text-stone-800">{data.payment.planName}</p>
          </div>
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
