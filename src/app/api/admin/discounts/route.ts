import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const discounts = await db.discountCode.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ discounts });
  } catch (error) {
    console.error("Admin discounts error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, type, value, minOrderCents, maxUsages, expiresAt, isActive } = body;

    // Validation
    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ error: "Code is verplicht" }, { status: 400 });
    }
    if (type !== "PERCENTAGE" && type !== "FIXED") {
      return NextResponse.json({ error: "Type moet PERCENTAGE of FIXED zijn" }, { status: 400 });
    }
    if (typeof value !== "number" || value <= 0) {
      return NextResponse.json({ error: "Waarde moet groter dan 0 zijn" }, { status: 400 });
    }
    if (type === "PERCENTAGE" && value > 100) {
      return NextResponse.json({ error: "Percentage mag niet hoger dan 100 zijn" }, { status: 400 });
    }

    // Check uniqueness
    const existing = await db.discountCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    });
    if (existing) {
      return NextResponse.json({ error: "Code bestaat al" }, { status: 400 });
    }

    const discount = await db.discountCode.create({
      data: {
        code: code.toUpperCase().trim(),
        type,
        value,
        minOrderCents: minOrderCents || null,
        maxUsages: maxUsages || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ discount }, { status: 201 });
  } catch (error) {
    console.error("Admin create discount error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
