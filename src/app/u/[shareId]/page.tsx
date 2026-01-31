import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicInvitation } from "./public-invitation";
import type { SealColor } from "@/components/wax-seal/wax-seal";

interface Props {
  params: { shareId: string };
}

export default async function PublicInvitationPage({ params }: Props) {
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

  return (
    <PublicInvitation
      invitation={{
        ...invitation,
        sealColor: invitation.sealColor as SealColor,
        giftConfig: invitation.giftConfig as { enabled: boolean; message: string; preferMoney: boolean; registryUrl?: string } | null,
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
