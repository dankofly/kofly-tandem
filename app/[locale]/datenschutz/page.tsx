import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const SITE_URL = "https://gleitschirm-tandemflug.com";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("datenschutzTitle"),
    description: t("datenschutzDescription"),
    robots: { index: false, follow: true },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/datenschutz`,
        en: `${SITE_URL}/en/datenschutz`,
        nl: `${SITE_URL}/nl/datenschutz`,
        "x-default": `${SITE_URL}/de/datenschutz`,
      },
    },
  };
}

const SECTIONS = [
  "verantwortlicher",
  "ueberblick",
  "rechtsgrundlagen",
  "formulare",
  "chatbot",
  "googleMaps",
  "instagram",
  "hosting",
  "cookies",
  "ssl",
  "rechte",
  "beschwerde",
  "aenderungen",
] as const;

export default async function DatenschutzPage() {
  const t = await getTranslations("Datenschutz");

  return (
    <section className="pt-32 pb-28 lg:pt-40 lg:pb-40">
      <div className="max-w-2xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-xs text-content-subtle font-light">
            <li>
              <Link href="/" className="hover:text-accent-400 transition-colors">
                {t("breadcrumbHome")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-content-faint">/</li>
            <li className="text-content-strong font-medium">{t("breadcrumbCurrent")}</li>
          </ol>
        </nav>

        <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
          {t("tagline")}
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
          {t("title")}
        </h1>
        <div className="mt-6 section-divider !mx-0" />

        <p className="mt-6 text-xs text-content-subtle font-light">
          {t("lastUpdated")}
        </p>

        <div className="mt-10 space-y-10 text-sm text-content-body leading-relaxed font-light">
          {SECTIONS.map((key) => (
            <div key={key}>
              <h2 className="text-lg font-semibold text-content-primary">
                {t(`${key}Title`)}
              </h2>
              <div className="mt-2 section-divider !mx-0 !w-12" />
              <p className="mt-4 whitespace-pre-line">
                {t(`${key}Text`)}
              </p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-content-subtle hover:text-accent-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t("breadcrumbHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}
