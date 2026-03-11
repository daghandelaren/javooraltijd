"use client";

import { motion } from "framer-motion";
import { CheckCircle2, HelpCircle, XCircle, UserCheck } from "lucide-react";

interface Props {
  attending: number;
  maybe: number;
  notAttending: number;
  total: number;
}

export function RsvpProgressBar({ attending, maybe, notAttending, total }: Props) {
  const safeTotal = total || 1;
  const attendingPct = (attending / safeTotal) * 100;
  const maybePct = (maybe / safeTotal) * 100;
  const notAttendingPct = (notAttending / safeTotal) * 100;

  return (
    <div className="col-span-2 bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-olive-100 flex items-center justify-center">
          <UserCheck className="w-4 h-4 text-olive-600" />
        </div>
        <span className="font-medium text-stone-800">RSVP Overzicht</span>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-stone-100 rounded-full overflow-hidden flex mb-4">
        {total > 0 ? (
          <>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${attendingPct}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-emerald-500 h-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${maybePct}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-amber-400 h-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${notAttendingPct}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-stone-300 h-full"
            />
          </>
        ) : (
          <div className="w-full h-full bg-stone-100" />
        )}
      </div>

      {/* Stats Row */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-stone-600">Ja:</span>
          <span className="font-semibold text-stone-900">{attending}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span className="text-stone-600">Misschien:</span>
          <span className="font-semibold text-stone-900">{maybe}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <XCircle className="w-4 h-4 text-stone-400" />
          <span className="text-stone-600">Nee:</span>
          <span className="font-semibold text-stone-900">{notAttending}</span>
        </div>
      </div>
    </div>
  );
}
