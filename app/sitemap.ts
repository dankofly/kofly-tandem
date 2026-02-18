import type { MetadataRoute } from "next";

const SITE_URL = "https://gleitschirm-tandemflug.com";
const locales = ["de", "en", "nl"] as const;
const defaultLocale = "de";

const pages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/ablauf", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/buchen", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/agb", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/datenschutz", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/impressum", changeFrequency: "yearly" as const, priority: 0.3 },
];

function localeUrl(locale: string, path: string): string {
  return locale === defaultLocale
    ? `${SITE_URL}${path || "/"}`
    : `${SITE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, page.path),
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, localeUrl(l, page.path)])
          ),
        },
      });
    }
  }

  return entries;
}
