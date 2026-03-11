import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicInvitation } from "./public-invitation";
import type { SealColor } from "@/components/wax-seal/wax-seal";

interface GuestGroup {
  id: string;
  name: string;
  includedEvents: string[];
}

interface Props {
  params: { shareId: string };
  searchParams: { group?: string };
}

export default async function PublicInvitationPage({ params, searchParams }: Props) {
  const invitation = await db.invitation.findUnique({
    where: { shareId: params.shareId },
    include: {
      locations: { orderBy: { order: "asc" } },
      timeline: { orderBy: { order: "asc" } },
    },
  });

  if (!invitation) {
    notFound();
  }

  // Check if invitation is published/paid
  if (invitation.status !== "PAID" && invitation.status !== "PUBLISHED") {
    notFound();
  }

  // Check if expired
  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-champagne-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-stone-800 mb-2">
            Deze uitnodiging is verlopen
          </h1>
          <p className="text-stone-600">
            Neem contact op met het bruidspaar voor meer informatie.
          </p>
        </div>
      </div>
    );
  }

  // Per-group filtering
  let filteredLocations = invitation.locations;
  let filteredTimeline = invitation.timeline;

  if (searchParams.group && invitation.guestGroups) {
    const groups = invitation.guestGroups as unknown as GuestGroup[];
    const group = groups.find((g) => g.id === searchParams.group);
    if (group && group.includedEvents.length > 0) {
      filteredLocations = invitation.locations.filter(
        (loc) => group.includedEvents.includes(`loc-${loc.id}`)
      );
      filteredTimeline = invitation.timeline.filter(
        (item) => group.includedEvents.includes(`timeline-${item.id}`)
      );
      // If filtering resulted in empty, show all (fallback)
      if (filteredLocations.length === 0 && filteredTimeline.length === 0) {
        filteredLocations = invitation.locations;
        filteredTimeline = invitation.timeline;
      }
    }
  }

  return (
    <PublicInvitation
      invitation={{
        ...invitation,
        locations: filteredLocations,
        timeline: filteredTimeline,
        sealColor: invitation.sealColor as SealColor,
        sealFont: invitation.sealFont,
        giftConfig: invitation.giftConfig as { enabled: boolean; message: string; registryUrl?: string; iban?: string; accountHolder?: string } | null,
        faqItems: invitation.faqItems as { id: string; question: string; answer: string }[] | null,
        envelopeEnabled: invitation.envelopeEnabled,
        envelopeColor: invitation.envelopeColor,
        envelopeLiner: invitation.envelopeLiner,
        envelopePersonalizedText: invitation.envelopePersonalizedText,
        musicEnabled: invitation.musicEnabled,
        musicUrl: invitation.musicUrl,
      }}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const invitation = await db.invitation.findUnique({
    where: { shareId: params.shareId },
    select: {
      partner1Name: true,
      partner2Name: true,
      weddingDate: true,
    },
  });

  if (!invitation) {
    return { title: "Uitnodiging niet gevonden" };
  }

  const date = invitation.weddingDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    title: `${invitation.partner1Name} & ${invitation.partner2Name} - Trouwuitnodiging`,
    description: `Jullie zijn uitgenodigd voor de bruiloft van ${invitation.partner1Name} & ${invitation.partner2Name} op ${date}`,
    openGraph: {
      title: `${invitation.partner1Name} & ${invitation.partner2Name}`,
      description: `Trouwuitnodiging - ${date}`,
    },
  };
}
