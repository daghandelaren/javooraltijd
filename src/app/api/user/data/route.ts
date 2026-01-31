import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";

// GET /api/user/data - Export all user data (GDPR)
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all user data including invitations and RSVPs
    const userData = await db.user.findUnique({
      where: { id: user.id },
      include: {
        invitations: {
          include: {
            locations: true,
            timeline: true,
            rsvps: true,
          },
        },
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
            type: true,
          },
        },
        sessions: {
          select: {
            expires: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Format the data for export
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      invitations: userData.invitations.map((inv) => ({
        id: inv.id,
        status: inv.status,
        templateId: inv.templateId,
        partner1Name: inv.partner1Name,
        partner2Name: inv.partner2Name,
        weddingDate: inv.weddingDate,
        weddingTime: inv.weddingTime,
        headline: inv.headline,
        locations: inv.locations,
        timeline: inv.timeline,
        rsvpEnabled: inv.rsvpEnabled,
        rsvpDeadline: inv.rsvpDeadline,
        styling: {
          sealColor: inv.sealColor,
          sealFont: inv.sealFont,
          sealStyle: inv.sealStyle,
          monogram: inv.monogram,
          fontPairing: inv.fontPairing,
        },
        shareId: inv.shareId,
        planId: inv.planId,
        paidAt: inv.paidAt,
        createdAt: inv.createdAt,
        updatedAt: inv.updatedAt,
        rsvps: inv.rsvps.map((rsvp) => ({
          id: rsvp.id,
          name: rsvp.name,
          email: rsvp.email,
          attending: rsvp.attending,
          guestCount: rsvp.guestCount,
          dietary: rsvp.dietary,
          message: rsvp.message,
          createdAt: rsvp.createdAt,
        })),
      })),
      linkedAccounts: userData.accounts.map((acc) => ({
        provider: acc.provider,
        type: acc.type,
      })),
    };

    // Return as JSON download
    const filename = `javooraltijd-data-export-${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Failed to export user data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/data - Delete all user data (GDPR right to be forgotten)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get confirmation from request body
    const body = await request.json();
    if (body.confirm !== "DELETE_ALL_MY_DATA") {
      return NextResponse.json(
        { error: "Confirmation required. Send { confirm: 'DELETE_ALL_MY_DATA' }" },
        { status: 400 }
      );
    }

    // Delete user and all related data (cascade should handle relations)
    await db.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({
      success: true,
      message: "All your data has been permanently deleted",
    });
  } catch (error) {
    console.error("Failed to delete user data:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
