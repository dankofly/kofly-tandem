import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metadata");
  return {
    ...(await buildPageMetadata({
      locale,
      path: "/app",
      title: t("appInfoTitle"),
      description: t("appInfoDescription"),
    })),
    robots: { index: false, follow: true },
  };
}

const SECTIONS = ["was", "zugriff", "nutzer", "kontakt"] as const;

export default async function AppInfoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AppInfo");

  return (
    <section className="pt-32 pb-28 lg:pt-40 lg:pb-40">
      <div className="container-page">
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

        <p className="mt-6 text-base text-content-body leading-relaxed">
          {t("subtitle")}
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

          <p>
            {t("datenschutzIntro")}{" "}
            <Link
              href="/datenschutz"
              className="text-accent-500 hover:text-accent-400 underline underline-offset-2 transition-colors"
            >
              {t("datenschutzLink")}
            </Link>
          </p>
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
