import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
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
