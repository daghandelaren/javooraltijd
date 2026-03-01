import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { STD_PLAN } from "@/lib/mollie";

export async function POST(request: NextRequest) {
  try {
    const { code } = (await request.json()) as { code?: string };

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Code is verplicht" },
        { status: 400 }
      );
    }

    const discount = await db.discountCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!discount) {
      return NextResponse.json({ valid: false, error: "Ongeldige kortingscode" });
    }

    if (!discount.isActive) {
      return NextResponse.json({ valid: false, error: "Deze kortingscode is niet meer actief" });
    }

    if (discount.expiresAt && discount.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Deze kortingscode is verlopen" });
    }

    if (discount.maxUsages !== null && discount.currentUsages >= discount.maxUsages) {
      return NextResponse.json({ valid: false, error: "Deze kortingscode is al volledig gebruikt" });
    }

    const orderCents = STD_PLAN.price;

    if (discount.minOrderCents !== null && orderCents < discount.minOrderCents) {
      return NextResponse.json({
        valid: false,
        error: `Minimaal bestelbedrag: \u20AC${(discount.minOrderCents / 100).toFixed(2)}`,
      });
    }

    let discountCents: number;
    let discountDisplay: string;

    if (discount.type === "PERCENTAGE") {
      discountCents = Math.round((orderCents * discount.value) / 100);
      discountDisplay = `${discount.value}%`;
    } else {
      discountCents = Math.min(discount.value, orderCents);
      discountDisplay = `\u20AC${(discount.value / 100).toFixed(2)}`;
    }

    return NextResponse.json({
      valid: true,
      discountCents,
      discountDisplay,
      label: `${discountDisplay} korting`,
      code: discount.code,
    });
  } catch (error) {
    console.error("Validate STD discount error:", error);
    return NextResponse.json(
      { valid: false, error: "Er ging iets mis bij het valideren" },
      { status: 500 }
    );
  }
}
