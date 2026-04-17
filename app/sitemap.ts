import type { MetadataRoute } from "next";

const SITE_URL = "https://gleitschirm-tandemflug.com";
const locales = ["de", "en", "nl"] as const;

// Echte lastmod pro Seite (manuell bei Content-Update aktualisieren).
// Google bevorzugt stabile lastmod-Werte gegenüber Build-Timestamps.
const pages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0, lastmod: "2026-04-17" },
  { path: "/ablauf", changeFrequency: "monthly" as const, priority: 0.8, lastmod: "2026-03-15" },
  { path: "/buchen", changeFrequency: "monthly" as const, priority: 0.9, lastmod: "2026-03-15" },
  { path: "/urlaub", changeFrequency: "weekly" as const, priority: 0.9, lastmod: "2026-04-01" },
  { path: "/anreise", changeFrequency: "weekly" as const, priority: 0.8, lastmod: "2026-03-15" },
  { path: "/paragleiten", changeFrequency: "weekly" as const, priority: 0.9, lastmod: "2026-04-01" },
  { path: "/tandemflug-osttirol", changeFrequency: "weekly" as const, priority: 0.95, lastmod: "2026-04-17" },
  { path: "/ueber-uns", changeFrequency: "monthly" as const, priority: 0.7, lastmod: "2026-03-15" },
  { path: "/agb", changeFrequency: "yearly" as const, priority: 0.3, lastmod: "2026-02-01" },
  { path: "/datenschutz", changeFrequency: "yearly" as const, priority: 0.3, lastmod: "2026-02-01" },
  { path: "/impressum", changeFrequency: "yearly" as const, priority: 0.3, lastmod: "2026-02-01" },
];

function localeUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, page.path),
        lastModified: page.lastmod,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, localeUrl(l, page.path)])
            ),
            "x-default": localeUrl("de", page.path),
          },
        },
      });
    }
  }

  return entries;
}
