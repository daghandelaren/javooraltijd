"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface RSVP {
  id: string;
  name: string;
  attending: string;
  createdAt: string;
}

interface Props {
  rsvps: RSVP[];
  invitationId: string;
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} min geleden`;
  if (diffHours < 24) return `${diffHours} uur geleden`;
  if (diffDays === 1) return "1 dag geleden";
  if (diffDays < 30) return `${diffDays} dagen geleden`;
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

function getStatusLabel(attending: string): string {
  switch (attending) {
    case "YES": return "Komt";
    case "NO": return "Komt niet";
    case "MAYBE": return "Misschien";
    default: return attending;
  }
}

function getStatusClasses(attending: string): string {
  switch (attending) {
    case "YES": return "bg-emerald-100 text-emerald-700";
    case "NO": return "bg-stone-100 text-stone-600";
    case "MAYBE": return "bg-amber-100 text-amber-700";
    default: return "bg-stone-100 text-stone-600";
  }
}

export function RecentResponses({ rsvps, invitationId }: Props) {
  const recent = rsvps.slice(0, 4);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-champagne-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-champagne-700" />
          </div>
          <span className="font-medium text-stone-800">Recente reacties</span>
        </div>
        <Link
          href={`/dashboard/${invitationId}/rsvp`}
          className="text-xs text-olive-600 font-medium hover:underline"
        >
          Bekijk alles &rarr;
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-stone-400 py-4 text-center">
          Nog geen reacties ontvangen
        </p>
      ) : (
        <div className="space-y-3">
          {recent.map((rsvp, index) => (
            <motion.div
              key={rsvp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-stone-600 text-xs font-medium">
                  {rsvp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">{rsvp.name}</p>
                  <p className="text-xs text-stone-400">{getRelativeTime(rsvp.createdAt)}</p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusClasses(rsvp.attending)}`}
              >
                {getStatusLabel(rsvp.attending)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
