import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Legacy thermik.net URL patterns — Plesk forwards thermik.net/foo to
// gleitschirm-tandemflug.com/de/foo. These paths don't exist on KOFLY,
// so we catch-all them to /de to preserve authority transfer.
const LEGACY_THERMIK_PATTERNS = [
  /^\/(?:de|en|nl)\/archives(?:\/.*)?$/,
  /^\/(?:de|en|nl)\/abenteuer-tandemfliegen-/,
  /^\/(?:de|en|nl)\/page\/\d+\/?$/,
  /^\/(?:de|en|nl)\/links(?:\/.*)?$/,
  /^\/(?:de|en|nl)\/\d{4,}\/?$/,
];

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Catch-all for legacy thermik.net URLs → 308 to /de
  if (LEGACY_THERMIK_PATTERNS.some((p) => p.test(pathname))) {
    return NextResponse.redirect(new URL("/de", request.url), 308);
  }

  const response = intlMiddleware(request);

  // SEO: turn locale redirects into permanent redirects.
  if (response.status === 307) {
    const location = response.headers.get("location");
    if (location) {
      return NextResponse.redirect(new URL(location, request.url), {
        status: 308,
        headers: response.headers,
      });
    }
  }

  // Edge cache HTML while still allowing revalidation.
  if (response.status === 200) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    );
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|admin|.*\\..*).*)",
};
