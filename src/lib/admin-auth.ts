import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin-session";

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  console.log("[admin-auth] ENV loaded:", {
    hasUsername: !!expectedUsername,
    hasPassword: !!expectedPassword,
    usernameLength: expectedUsername?.length,
    passwordLength: expectedPassword?.length,
    inputUsernameLength: username.length,
    inputPasswordLength: password.length,
  });
  if (!expectedUsername || !expectedPassword) return false;

  const usernameBuffer = Buffer.from(username);
  const expectedUsernameBuffer = Buffer.from(expectedUsername);
  const passwordBuffer = Buffer.from(password);
  const expectedPasswordBuffer = Buffer.from(expectedPassword);

  // Constant-time comparison — pad to same length to avoid timing leaks
  const usernameMatch =
    usernameBuffer.length === expectedUsernameBuffer.length &&
    crypto.timingSafeEqual(usernameBuffer, expectedUsernameBuffer);
  const passwordMatch =
    passwordBuffer.length === expectedPasswordBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, expectedPasswordBuffer);

  return usernameMatch && passwordMatch;
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export function getAdminCookieConfig(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/admin",
    maxAge: 86400, // 24 hours
  };
}

export function getDeleteAdminCookieConfig() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/admin",
    maxAge: 0,
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export { COOKIE_NAME };
