"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, MessageCircle, Mail, UsersRound } from "lucide-react";

interface GuestGroup {
  id: string;
  name: string;
  includedEvents: string[];
}

interface Props {
  shareUrl: string;
  groups: GuestGroup[];
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
}

export function GroupShareLinks({ shareUrl, groups, partner1Name, partner2Name, weddingDate }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (groups.length === 0) return null;

  const formattedDate = new Date(weddingDate).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleCopy = async (groupId: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(groupId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsApp = (groupUrl: string, groupName: string) => {
    const message = `Lieve ${groupName}! 💒\n\nWij gaan trouwen! 💍\n\n${partner1Name} & ${partner2Name} nodigen jullie van harte uit voor onze bruiloft op ${formattedDate}.\n\nBekijk jullie persoonlijke uitnodiging:\n${groupUrl}\n\nWe hopen jullie te zien! 🥂`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleEmail = (groupUrl: string, groupName: string) => {
    const subject = encodeURIComponent(`Uitnodiging bruiloft ${partner1Name} & ${partner2Name}`);
    const body = encodeURIComponent(`Lieve ${groupName},\n\nWij gaan trouwen!\n\n${partner1Name} & ${partner2Name} nodigen jullie van harte uit voor onze bruiloft op ${formattedDate}.\n\nBekijk jullie persoonlijke uitnodiging:\n${groupUrl}\n\nLiefs,\n${partner1Name} & ${partner2Name}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <UsersRound className="w-4 h-4 text-purple-600" />
        </div>
        <span className="font-medium text-stone-800">Links per groep</span>
      </div>
      <p className="text-sm text-stone-500 mb-4">
        Elke groep ziet alleen de onderdelen die voor hen relevant zijn.
      </p>

      <div className="space-y-3">
        {groups.map((group) => {
          const groupUrl = `${shareUrl}?group=${group.id}`;
          const isCopied = copiedId === group.id;

          return (
            <div
              key={group.id}
              className="p-3 bg-stone-50 rounded-lg border border-stone-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-700">{group.name}</span>
                <span className="text-xs text-stone-400">
                  {group.includedEvents.length} onderdelen
                </span>
              </div>
              <code className="block text-xs bg-white px-2 py-1.5 rounded border border-stone-200 truncate text-stone-600 mb-2">
                {groupUrl}
              </code>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleCopy(group.id, groupUrl)}
                >
                  {isCopied ? (
                    <><Check className="w-3 h-3 mr-1" /> Gekopieerd</>
                  ) : (
                    <><Copy className="w-3 h-3 mr-1" /> Kopieer</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleWhatsApp(groupUrl, group.name)}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleEmail(groupUrl, group.name)}
                >
                  <Mail className="w-3 h-3 mr-1" />
                  E-mail
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
