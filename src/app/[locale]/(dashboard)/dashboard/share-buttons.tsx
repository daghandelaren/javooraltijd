"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, MessageCircle, Share2, Mail } from "lucide-react";

interface Props {
  url: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
}

export function ShareButtons({ url, partner1Name, partner2Name, weddingDate }: Props) {
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const formattedDate = new Date(weddingDate).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Pre-formatted messages for different platforms
  const messages = {
    whatsapp: `Lieve vrienden en familie! 💒\n\nWij gaan trouwen! 💍\n\n${partner1Name} & ${partner2Name} nodigen jullie van harte uit voor onze bruiloft op ${formattedDate}.\n\nBekijk onze uitnodiging en laat weten of je erbij kunt zijn:\n${url}\n\nWe hopen jullie te zien! 🥂`,
    email: `Lieve vrienden en familie,\n\nWij gaan trouwen!\n\n${partner1Name} & ${partner2Name} nodigen jullie van harte uit voor onze bruiloft op ${formattedDate}.\n\nBekijk onze uitnodiging en laat weten of je erbij kunt zijn:\n${url}\n\nWe hopen jullie te zien!\n\nLiefs,\n${partner1Name} & ${partner2Name}`,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Uitnodiging bruiloft ${partner1Name} & ${partner2Name}`);
    const body = encodeURIComponent(messages.email);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyMessage = async (message: string) => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quick share buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Gekopieerd
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Kopieer link
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>

        <Button variant="outline" size="sm" onClick={handleEmailShare}>
          <Mail className="w-4 h-4 mr-2" />
          E-mail
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTips(!showTips)}
          className="text-stone-500"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {showTips ? "Verberg tips" : "Deel tips"}
        </Button>
      </div>

      {/* Share tips expanded */}
      {showTips && (
        <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-stone-900">Tips voor het delen</h4>

          {/* WhatsApp message */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">WhatsApp bericht</span>
            </div>
            <div className="relative">
              <pre className="text-xs bg-stone-50 p-3 rounded-lg whitespace-pre-wrap text-stone-700 border border-stone-200">
                {messages.whatsapp}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => handleCopyMessage(messages.whatsapp)}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Email message */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Mail className="w-4 h-4 text-stone-600" />
              <span className="font-medium">E-mail tekst</span>
            </div>
            <div className="relative">
              <pre className="text-xs bg-stone-50 p-3 rounded-lg whitespace-pre-wrap text-stone-700 border border-stone-200">
                {messages.email}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => handleCopyMessage(messages.email)}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="text-sm text-stone-500 space-y-1 pt-2 border-t border-stone-200">
            <p>💡 <strong>Tip:</strong> Stuur persoonlijke berichten voor een hogere respons</p>
            <p>💡 <strong>Tip:</strong> Plan een herinnering 2 weken voor de RSVP deadline</p>
          </div>
        </div>
      )}
    </div>
  );
}
