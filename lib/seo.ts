import type { Metadata } from "next";
import { getImageUrl } from "@/lib/images-config";
import { SITE_URL, LOCALES } from "@/lib/routes";

/**
 * SEO-Helper für generateMetadata.
 *
 * Hintergrund: Next.js merged Metadata nur pro Top-Level-Key. Eine Seite,
 * die `alternates` oder `openGraph` definiert, ersetzt damit das komplette
 * Objekt aus dem Layout. Vor diesen Helpern hatten deshalb alle Unterseiten
 * weder Canonical noch og:image/og:url/og:type. Jede Seite baut ihre
 * alternates/openGraph daher vollständig über diese Funktionen.
 */

const ogLocaleMap: Record<string, string> = {
  de: "de_AT",
  en: "en_US",
  nl: "nl_NL",
};

/** Self-Canonical + hreflang-Set (de/en/nl + x-default auf de). */
export function buildAlternates(locale: string, path = ""): Metadata["alternates"] {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      "x-default": `${SITE_URL}/de${path}`,
    },
  };
}

/** Vollständiges OpenGraph-Objekt inkl. Site-weitem og:image-Fallback. */
export async function buildOpenGraph(
  locale: string,
  path: string,
  { title, description }: { title: string; description: string }
): Promise<Metadata["openGraph"]> {
  const ogImagePath = await getImageUrl("og-image");
  const ogImage = ogImagePath
    ? `${SITE_URL}${ogImagePath}`
    : `${SITE_URL}/images/tandemflug-lienz-hero.webp`;

  return {
    type: "website",
    locale: ogLocaleMap[locale] || "de_AT",
    url: `${SITE_URL}/${locale}${path}`,
    siteName: "Gleitschirm-Tandemflug.com",
    title,
    description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  };
}

/** Twitter-Card passend zum OpenGraph-Objekt. */
export async function buildTwitter(
  { title, description }: { title: string; description: string }
): Promise<Metadata["twitter"]> {
  const ogImagePath = await getImageUrl("og-image");
  const ogImage = ogImagePath
    ? `${SITE_URL}${ogImagePath}`
    : `${SITE_URL}/images/tandemflug-lienz-hero.webp`;
  return { card: "summary_large_image", title, description, images: [ogImage] };
}

/**
 * Komplettes Metadata-Fragment für eine Unterseite: title, description,
 * canonical, hreflang, OpenGraph, Twitter. Seiten spreaden das Ergebnis
 * und ergänzen bei Bedarf (z.B. robots noindex).
 */
export async function buildPageMetadata(opts: {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}): Promise<Metadata> {
  const og = {
    title: opts.ogTitle ?? opts.title,
    description: opts.ogDescription ?? opts.description,
  };
  return {
    title: opts.title,
    description: opts.description,
    alternates: buildAlternates(opts.locale, opts.path),
    openGraph: await buildOpenGraph(opts.locale, opts.path, og),
    twitter: await buildTwitter(og),
  };
}
