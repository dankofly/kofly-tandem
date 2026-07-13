import type { MetadataRoute } from "next";
import { ROUTES, LOCALES, SITE_URL } from "@/lib/routes";

// Die Routen-Registry (lib/routes.ts) ist die einzige Quelle: nur indexierbare
// Seiten landen in der Sitemap, lastmod wird dort manuell gepflegt.
// Google bevorzugt stabile lastmod-Werte gegenüber Build-Timestamps.

function localeUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of ROUTES) {
    if (!page.indexable) continue;
    for (const locale of LOCALES) {
      entries.push({
        url: localeUrl(locale, page.path),
        lastModified: page.lastmod,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            ...Object.fromEntries(
              LOCALES.map((l) => [l, localeUrl(l, page.path)])
            ),
            "x-default": localeUrl("de", page.path),
          },
        },
      });
    }
  }

  return entries;
}
