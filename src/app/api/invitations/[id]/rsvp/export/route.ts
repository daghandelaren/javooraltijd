import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";

// GET /api/invitations/[id]/rsvp/export - Export RSVPs as CSV
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check ownership and get invitation with RSVPs
    const invitation = await db.invitation.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        rsvps: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Generate CSV content
    const headers = ["Naam", "E-mail", "Status", "Aantal gasten", "Dieetwensen", "Bericht", "Datum"];

    const statusMap: Record<string, string> = {
      YES: "Komt",
      NO: "Komt niet",
      MAYBE: "Misschien",
    };

    const rows = invitation.rsvps.map((rsvp) => [
      rsvp.name,
      rsvp.email || "-",
      statusMap[rsvp.attending] || rsvp.attending,
      rsvp.guestCount.toString(),
      rsvp.dietary || "-",
      rsvp.message?.replace(/[\n\r]+/g, " ") || "-",
      new Date(rsvp.createdAt).toLocaleDateString("nl-NL"),
    ]);

    // Escape CSV values
    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // Add BOM for Excel compatibility with UTF-8
    const bom = "\uFEFF";
    const csvWithBom = bom + csvContent;

    // Return as downloadable file
    const filename = `rsvp-${invitation.partner1Name.toLowerCase()}-${invitation.partner2Name.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Failed to export RSVPs:", error);
    return NextResponse.json(
      { error: "Failed to export RSVPs" },
      { status: 500 }
    );
  }
}
