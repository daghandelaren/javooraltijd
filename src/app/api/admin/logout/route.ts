import { NextResponse } from "next/server";
import { getDeleteAdminCookieConfig } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  const cookieConfig = getDeleteAdminCookieConfig();
  response.cookies.set(cookieConfig);
  return response;
}
