import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.code !== undefined) data.code = String(body.code).toUpperCase().trim();
    if (body.type !== undefined) {
      if (body.type !== "PERCENTAGE" && body.type !== "FIXED") {
        return NextResponse.json({ error: "Type moet PERCENTAGE of FIXED zijn" }, { status: 400 });
      }
      data.type = body.type;
    }
    if (body.value !== undefined) {
      if (typeof body.value !== "number" || body.value <= 0) {
        return NextResponse.json({ error: "Waarde moet groter dan 0 zijn" }, { status: 400 });
      }
      data.value = body.value;
    }
    if (body.minOrderCents !== undefined) data.minOrderCents = body.minOrderCents || null;
    if (body.maxUsages !== undefined) data.maxUsages = body.maxUsages || null;
    if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const discount = await db.discountCode.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ discount });
  } catch (error) {
    console.error("Admin update discount error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.discountCode.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete discount error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
