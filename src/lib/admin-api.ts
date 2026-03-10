import { verifyAdminToken, COOKIE_NAME } from "./admin-auth";

export async function requireAdmin(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  return verifyAdminToken(token);
}
