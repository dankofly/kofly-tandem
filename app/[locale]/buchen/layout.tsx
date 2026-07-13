import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { breadcrumbSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Locale explizit binden: ohne sie lieferte /en/buchen und /nl/buchen
  // die deutschen Meta-Texte (Befund URL-Inventar 2026-07-13).
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata({
    locale,
    path: "/buchen",
    title: t("buchenTitle"),
    description: t("buchenDescription"),
    ogTitle: t("buchenOgTitle"),
    ogDescription: t("buchenOgDescription"),
  });
}

export default async function BuchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Buchen");
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("breadcrumbCurrent"), url: `${SITE_URL}/${locale}/buchen` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {children}
    </>
  );
}
