/**
 * Zentrale Routen-Registry: einzige Quelle für Sitemap, Canonical/hreflang-
 * Helper (lib/seo.ts) und die SEO-Verifikation (scripts/seo-verify).
 *
 * lastmod: manuell pflegen, wenn sich Inhalt oder Meta einer Seite ändert.
 * indexable: false => robots noindex UND nicht in der Sitemap.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gleitschirm-tandemflug.com";

export const LOCALES = ["de", "en", "nl"] as const;
export type Locale = (typeof LOCALES)[number];

export type RouteEntry = {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  lastmod: string;
  indexable: boolean;
};

export const ROUTES: readonly RouteEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0, lastmod: "2026-07-13", indexable: true },
  { path: "/ablauf", changeFrequency: "monthly", priority: 0.8, lastmod: "2026-07-13", indexable: true },
  { path: "/agb", changeFrequency: "yearly", priority: 0.3, lastmod: "2026-02-01", indexable: true },
  { path: "/anreise", changeFrequency: "weekly", priority: 0.8, lastmod: "2026-07-13", indexable: true },
  // Bewertungs-Bruecke vom QR-Schild am Landeplatz. Utility, kein Suchziel.
  { path: "/bewerten", changeFrequency: "yearly", priority: 0.3, lastmod: "2026-08-07", indexable: false },
  { path: "/briefing", changeFrequency: "monthly", priority: 0.5, lastmod: "2026-07-13", indexable: true },
  { path: "/buchen", changeFrequency: "monthly", priority: 0.9, lastmod: "2026-07-13", indexable: true },
  { path: "/classicflug", changeFrequency: "weekly", priority: 0.9, lastmod: "2026-07-13", indexable: true },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3, lastmod: "2026-02-01", indexable: false },
  { path: "/gutschein", changeFrequency: "weekly", priority: 0.95, lastmod: "2026-07-13", indexable: true },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3, lastmod: "2026-02-01", indexable: false },
  { path: "/paragleiten", changeFrequency: "weekly", priority: 0.9, lastmod: "2026-07-13", indexable: true },
  { path: "/premiumflug", changeFrequency: "weekly", priority: 0.9, lastmod: "2026-07-13", indexable: true },
  { path: "/sicherheit", changeFrequency: "monthly", priority: 0.8, lastmod: "2026-07-13", indexable: true },
  { path: "/thermikflug", changeFrequency: "weekly", priority: 0.9, lastmod: "2026-07-13", indexable: true },
  { path: "/tandemflug-hochstein", changeFrequency: "weekly", priority: 0.9, lastmod: "2026-07-13", indexable: true },
  { path: "/tandemflug-lienz", changeFrequency: "weekly", priority: 0.95, lastmod: "2026-07-13", indexable: true },
  { path: "/tandemflug-osttirol", changeFrequency: "weekly", priority: 0.95, lastmod: "2026-07-13", indexable: true },
  { path: "/tandemflug-zettersfeld", changeFrequency: "weekly", priority: 0.95, lastmod: "2026-07-13", indexable: true },
  { path: "/ueber-uns", changeFrequency: "monthly", priority: 0.7, lastmod: "2026-07-13", indexable: true },
  { path: "/urlaub", changeFrequency: "weekly", priority: 0.9, lastmod: "2026-07-13", indexable: true },
] as const;
