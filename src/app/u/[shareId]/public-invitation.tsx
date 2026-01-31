"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Calendar, Heart, MessageCircle, Shirt, Gift, CalendarPlus, Download } from "lucide-react";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { ProgramIcon } from "@/components/builder/icon-picker";
import { type SealFontId } from "@/lib/wax-fonts";
import { Button } from "@/components/ui/button";
import { RSVPForm } from "./rsvp-form";

interface Location {
  id: string;
  name: string;
  address: string;
  time: string;
  type: string;
  notes?: string | null;
  mapsUrl?: string | null;
}

interface TimelineItem {
  id: string;
  title: string;
  time: string;
  description?: string | null;
  icon?: string | null;
}

interface GiftConfig {
  enabled: boolean;
  message: string;
  preferMoney: boolean;
  registryUrl?: string;
}

interface Invitation {
  id: string;
  shareId: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: Date;
  weddingTime?: string | null;
  headline?: string | null;
  dresscode?: string | null;
  giftConfig?: GiftConfig | null;
  locations: Location[];
  timeline: TimelineItem[];
  sealColor: string; // Hex color
  sealFont?: string; // Font ID
  monogram?: string | null;
  fontPairing: string;
  rsvpEnabled: boolean;
  rsvpDeadline?: Date | null;
  rsvpConfig?: unknown;
}

interface Props {
  invitation: Invitation;
}

