import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const projectRoot = process.cwd();

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  outputFileTracingRoot: projectRoot,

  /**
   * Weiterleitungen fuer Adressen, die ausserhalb dieses Repositories
   * verlinkt werden und hier nie existiert haben.
   *
   * /classic-media: Die Buchungsstrecke (booking.kofly.at) verlinkt auf der
   * persoenlichen Flugseite unter "Details ansehen" auf
   * /de/classic-media. Diese Route gab es hier nie, Gaeste landeten auf der
   * 404. Ein eigenes Paket-Detail fuer "Classic inkl. Media" existiert
   * nicht, deshalb geht es auf den Paketvergleich der Startseite, wo alle
   * vier Pakete samt Preis nebeneinander stehen.
   *
   * Der Anker #pakete ist verifiziert: components/Packages.tsx setzt
   * id="pakete", und die Live-Seite liefert ihn aus.
   *
   * permanent: false (307/308). Bewusst nicht permanent: sobald die
   * Buchungsstrecke ihren Link korrigiert, soll kein Browser und kein
   * Suchindex diese Umleitung dauerhaft zwischenspeichern.
   */
  async redirects() {
    return [
      {
        source: "/:locale(de|en|nl)/classic-media",
        destination: "/:locale#pakete",
        permanent: false,
      },
      {
        source: "/classic-media",
        destination: "/de#pakete",
        permanent: false,
      },
    ];
  },

  turbopack: {
    root: projectRoot,
  },
  serverExternalPackages: ["@netlify/blobs", "@netlify/neon"],
  experimental: {
    optimizePackageImports: ["@ai-sdk/react", "next-intl", "ai"],
    optimizeCss: true,
    inlineCss: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // 'unsafe-eval' entfernt 2026-08-08. Es war seit dem April-Audit als
      // offen gefuehrt und wurde von nichts im Projekt gebraucht.
      // 'unsafe-inline' bleibt: Next.js App Router setzt Inline-Skripte fuer
      // Hydration und Theme, ein Nonce dafuer ist ein eigener Umbau.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.google.com https://*.googleapis.com https://*.gstatic.com",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), notifications=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
