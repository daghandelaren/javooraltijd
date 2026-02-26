import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ExternalLink, Users, Calendar, Settings, Share2, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { DEFAULT_SEAL_COLOR } from "@/lib/wax-colors";
import { type SealFontId } from "@/lib/wax-fonts";
import { ShareButtons } from "./share-buttons";
import { PaymentSuccessBanner } from "./payment-success-banner";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const invitations = await db.invitation.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { rsvps: true },
      },
      rsvps: {
        select: {
          attending: true,
          guestCount: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-stone-100 text-stone-600">
            Concept
          </span>
        );
      case "PAID":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            Betaald
          </span>
        );
      case "PUBLISHED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Gepubliceerd
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
            Verlopen
          </span>
        );
      default:
        return null;
    }
  };

  const getRSVPStats = (rsvps: { attending: string; guestCount: number }[]) => {
    const attending = rsvps.filter((r) => r.attending === "YES");
    const notAttending = rsvps.filter((r) => r.attending === "NO");
    const maybe = rsvps.filter((r) => r.attending === "MAYBE");
    const totalGuests = attending.reduce((sum, r) => sum + r.guestCount, 0);

    return { attending: attending.length, notAttending: notAttending.length, maybe: maybe.length, totalGuests };
  };

  return (
    <div className="space-y-8">
      {/* Payment Success Banner */}
      <Suspense fallback={null}>
        <PaymentSuccessBanner />
      </Suspense>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-stone-900">
            Dashboard
          </h1>
          <p className="text-stone-600 mt-1">
            Beheer jullie trouwuitnodigingen
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/settings">
              <Settings className="w-4 h-4 mr-2" />
              Instellingen
            </Link>
          </Button>
          <Button asChild>
            <Link href="/builder/package">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe uitnodiging
            </Link>
          </Button>
        </div>
      </div>

      {/* Invitations list */}
      {invitations.length === 0 ? (
        <Card className="overflow-hidden">
          <CardContent className="py-16 text-center relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-champagne-50 via-white to-olive-50/30 opacity-50" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-olive-100/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-champagne-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex justify-center mb-6">
                <WaxSeal size="lg" color={DEFAULT_SEAL_COLOR} />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-stone-800 mb-3">
                Welkom bij jullie dashboard
              </h2>
              <p className="text-stone-600 mb-2 max-w-md mx-auto">
                Hier kunnen jullie straks de uitnodiging beheren, RSVP&apos;s bijhouden en de deellink vinden.
              </p>
              <p className="text-stone-500 text-sm mb-8">
                Begin met het ontwerpen van jullie digitale trouwuitnodiging.
              </p>
              <Button asChild size="lg" className="bg-olive-600 hover:bg-olive-700">
                <Link href="/builder/package">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Maak jullie uitnodiging
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {invitations.map((invitation) => {
            const stats = getRSVPStats(invitation.rsvps);
            const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/u/${invitation.shareId}`;
            const canShare = invitation.status === "PAID" || invitation.status === "PUBLISHED";

            return (
              <Card key={invitation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <WaxSeal
                        size="md"
                        color={invitation.sealColor}
                        font={invitation.sealFont as SealFontId | undefined}
                        initials={invitation.monogram || undefined}
                      />
                      <div>
                        <CardTitle className="font-heading text-xl">
                          {invitation.partner1Name} & {invitation.partner2Name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(invitation.weddingDate).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(invitation.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Draft invitation guidance */}
                  {invitation.status === "DRAFT" && (
                    <div className="mb-6 p-5 bg-gradient-to-r from-olive-50 via-champagne-50 to-olive-50 rounded-xl border border-olive-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-olive-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-olive-800 mb-1">
                            Bijna klaar!
                          </h3>
                          <p className="text-sm text-olive-700 mb-4">
                            Jullie uitnodiging is opgeslagen als concept. Rond de betaling af om de uitnodiging te activeren en te delen met jullie gasten.
                          </p>
                          <Button asChild className="bg-olive-600 hover:bg-olive-700">
                            <Link href={`/builder/checkout?edit=${invitation.id}`}>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Doorgaan naar betaling
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RSVP Stats - only show for paid/published */}
                  {canShare && (
                    <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-stone-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-green-600">
                          {stats.attending}
                        </p>
                        <p className="text-xs text-stone-500">Komt</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-red-600">
                          {stats.notAttending}
                        </p>
                        <p className="text-xs text-stone-500">Komt niet</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-amber-600">
                          {stats.maybe}
                        </p>
                        <p className="text-xs text-stone-500">Misschien</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-stone-800">
                          {stats.totalGuests}
                        </p>
                        <p className="text-xs text-stone-500">Gasten</p>
                      </div>
                    </div>
                  )}

                  {/* Share URL */}
                  {canShare && (
                    <div className="mb-6 p-4 bg-champagne-50 rounded-lg border border-champagne-200">
                      <p className="text-sm text-stone-600 mb-3 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Deel deze link met jullie gasten:
                      </p>
                      <div className="mb-3">
                        <code className="block text-sm bg-white px-3 py-2 rounded border border-champagne-300 truncate">
                          {shareUrl}
                        </code>
                      </div>
                      <ShareButtons
                        url={shareUrl}
                        partner1Name={invitation.partner1Name}
                        partner2Name={invitation.partner2Name}
                        weddingDate={invitation.weddingDate.toISOString()}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {canShare && (
                      <>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/u/${invitation.shareId}`} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Bekijk uitnodiging
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/${invitation.id}/rsvp`}>
                            <Users className="w-4 h-4 mr-2" />
                            RSVP overzicht
                          </Link>
                        </Button>
                      </>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/builder/template?edit=${invitation.id}`}>
                        <Settings className="w-4 h-4 mr-2" />
                        {invitation.status === "DRAFT" ? "Concept bewerken" : "Bewerken"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
