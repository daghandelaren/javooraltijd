import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicSaveTheDate } from "./public-save-the-date";

interface Props {
  params: { shareId: string };
}

export default async function PublicSaveTheDatePage({ params }: Props) {
  const saveTheDate = await db.saveTheDate.findUnique({
    where: { shareId: params.shareId },
  });

  if (!saveTheDate) {
    notFound();
  }

  if (saveTheDate.status !== "PUBLISHED") {
    notFound();
  }

  if (saveTheDate.expiresAt && saveTheDate.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-champagne-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-stone-800 mb-2">
            Deze Save the Date is verlopen
          </h1>
          <p className="text-stone-600">
            Neem contact op met het bruidspaar voor meer informatie.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PublicSaveTheDate
      saveTheDate={{
        id: saveTheDate.id,
        templateId: saveTheDate.templateId,
        partner1Name: saveTheDate.partner1Name,
        partner2Name: saveTheDate.partner2Name,
        weddingDate: saveTheDate.weddingDate.toISOString(),
        headline: saveTheDate.headline,
        sealColor: saveTheDate.sealColor,
        sealFont: saveTheDate.sealFont,
        monogram: saveTheDate.monogram,
        envelopeEnabled: saveTheDate.envelopeEnabled,
        envelopeColor: saveTheDate.envelopeColor,
        envelopeLiner: saveTheDate.envelopeLiner,
        envelopePersonalizedText: saveTheDate.envelopePersonalizedText,
        musicEnabled: saveTheDate.musicEnabled,
        musicUrl: saveTheDate.musicUrl,
      }}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const saveTheDate = await db.saveTheDate.findUnique({
    where: { shareId: params.shareId },
    select: {
      partner1Name: true,
      partner2Name: true,
      weddingDate: true,
    },
  });

  if (!saveTheDate) {
    return { title: "Save the Date niet gevonden" };
  }

  const date = saveTheDate.weddingDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    title: `${saveTheDate.partner1Name} & ${saveTheDate.partner2Name} - Save the Date`,
    description: `Save the Date voor de bruiloft van ${saveTheDate.partner1Name} & ${saveTheDate.partner2Name} op ${date}`,
    openGraph: {
      title: `${saveTheDate.partner1Name} & ${saveTheDate.partner2Name} - Save the Date`,
      description: `${date}`,
    },
  };
}
