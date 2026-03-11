import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ExternalLink, Calendar, Settings, Share2, PenLine, BarChart3, Eye, MousePointerClick, CalendarHeart, Sparkles } from "lucide-react";
import { WaxSeal } from "@/components/wax-seal/wax-seal";
import { DEFAULT_SEAL_COLOR } from "@/lib/wax-colors";
import { ShareButtons } from "./share-buttons";
import { PaymentSuccessBanner } from "./payment-success-banner";
import { RsvpProgressBar } from "./rsvp-progress-bar";
import { ExpiryCountdown } from "./expiry-countdown";
import { RecentResponses } from "./recent-responses";
import { GroupShareLinks } from "./group-share-links";
import { DashboardTabs } from "./dashboard-tabs";

interface GuestGroup {
  id: string;
  name: string;
  includedEvents: string[];
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [invitations, saveTheDates] = await Promise.all([
    db.invitation.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { rsvps: true },
        },
        rsvps: {
          select: {
            id: true,
            name: true,
            attending: true,
            guestCount: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    db.saveTheDate.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  // Filter to only paid/published items for the redesigned dashboard
  const activeInvitations = invitations.filter(
    (inv) => inv.status === "PAID" || inv.status === "PUBLISHED"
  );
  const activeStds = saveTheDates.filter(
    (std) => std.status === "PUBLISHED"
  );

  const hasInvitations = activeInvitations.length > 0;
  const hasStds = activeStds.length > 0;
  const hasBoth = hasInvitations && hasStds;
  const hasNothing = !hasInvitations && !hasStds;

  return (
    <div className="space-y-8">
      {/* Payment Success Banner */}
      <Suspense fallback={null}>
        <PaymentSuccessBanner />
      </Suspense>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-stone-900">
            Dashboard
          </h1>
          <p className="text-stone-600 mt-1">
            Beheer jullie trouwuitnodigingen
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/settings">
              <Settings className="w-4 h-4 mr-2" />
              Instellingen
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/std-builder/template">
              <CalendarHeart className="w-4 h-4 mr-2" />
              Save the Date
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/builder/package">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe uitnodiging
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {hasNothing && (
        <Card className="overflow-hidden">
          <CardContent className="py-16 text-center relative">
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
      )}

      {/* Dashboard content with tabs if both products exist */}
      {!hasNothing && (
        <>
          {hasBoth ? (
            <DashboardTabs
              invitationContent={
                <>
                  {activeInvitations.map((invitation) => (
                    <InvitationDashboard key={invitation.id} invitation={invitation} />
                  ))}
                </>
              }
              stdContent={
                <>
                  {activeStds.map((std) => (
                    <StdDashboard key={std.id} std={std} />
                  ))}
                </>
              }
            />
          ) : (
            <div className="space-y-8">
              {activeInvitations.map((invitation) => (
                <InvitationDashboard key={invitation.id} invitation={invitation} />
              ))}
              {activeStds.map((std) => (
                <StdDashboard key={std.id} std={std} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Invitation dashboard (matches homepage mockup)
function InvitationDashboard({
  invitation,
}: {
  invitation: {
    id: string;
    partner1Name: string;
    partner2Name: string;
    weddingDate: Date;
    shareId: string;
    expiresAt: Date | null;
    viewCount: number;
    guestGroups: unknown;
    rsvps: {
      id: string;
      name: string;
      attending: string;
      guestCount: number;
      createdAt: Date;
    }[];
  };
}) {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/u/${invitation.shareId}`;
  const groups = (invitation.guestGroups as GuestGroup[] | null) || [];

  const attending = invitation.rsvps.filter((r) => r.attending === "YES").length;
  const notAttending = invitation.rsvps.filter((r) => r.attending === "NO").length;
  const maybe = invitation.rsvps.filter((r) => r.attending === "MAYBE").length;
  const total = attending + notAttending + maybe;

  return (
    <div className="bg-gradient-to-br from-champagne-50 to-white rounded-xl border border-stone-200 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl md:text-2xl font-semibold text-stone-900">
            Welkom, {invitation.partner1Name} & {invitation.partner2Name}
          </h3>
          <p className="text-stone-500 text-sm mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(invitation.weddingDate).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Button asChild size="sm" className="bg-olive-600 hover:bg-olive-700">
          <Link href={`/builder/template?edit=${invitation.id}`}>
            <PenLine className="w-4 h-4 mr-2" />
            Bewerk uitnodiging
          </Link>
        </Button>
      </div>

      {/* Expiry countdown */}
      <ExpiryCountdown expiresAt={invitation.expiresAt?.toISOString() || null} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* RSVP Progress Bar (spans 2 cols) */}
        <RsvpProgressBar
          attending={attending}
          maybe={maybe}
          notAttending={notAttending}
          total={total}
        />

        {/* Views card */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-stone-900">{invitation.viewCount}</p>
          <p className="text-stone-500 text-sm">Weergaven</p>
        </div>

        {/* Responses card */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
            <MousePointerClick className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-stone-900">{invitation.rsvps.length}</p>
          <p className="text-stone-500 text-sm">Reacties</p>
        </div>
      </div>

      {/* Recent responses + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <RecentResponses
          rsvps={invitation.rsvps.map((r) => ({
            id: r.id,
            name: r.name,
            attending: r.attending,
            createdAt: r.createdAt.toISOString(),
          }))}
          invitationId={invitation.id}
        />

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-olive-50 to-champagne-50 rounded-xl border border-olive-100 p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-olive-100 flex items-center justify-center">
              <Settings className="w-4 h-4 text-olive-600" />
            </div>
            <span className="font-medium text-stone-800">Snelle acties</span>
          </div>
          <div className="space-y-2">
            <Link
              href={`/builder/template?edit=${invitation.id}`}
              className="w-full flex items-center gap-3 p-3 bg-white/80 hover:bg-white rounded-lg text-sm text-stone-700 hover:text-olive-700 transition-colors border border-transparent hover:border-olive-200"
            >
              <PenLine className="w-4 h-4" />
              Teksten bewerken
            </Link>
            <Link
              href={`/dashboard/${invitation.id}/rsvp`}
              className="w-full flex items-center gap-3 p-3 bg-white/80 hover:bg-white rounded-lg text-sm text-stone-700 hover:text-olive-700 transition-colors border border-transparent hover:border-olive-200"
            >
              <BarChart3 className="w-4 h-4" />
              Gasten exporteren
            </Link>
            <Link
              href={`/u/${invitation.shareId}`}
              target="_blank"
              className="w-full flex items-center gap-3 p-3 bg-white/80 hover:bg-white rounded-lg text-sm text-stone-700 hover:text-olive-700 transition-colors border border-transparent hover:border-olive-200"
            >
              <Eye className="w-4 h-4" />
              Bekijk preview
            </Link>
          </div>
        </div>
      </div>

      {/* Share section */}
      <div className="p-4 bg-champagne-50 rounded-lg border border-champagne-200">
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

      {/* Per-group share links */}
      {groups.length > 0 && (
        <GroupShareLinks
          shareUrl={shareUrl}
          groups={groups}
          partner1Name={invitation.partner1Name}
          partner2Name={invitation.partner2Name}
          weddingDate={invitation.weddingDate.toISOString()}
        />
      )}
    </div>
  );
}

// Save the Date dashboard (simpler)
function StdDashboard({
  std,
}: {
  std: {
    id: string;
    partner1Name: string;
    partner2Name: string;
    weddingDate: Date;
    shareId: string;
    expiresAt: Date | null;
    viewCount: number;
  };
}) {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/s/${std.shareId}`;

  return (
    <div className="bg-gradient-to-br from-champagne-50 to-white rounded-xl border border-stone-200 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl md:text-2xl font-semibold text-stone-900">
            {std.partner1Name} & {std.partner2Name}
            <span className="ml-2 text-xs font-normal bg-olive-100 text-olive-700 px-2 py-0.5 rounded-full align-middle">
              Save the Date
            </span>
          </h3>
          <p className="text-stone-500 text-sm mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(std.weddingDate).toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Button asChild size="sm" className="bg-olive-600 hover:bg-olive-700">
          <Link href={`/std-builder/template?edit=${std.id}`}>
            <PenLine className="w-4 h-4 mr-2" />
            Bewerken
          </Link>
        </Button>
      </div>

      {/* Expiry countdown */}
      <ExpiryCountdown expiresAt={std.expiresAt?.toISOString() || null} />

      {/* View stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-stone-900">{std.viewCount}</p>
          <p className="text-stone-500 text-sm">Unieke bezoekers</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 md:p-5 shadow-sm flex flex-col items-center justify-center">
          <Link
            href={`/s/${std.shareId}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-olive-600 hover:text-olive-700 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Bekijk kaart
          </Link>
        </div>
      </div>

      {/* Share section */}
      <div className="p-4 bg-champagne-50 rounded-lg border border-champagne-200">
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
          partner1Name={std.partner1Name}
          partner2Name={std.partner2Name}
          weddingDate={std.weddingDate.toISOString()}
        />
      </div>
    </div>
  );
}
