"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type SealFontId } from "@/lib/wax-fonts";
import { getTemplateById, templates } from "@/lib/templates";
import { Envelope2D } from "@/components/envelope-2d";
import {
  HeroSection,
  CountdownSection,
  LocationSection,
  TimelineSection,
  FAQSection,
  GiftSection,
  RSVPSection,
  DresscodeSection,
  FloatingMusicToggle,
  useMusicControl,
} from "@/components/invitation-sections";
import { BloementuinSectionAccent } from "@/components/bloementuin-floral-bg";
import { LaDolceVitaSectionAccent } from "@/components/ladolcevita-citrus-bg";

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

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface GiftConfig {
  enabled: boolean;
  message: string;
  preferMoney: boolean;
  registryUrl?: string;
  iban?: string;
  accountHolder?: string;
}

interface Invitation {
  id: string;
  shareId: string;
  templateId: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: Date;
  weddingTime?: string | null;
  headline?: string | null;
  dresscode?: string | null;
  giftConfig?: GiftConfig | null;
  locations: Location[];
  timeline: TimelineItem[];
  faqItems?: FAQItem[] | null;
  sealColor: string;
  sealFont?: string;
  monogram?: string | null;
  fontPairing: string;
  rsvpEnabled: boolean;
  rsvpDeadline?: Date | null;
  rsvpConfig?: unknown;
  // Envelope settings
  envelopeEnabled?: boolean;
  envelopeColor?: string | null;
  envelopeLiner?: string | null;
  envelopePersonalizedText?: string | null;
  // Music settings
  musicEnabled?: boolean;
  musicUrl?: string | null;
}

interface Props {
  invitation: Invitation;
}

export function PublicInvitation({ invitation }: Props) {
  const [isOpened, setIsOpened] = useState(false);

  // Get template configuration
  const template = getTemplateById(invitation.templateId) || templates[0];

  // Music control
  const { play: startMusic } = useMusicControl(invitation.musicUrl || undefined);

  // Check if envelope is enabled (default to true)
  const showEnvelope = invitation.envelopeEnabled ?? true;

  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);

  const handleMusicStart = useCallback(() => {
    if (invitation.musicEnabled && invitation.musicUrl) {
      startMusic();
    }
  }, [invitation.musicEnabled, invitation.musicUrl, startMusic]);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!isOpened && showEnvelope ? (
          // 2D Envelope state
          <motion.div
            key="envelope"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <Envelope2D
              sealColor={invitation.sealColor}
              sealFont={invitation.sealFont as SealFontId | undefined}
              monogram={
                invitation.monogram ||
                `${invitation.partner1Name.charAt(0)}&${invitation.partner2Name.charAt(0)}`
              }
              sealText={invitation.envelopePersonalizedText ?? undefined}
              onOpen={handleOpen}
              onMusicStart={handleMusicStart}
              enableMusic={invitation.musicEnabled && !!invitation.musicUrl}
            />
          </motion.div>
        ) : !isOpened && !showEnvelope ? (
          // Direct open - skip envelope
          <motion.div
            key="direct"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onAnimationComplete={handleOpen}
          />
        ) : (
          // Opened state - show full invitation
          <motion.div
            key="opened"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <InvitationContent invitation={invitation} template={template} />

            {/* Floating music toggle */}
            {invitation.musicEnabled && invitation.musicUrl && (
              <FloatingMusicToggle
                audioSrc={invitation.musicUrl}
                autoPlay={false} // User triggered from envelope
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main invitation content component
function InvitationContent({
  invitation,
  template,
}: {
  invitation: Invitation;
  template: ReturnType<typeof getTemplateById>;
}) {
  if (!template) return null;

  const weddingDate = new Date(invitation.weddingDate);

  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        partner1Name={invitation.partner1Name}
        partner2Name={invitation.partner2Name}
        headline={invitation.headline}
        weddingDate={weddingDate}
        weddingTime={invitation.weddingTime}
        sealColor={invitation.sealColor}
        sealFont={invitation.sealFont as SealFontId | undefined}
        monogram={invitation.monogram}
        template={template}
      />

      {/* Countdown Section */}
      <CountdownSection weddingDate={weddingDate} template={template} />

      {/* Location Section */}
      {invitation.locations.length > 0 && (
        <div className="relative">
          <LocationSection locations={invitation.locations} template={template} />
          {template.style === "botanical" && (
            <BloementuinSectionAccent position="bottom" />
          )}
          {template.style === "mediterranean" && (
            <LaDolceVitaSectionAccent position="bottom" />
          )}
        </div>
      )}

      {/* Timeline Section */}
      {invitation.timeline.length > 0 && (
        <TimelineSection timeline={invitation.timeline} template={template} />
      )}

      {/* Dresscode Section */}
      {invitation.dresscode && (
        <DresscodeSection dresscode={invitation.dresscode} template={template} />
      )}

      {/* FAQ Section */}
      {invitation.faqItems && invitation.faqItems.length > 0 && (
        <FAQSection items={invitation.faqItems} template={template} />
      )}

      {/* Gift Section */}
      {invitation.giftConfig?.enabled && (
        <GiftSection config={invitation.giftConfig} template={template} />
      )}

      {/* RSVP Section */}
      <RSVPSection
        invitationId={invitation.id}
        enabled={invitation.rsvpEnabled}
        deadline={invitation.rsvpDeadline}
        template={template}
      />

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ background: template.colors.background }}>
        <p className="text-sm" style={{ color: template.colors.textMuted }}>
          Gemaakt met{" "}
          <a
            href="https://javooraltijd.nl"
            className="hover:underline"
            style={{ color: template.colors.primary }}
          >
            Ja, Voor Altijd
          </a>
        </p>
      </footer>
    </main>
  );
}
