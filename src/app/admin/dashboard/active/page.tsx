"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface ActiveInvitation {
  id: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  templateName: string;
  email: string;
  rsvpYes: number;
  rsvpNo: number;
  rsvpMaybe: number;
  rsvpTotal: number;
  publishedAt: string;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function ActiveInvitationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<ActiveInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/active");
        const data = await res.json();
        setItems(data.items || []);
      } catch (error) {
        console.error("Failed to fetch active invitations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left px-4 py-3 font-medium text-stone-500">Koppel</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Trouwdatum</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Template</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">E-mail</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">RSVPs</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Gepubliceerd op</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-stone-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin" />
                      Laden...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-stone-400">
                    Geen actieve uitnodigingen gevonden
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/admin/dashboard/active/${item.id}`)}
                    className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-stone-800 font-medium whitespace-nowrap">
                      {item.partner1Name} & {item.partner2Name}
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell whitespace-nowrap">
                      {formatDate(item.weddingDate)}
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden lg:table-cell">
                      {item.templateName}
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell max-w-[200px] truncate">
                      {item.email}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="success">{item.rsvpYes} Ja</Badge>
                        <Badge variant="destructive">{item.rsvpNo} Nee</Badge>
                        <Badge variant="warning">{item.rsvpMaybe} ?</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden lg:table-cell whitespace-nowrap">
                      {item.publishedAt ? formatDate(item.publishedAt) : "-"}
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