// Helper to generate Google Calendar URL
function generateGoogleCalendarUrl(invitation: Invitation): string {
  const date = new Date(invitation.weddingDate);
  const startDate = date.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 8);

  // If we have a time, use it; otherwise, make it an all-day event
  let dates: string;
  if (invitation.weddingTime) {
    const [hours, minutes] = invitation.weddingTime.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 6); // Assume 6 hour event

    const formatDateTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15) + "Z";
    dates = `${formatDateTime(startDateTime)}/${formatDateTime(endDateTime)}`;
  } else {
    // All-day event
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    dates = `${startDate}/${nextDay.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 8)}`;
  }

  const title = `Bruiloft ${invitation.partner1Name} & ${invitation.partner2Name}`;
  const location = invitation.locations[0]?.address || "";
  const details = invitation.headline || `Wij gaan trouwen! ${invitation.partner1Name} & ${invitation.partner2Name}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Helper to generate .ics file content
function generateICSContent(invitation: Invitation): string {
  const date = new Date(invitation.weddingDate);
  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 8);

  let dtstart: string;
  let dtend: string;

  if (invitation.weddingTime) {
    const [hours, minutes] = invitation.weddingTime.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 6);

    const formatDateTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15) + "Z";
    dtstart = `DTSTART:${formatDateTime(startDateTime)}`;
    dtend = `DTEND:${formatDateTime(endDateTime)}`;
  } else {
    dtstart = `DTSTART;VALUE=DATE:${formatDate(date)}`;
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    dtend = `DTEND;VALUE=DATE:${formatDate(nextDay)}`;
  }

  const title = `Bruiloft ${invitation.partner1Name} & ${invitation.partner2Name}`;
  const location = invitation.locations[0]?.address || "";
  const description = invitation.headline || "";

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//JaVoorAltijd//Wedding//NL
BEGIN:VEVENT
UID:${invitation.id}@javooraltijd.nl
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15)}Z
${dtstart}
${dtend}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
}

// Helper to download .ics file
function downloadICS(invitation: Invitation) {
  const content = generateICSContent(invitation);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bruiloft-${invitation.partner1Name.toLowerCase()}-${invitation.partner2Name.toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function PublicInvitation({ invitation }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const formattedDate = new Date(invitation.weddingDate).toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSealClick = () => {
    setIsOpened(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 to-champagne-100">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          // Sealed state - show wax seal to click
          <motion.div
            key="sealed"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-stone-600 mb-8 text-center"
            >
              Klik op de zegel om de uitnodiging te openen
            </motion.p>

            <motion.button
              onClick={handleSealClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer focus:outline-none"
            >
              <WaxSeal
                size="xl"
                color={invitation.sealColor}
                font={invitation.sealFont as SealFontId | undefined}
                initials={invitation.monogram || undefined}
              />
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-sm text-stone-500"
            >
              Van {invitation.partner1Name} & {invitation.partner2Name}
            </motion.p>
          </motion.div>
        ) : (
          // Opened state - show full invitation
          <motion.div
            key="opened"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="py-12 px-4"
          >
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-12"
              >
                <div className="flex justify-center mb-6">
                  <WaxSeal
                    size="lg"
                    color={invitation.sealColor}
                    font={invitation.sealFont as SealFontId | undefined}
                    initials={invitation.monogram || undefined}
                    interactive={false}
                  />
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-stone-800 mb-4">
                  {invitation.partner1Name}
                  <span className="block text-2xl font-normal text-stone-500 my-2">&</span>
                  {invitation.partner2Name}
                </h1>

                {invitation.headline && (
                  <p className="text-lg text-stone-600 italic">
                    {invitation.headline}
                  </p>
                )}
              </motion.header>

              {/* Date & Time */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg mb-8"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-burgundy-700 mb-4">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium uppercase tracking-wide text-sm">
                      Save the Date
                    </span>
                  </div>
                  <p className="font-heading text-2xl text-stone-800 mb-2">
                    {formattedDate}
                  </p>
                  {invitation.weddingTime && (
                    <p className="text-stone-600 flex items-center justify-center gap-2 mb-4">
                      <Clock className="w-4 h-4" />
                      {invitation.weddingTime}
                    </p>
                  )}

                  {/* Add to Calendar Button */}
                  <div className="relative mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                      className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
                    >
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Toevoegen aan agenda
                    </Button>

                    <AnimatePresence>
                      {showCalendarMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-10 min-w-[200px]"
                        >
                          <a
                            href={generateGoogleCalendarUrl(invitation)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 text-stone-700 text-sm"
                            onClick={() => setShowCalendarMenu(false)}
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.5 4H18V3a1 1 0 0 0-2 0v1H8V3a1 1 0 0 0-2 0v1H4.5C3.12 4 2 5.12 2 6.5v13C2 20.88 3.12 22 4.5 22h15c1.38 0 2.5-1.12 2.5-2.5v-13C22 5.12 20.88 4 19.5 4zM20 19.5c0 .28-.22.5-.5.5h-15a.5.5 0 0 1-.5-.5V9h16v10.5zM20 7H4V6.5c0-.28.22-.5.5-.5H6v1a1 1 0 0 0 2 0V6h8v1a1 1 0 0 0 2 0V6h1.5c.28 0 .5.22.5.5V7z"/>
                            </svg>
                            Google Calendar
                          </a>
                          <button
                            onClick={() => {
                              downloadICS(invitation);
                              setShowCalendarMenu(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 text-stone-700 text-sm w-full text-left"
                          >
                            <Download className="w-5 h-5" />
                            Download .ics bestand
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.section>

              {/* Locations */}
              {invitation.locations.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg mb-8"
                >
                  <h2 className="font-heading text-xl text-stone-800 mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-burgundy-700" />
                    Locaties
                  </h2>
                  <div className="space-y-6">
                    {invitation.locations.map((location) => (
                      <div key={location.id} className="border-l-2 border-burgundy-200 pl-4">
                        <p className="text-sm text-burgundy-700 font-medium uppercase tracking-wide mb-1">
                          {location.type === "ceremony" && "Ceremonie"}
                          {location.type === "reception" && "Receptie"}
                          {location.type === "dinner" && "Diner"}
                          {location.type === "party" && "Feest"}
                          {location.type === "other" && "Overig"}
                          {" • "}{location.time}
                        </p>
                        <p className="font-heading text-lg text-stone-800">
                          {location.name}
                        </p>
                        <p className="text-stone-600 text-sm">
                          {location.address}
                        </p>
                        {location.notes && (
                          <p className="text-stone-500 text-sm mt-1 italic">
                            {location.notes}
                          </p>
                        )}
                        {location.mapsUrl && (
                          <a
                            href={location.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-burgundy-600 text-sm hover:underline mt-2 inline-block"
                          >
                            Bekijk op kaart →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Timeline */}
              {invitation.timeline.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl p-8 shadow-lg mb-8"
                >
                  <h2 className="font-heading text-xl text-stone-800 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-burgundy-700" />
                    Programma
                  </h2>
                  <div className="space-y-4">
                    {invitation.timeline.map((item) => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burgundy-50 to-champagne-50 border border-burgundy-100 flex items-center justify-center flex-shrink-0">
                          <ProgramIcon
                            iconId={item.icon || "map-pin"}
                            size="lg"
                            className="text-burgundy-600"
                          />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-semibold text-burgundy-600 mb-0.5">
                            {item.time}
                          </p>
                          <p className="font-heading text-lg font-medium text-stone-800">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-sm text-stone-600 mt-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Dresscode Section */}
              {invitation.dresscode && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="bg-white rounded-2xl p-8 shadow-lg mb-8"
                >
                  <h2 className="font-heading text-xl text-stone-800 mb-4 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-burgundy-700" />
                    Dresscode
                  </h2>
                  <p className="text-stone-700 text-lg">
                    {invitation.dresscode}
                  </p>
                </motion.section>
              )}

              {/* Gift/Cadeau Section */}
              {invitation.giftConfig?.enabled && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.78 }}
                  className="bg-gradient-to-br from-champagne-50 to-champagne-100 rounded-2xl p-8 shadow-lg mb-8 border border-champagne-200"
                >
                  <h2 className="font-heading text-xl text-stone-800 mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-burgundy-700" />
                    Cadeau
                  </h2>
                  {invitation.giftConfig.message && (
                    <p className="text-stone-700 mb-4">
                      {invitation.giftConfig.message}
                    </p>
                  )}
                  {invitation.giftConfig.preferMoney && (
                    <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg">
                      <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                        <Gift className="w-5 h-5 text-burgundy-600" />
                      </div>
                      <p className="text-stone-600 text-sm">
                        Een envelop met een bijdrage wordt zeer gewaardeerd
                      </p>
                    </div>
                  )}
                  {invitation.giftConfig.registryUrl && (
                    <a
                      href={invitation.giftConfig.registryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-burgundy-600 hover:text-burgundy-700 font-medium"
                    >
                      Bekijk onze verlanglijst →
                    </a>
                  )}
                </motion.section>
              )}

              {/* RSVP Section */}
              {invitation.rsvpEnabled && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-burgundy-700 text-white rounded-2xl p-8 shadow-lg"
                >
                  {!showRSVP ? (
                    <div className="text-center">
                      <Heart className="w-8 h-8 mx-auto mb-4 text-burgundy-200" />
                      <h2 className="font-heading text-2xl mb-4">
                        Komen jullie ook?
                      </h2>
                      <p className="text-burgundy-200 mb-6">
                        Laat ons weten of je erbij bent
                      </p>
                      {invitation.rsvpDeadline && (
                        <p className="text-sm text-burgundy-300 mb-6">
                          Reageer voor{" "}
                          {new Date(invitation.rsvpDeadline).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      <Button
                        onClick={() => setShowRSVP(true)}
                        className="bg-white text-burgundy-700 hover:bg-champagne-100"
                        size="lg"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        RSVP
                      </Button>
                    </div>
                  ) : (
                    <RSVPForm
                      invitationId={invitation.id}
                      onClose={() => setShowRSVP(false)}
                    />
                  )}
                </motion.section>
              )}

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center mt-12 text-stone-500 text-sm"
              >
                <p>
                  Gemaakt met{" "}
                  <a
                    href="https://javooraltijd.nl"
                    className="text-burgundy-600 hover:underline"
                  >
                    Ja, Voor Altijd
                  </a>
                </p>
              </motion.footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
