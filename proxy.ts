import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Alt-URLs der WordPress-Seite -> neue Routen. Muss hier laufen und nicht in
// public/_redirects oder next.config redirects(): auf Netlify laeuft diese
// Middleware als Edge-Function vor beidem und wuerde z.B. /kontakt sonst per
// 308 nach /de/kontakt schicken, wo nichts liegt (404).
// Dotted Pfade (/wp-login.php etc.) matcht der Middleware-Matcher nicht,
// die bleiben in public/_redirects.
const LEGACY_REDIRECTS: Record<string, string> = {
  "/tandemflug-buchen": "/de/buchen",
  "/faq": "/de",
  "/ueber-uns": "/de/ueber-uns",
  "/kontakt": "/de/buchen",
  "/galerie": "/de",
  "/preise": "/de/buchen",
  "/gutschein": "/de/gutschein",
  "/jetzt-tandemflug-gutschein-schenken": "/de/gutschein",
  "/test": "/de",
  "/test2": "/de",
  "/feed": "/de",
  "/en/tandem-flight": "/en",
  "/en/booking": "/en/buchen",
  "/en/about-us": "/en/ueber-uns",
  "/en/faq": "/en",
  "/en/gallery": "/en",
  "/en/contact": "/en/buchen",
  "/en/prices": "/en/buchen",
  "/en/piloten": "/en/ueber-uns",
  "/en/tandem-flight-adventure-easttyrol-booking": "/en/buchen",
  "/en/general-terms-conditions-tandem-flight-adventure": "/en/agb",
};

const LEGACY_PREFIX_REDIRECTS: Array<[prefix: string, target: string]> = [
  ["/faq-items", "/de"],
  ["/element_category", "/de"],
  ["/fusion_template", "/de"],
  ["/category", "/de"],
  ["/feed", "/de"],
  ["/en/faq", "/en"],
  ["/wp-admin", "/de"],
  ["/wp-content", "/de"],
  ["/wp-includes", "/de"],
  ["/wp-json", "/de"],
];

function legacyRedirectTarget(pathname: string): string | null {
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  const exact = LEGACY_REDIRECTS[path];
  if (exact) return exact;
  const prefixMatch = LEGACY_PREFIX_REDIRECTS.find(
    ([prefix]) => path === prefix || path.startsWith(`${prefix}/`)
  );
  return prefixMatch ? prefixMatch[1] : null;
}

export default function proxy(request: NextRequest) {
  const legacyTarget = legacyRedirectTarget(request.nextUrl.pathname);
  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, request.url), 301);
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
