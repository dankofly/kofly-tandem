import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // SEO: Alle 307-Redirects → 308 permanent, damit Google Locale-URLs korrekt indexiert
  if (response.status === 307) {
    const location = response.headers.get("location");
    if (location) {
      return NextResponse.redirect(new URL(location, request.url), {
        status: 308,
        headers: response.headers,
      });
    }
  }

  // Perf: Netlify-Edge darf HTML 1h cachen + 1d stale-while-revalidate servieren.
  // Überschreibt den Next.js-Default `private, no-cache, no-store` für statische Locale-Seiten.
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
