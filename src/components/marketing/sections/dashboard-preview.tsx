"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Users,
  Eye,
  MousePointerClick,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PenLine,
  BarChart3,
  UserCheck,
  Settings,
} from "lucide-react";

// Mock data for the dashboard preview
const rsvpStats = {
  ja: 47,
  nee: 8,
  misschien: 12,
  total: 67,
};

const viewStats = {
  totalViews: 138,
  responses: 92,
};

export function DashboardPreviewSection() {
  const t = useTranslations("home.dashboard_preview");

  const jaPercentage = (rsvpStats.ja / rsvpStats.total) * 100;
  const neePercentage = (rsvpStats.nee / rsvpStats.total) * 100;
  const misschienPercentage = (rsvpStats.misschien / rsvpStats.total) * 100;

  const recentGuests = [
    { name: "Gast A", status: "ja", time: `2 ${t("hours_ago")}` },
    { name: "Gast B & C", status: "ja", time: `5 ${t("hours_ago")}` },
    { name: "Familie D", status: "misschien", time: `1 ${t("day_ago")}` },
    { name: "Gast E", status: "nee", time: `2 ${t("days_ago")}` },
  ];

  const quickActions = [
    { icon: PenLine, label: t("edit_texts") },
    { icon: BarChart3, label: t("export_guests") },
    { icon: Eye, label: t("view_preview") },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800 overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-champagne-100/10 text-champagne-200 text-sm font-medium rounded-full mb-4 border border-champagne-200/20">
            {t("badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Dashboard Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          {/* Glow effect behind dashboard */}
          <div className="absolute inset-0 bg-gradient-to-r from-olive-600/20 via-champagne-400/10 to-olive-600/20 blur-3xl -z-10 scale-95" />

          {/* Browser Chrome */}
          <div className="bg-stone-800 rounded-t-xl border border-stone-700/50 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-stone-600" />
              <div className="w-3 h-3 rounded-full bg-stone-600" />
              <div className="w-3 h-3 rounded-full bg-stone-600" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-stone-700/50 rounded-md px-3 py-1.5 text-xs text-stone-400 max-w-md mx-auto text-center">
                javooraltijd.nl/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="bg-gradient-to-br from-champagne-50 to-white rounded-b-xl border-x border-b border-stone-700/50 p-4 md:p-6 lg:p-8">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-semibold text-stone-900">
                  {t("welcome")}, Partner 1 & Partner 2
                </h3>
                <p className="text-stone-500 text-sm mt-1">
                  {t("wedding_date")}: {t("example_date")}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-olive-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-olive-600/25"
              >
                <PenLine className="w-4 h-4" />
                {t("edit_invitation")}
              </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              {/* RSVP Overview Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="col-span-2 bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-olive-100 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-olive-600" />
                  </div>
                  <span className="font-medium text-stone-800">{t("rsvp_overview")}</span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden flex mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${jaPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-emerald-500 h-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${misschienPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-amber-400 h-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${neePercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="bg-stone-300 h-full"
                  />
                </div>

                {/* Stats Row */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-stone-600">{t("yes")}:</span>
                    <span className="font-semibold text-stone-900">{rsvpStats.ja}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-stone-600">{t("maybe")}:</span>
                    <span className="font-semibold text-stone-900">{rsvpStats.misschien}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-stone-400" />
                    <span className="text-stone-600">{t("no")}:</span>
                    <span className="font-semibold text-stone-900">{rsvpStats.nee}</span>
                  </div>
                </div>
              </motion.div>

              {/* Views Stat */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-stone-900">{viewStats.totalViews}</p>
                <p className="text-stone-500 text-sm">{t("total_views")}</p>
              </motion.div>

              {/* Unique Visitors */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                  <MousePointerClick className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-stone-900">{viewStats.responses}</p>
                <p className="text-stone-500 text-sm">{t("unique_visitors")}</p>
              </motion.div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
              {/* Recent Guests */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-champagne-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-champagne-700" />
                    </div>
                    <span className="font-medium text-stone-800">{t("recent_responses")}</span>
                  </div>
                  <span className="text-xs text-olive-600 font-medium cursor-pointer hover:underline">
                    {t("view_all")} →
                  </span>
                </div>

                <div className="space-y-3">
                  {recentGuests.map((guest, index) => (
                    <motion.div
                      key={guest.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-stone-600 text-xs font-medium">
                          {guest.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-800">{guest.name}</p>
                          <p className="text-xs text-stone-400">{guest.time}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          guest.status === "ja"
                            ? "bg-emerald-100 text-emerald-700"
                            : guest.status === "nee"
                            ? "bg-stone-100 text-stone-600"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {guest.status === "ja" ? t("attending") : guest.status === "nee" ? t("not_attending") : t("maybe")}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="bg-gradient-to-br from-olive-50 to-champagne-50 rounded-xl border border-olive-100 p-4 md:p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-olive-100 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-olive-600" />
                  </div>
                  <span className="font-medium text-stone-800">{t("quick_actions")}</span>
                </div>

                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center gap-3 p-3 bg-white/80 hover:bg-white rounded-lg text-sm text-stone-700 hover:text-olive-700 transition-colors border border-transparent hover:border-olive-200"
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom fade indicator */}
        <div className="mt-8 text-center">
          <p className="text-stone-500 text-sm">
            {t("more_features")}
          </p>
        </div>
      </div>
    </section>
  );
}
