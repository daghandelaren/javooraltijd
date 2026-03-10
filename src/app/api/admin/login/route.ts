import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminToken,
  getAdminCookieConfig,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createAdminToken();
    const cookieConfig = getAdminCookieConfig(token);

    const response = NextResponse.json({ success: true });
    response.cookies.set(cookieConfig);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
