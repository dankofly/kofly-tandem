import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const SITE_URL = "https://www.gleitschirm-tandemflug.com";

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

export default function BuchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
