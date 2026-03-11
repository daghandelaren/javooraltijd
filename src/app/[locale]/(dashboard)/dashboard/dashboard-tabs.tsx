"use client";

import { useState, type ReactNode } from "react";

interface Props {
  invitationContent: ReactNode;
  stdContent: ReactNode;
}

export function DashboardTabs({ invitationContent, stdContent }: Props) {
  const [activeTab, setActiveTab] = useState<"invitation" | "std">("invitation");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab("invitation")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "invitation"
              ? "border-olive-600 text-olive-700"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          Uitnodiging
        </button>
        <button
          onClick={() => setActiveTab("std")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "std"
              ? "border-olive-600 text-olive-700"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          Save the Date
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "invitation" ? invitationContent : stdContent}
      </div>
    </div>
  );
}
