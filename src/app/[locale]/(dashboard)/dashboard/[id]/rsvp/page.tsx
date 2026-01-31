import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Users, Check, X, HelpCircle, Mail, UtensilsCrossed, MessageSquare } from "lucide-react";

export default async function RSVPOverviewPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const invitation = await db.invitation.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      rsvps: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  const stats = {
    total: invitation.rsvps.length,
    attending: invitation.rsvps.filter((r) => r.attending === "YES"),
    notAttending: invitation.rsvps.filter((r) => r.attending === "NO"),
    maybe: invitation.rsvps.filter((r) => r.attending === "MAYBE"),
    totalGuests: invitation.rsvps
      .filter((r) => r.attending === "YES")
      .reduce((sum, r) => sum + r.guestCount, 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "YES":
        return <Check className="w-4 h-4 text-green-600" />;
      case "NO":
        return <X className="w-4 h-4 text-red-600" />;
      case "MAYBE":
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "YES":
        return "Komt";
      case "NO":
        return "Komt niet";
      case "MAYBE":
        return "Misschien";
      default:
        return status;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "YES":
        return "bg-green-50";
      case "NO":
        return "bg-red-50";
      case "MAYBE":
        return "bg-amber-50";
      default:
        return "bg-stone-50";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug
            </Link>
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-semibold text-stone-900">
              RSVP Overzicht
            </h1>
            <p className="text-stone-600 mt-1">
              {invitation.partner1Name} & {invitation.partner2Name}
            </p>
          </div>
        </div>

        {invitation.rsvps.length > 0 && (
          <Button asChild variant="outline">
            <a href={`/api/invitations/${params.id}/rsvp/export`} download>
              <Download className="w-4 h-4 mr-2" />
              Exporteer CSV
            </a>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-stone-900">{stats.total}</p>
                <p className="text-sm text-stone-500">Reacties</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-green-600">{stats.attending.length}</p>
                <p className="text-sm text-stone-500">Komt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-red-600">{stats.notAttending.length}</p>
                <p className="text-sm text-stone-500">Komt niet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-amber-600">{stats.maybe.length}</p>
                <p className="text-sm text-stone-500">Misschien</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-burgundy-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-burgundy-600">{stats.totalGuests}</p>
                <p className="text-sm text-stone-500">Totaal gasten</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RSVP List */}
      {invitation.rsvps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h2 className="font-heading text-xl mb-2">Nog geen reacties</h2>
            <p className="text-stone-600">
              Zodra gasten reageren op de uitnodiging, zie je ze hier.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Alle reacties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Naam</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Gasten</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600 hidden md:table-cell">E-mail</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600 hidden lg:table-cell">Dieetwensen</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600 hidden lg:table-cell">Bericht</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {invitation.rsvps.map((rsvp) => (
                    <tr
                      key={rsvp.id}
                      className={`border-b border-stone-100 last:border-0 ${getStatusBgColor(rsvp.attending)}`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-stone-900">{rsvp.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(rsvp.attending)}
                          <span className="text-sm">{getStatusText(rsvp.attending)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-stone-700">{rsvp.guestCount}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {rsvp.email ? (
                          <a
                            href={`mailto:${rsvp.email}`}
                            className="text-burgundy-600 hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            {rsvp.email}
                          </a>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {rsvp.dietary ? (
                          <div className="flex items-center gap-1 text-stone-700">
                            <UtensilsCrossed className="w-3 h-3 text-stone-400" />
                            <span className="text-sm max-w-[150px] truncate" title={rsvp.dietary}>
                              {rsvp.dietary}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {rsvp.message ? (
                          <div className="flex items-center gap-1 text-stone-700">
                            <MessageSquare className="w-3 h-3 text-stone-400" />
                            <span className="text-sm max-w-[200px] truncate" title={rsvp.message}>
                              {rsvp.message}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-stone-500">
                          {new Date(rsvp.createdAt).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dietary overview for catering */}
      {stats.attending.length > 0 && stats.attending.some((r) => r.dietary) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-burgundy-600" />
              Dieetwensen overzicht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.attending
                .filter((r) => r.dietary)
                .map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg"
                  >
                    <div className="font-medium text-stone-900">{rsvp.name}</div>
                    <div className="text-stone-600">{rsvp.dietary}</div>
                    <div className="ml-auto text-sm text-stone-500">
                      {rsvp.guestCount > 1 ? `${rsvp.guestCount} personen` : "1 persoon"}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
