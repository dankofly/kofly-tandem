import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { breadcrumbSchema } from "@/lib/schema";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gleitschirm-tandemflug.com";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("buchenTitle"),
    description: t("buchenDescription"),
    openGraph: {
      title: t("buchenOgTitle"),
      description: t("buchenOgDescription"),
    },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/buchen`,
        en: `${SITE_URL}/en/buchen`,
        nl: `${SITE_URL}/nl/buchen`,
        "x-default": `${SITE_URL}/de/buchen`,
      },
    },
  };
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
