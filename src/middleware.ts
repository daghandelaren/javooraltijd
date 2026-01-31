import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/verify"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});

function getPathnameWithoutLocale(pathname: string): string {
  // Remove locale prefix if present
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
    if (pathname === `/${locale}`) {
      return "/";
    }
  }
  return pathname;
}

function isProtectedRoute(pathname: string): boolean {
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  return protectedRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );
}

function isAuthRoute(pathname: string): boolean {
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  return authRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for non-page routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/u/") ||
    pathname.startsWith("/demo/")
  ) {
    return NextResponse.next();
  }

  // Check authentication status
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;

  // Handle protected routes - redirect to login if not authenticated
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const locale =
      locales.find((l) => pathname.startsWith(`/${l}`)) || defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle auth routes - redirect to dashboard if already authenticated
  if (isAuthRoute(pathname) && isAuthenticated) {
    const locale =
      locales.find((l) => pathname.startsWith(`/${l}`)) || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - static files (images, fonts, etc.)
    // - u/ (public share links - no locale)
    // - demo/ (demo pages - no locale)
    "/((?!api|_next|.*\\..*|u|demo).*)",
  ],
};
