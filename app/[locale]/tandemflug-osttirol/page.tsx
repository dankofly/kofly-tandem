import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  breadcrumbSchema,
  faqSchema,
  flightAreaSchemas,
  touristTripSchema,
} from "@/lib/schema";

const SITE_URL = "https://gleitschirm-tandemflug.com";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

const REGIONS = ["lienz", "sillian", "matrei", "deferrgen"] as const;
const AREAS = ["area1", "area2", "area3", "area4", "area5", "area6", "area7"] as const;
const FAQ_TOPICS = ["Where", "Season", "Booking", "Weather", "Transport"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("tandemflugOsttirolTitle"),
    description: t("tandemflugOsttirolDescription"),
    openGraph: {
      title: t("tandemflugOsttirolOgTitle"),
      description: t("tandemflugOsttirolOgDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("tandemflugOsttirolOgTitle"),
      description: t("tandemflugOsttirolOgDescription"),
    },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/tandemflug-osttirol`,
        en: `${SITE_URL}/en/tandemflug-osttirol`,
        nl: `${SITE_URL}/nl/tandemflug-osttirol`,
        "x-default": `${SITE_URL}/de/tandemflug-osttirol`,
      },
    },
  };
}

export default async function TandemflugOsttirolPage() {
  const t = await getTranslations("TandemflugOsttirol");
  const locale = await getLocale();
  const r = (key: string) => t.rich(key, rich);

  const breadcrumbs = breadcrumbSchema([
    { name: t("breadcrumbHome"), url: `${SITE_URL}/${locale}` },
    {
      name: t("breadcrumbCurrent"),
      url: `${SITE_URL}/${locale}/tandemflug-osttirol`,
    },
  ]);

  const areaSchemas = flightAreaSchemas();
  const tripSchema = touristTripSchema(locale);

  const faqItems = FAQ_TOPICS.map((topic) => ({
    name: t(`faq${topic}Q`),
    text: t(`faq${topic}A`),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqItems)),
        }}
      />
      {areaSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div
          className="glow-orb glow-orb-accent w-[500px] h-[500px] -top-40 -right-40 opacity-40 animate-glow-pulse"
          aria-hidden="true"
        />
        <div
          className="glow-orb glow-orb-sky w-[400px] h-[400px] -bottom-32 -left-32 opacity-30 animate-glow-pulse [animation-delay:2s]"
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-xs text-content-subtle font-light">
              <li>
                <Link
                  href="/"
                  className="hover:text-accent-400 transition-colors"
                >
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-content-faint">
                /
              </li>
              <li className="text-content-strong font-medium">
                {t("breadcrumbCurrent")}
              </li>
            </ol>
          </nav>

          <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
            {t("heroTagline")}
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-content-primary tracking-tight leading-[1.15] text-balance">
            {t("heroTitle")}
            <span className="shimmer-text text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400">
              {t("heroTitleAccent")}
            </span>
          </h1>
          <p className="mt-3 text-sm text-content-muted font-light tracking-wide">
            {t("heroSubtitle")}
          </p>
          <div className="mt-6 section-divider !mx-0" />

          <div className="mt-8 space-y-5 text-base sm:text-lg text-content-body leading-relaxed font-light">
            <p>{r("heroP1")}</p>
            <p>{r("heroP2")}</p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/buchen"
              className="cta-lift btn-glow inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors"
            >
              {t("ctaBook")}
            </Link>
            <Link
              href="/buchen#gutschein"
              className="cta-lift inline-flex items-center justify-center px-8 py-4 border border-edge-secondary text-content-body hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors"
            >
              {t("ctaVoucher")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent-500">10.000+</div>
              <div className="mt-1 text-xs text-content-muted font-light">
                {t("statsFlights")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent-500">7</div>
              <div className="mt-1 text-xs text-content-muted font-light">
                {t("statsFlightAreas")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent-500">5,0★</div>
              <div className="mt-1 text-xs text-content-muted font-light">
                {t("statsRating")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent-500">€150</div>
              <div className="mt-1 text-xs text-content-muted font-light">
                {t("statsStart")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
            {t("regionsTitle")}
          </h2>
          <div className="mt-5 section-divider !mx-0" />
          <p className="mt-6 text-base text-content-body leading-relaxed font-light">
            {t("regionsIntro")}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {REGIONS.map((region) => (
              <div
                key={region}
                className="glass-card card-hover-glow p-6 sm:p-8 h-full border-accent-500/20"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-content-primary">
                    {t(`${region}Name`)}
                  </h3>
                  <span className="text-xs font-medium text-accent-500 bg-accent-500/10 px-2 py-1 rounded">
                    {t(`${region}Alt`)}
                  </span>
                </div>
                <p className="mt-4 text-sm text-content-body leading-relaxed font-light">
                  {r(`${region}Text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
            {t("areasTitle")}
          </h2>
          <div className="mt-5 section-divider !mx-0" />
          <p className="mt-6 text-base text-content-body leading-relaxed font-light">
            {t("areasIntro")}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {AREAS.map((area) => (
              <li
                key={area}
                className="flex items-start gap-3 p-4 glass-card"
              >
                <svg
                  className="w-5 h-5 text-accent-500 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-content-body font-light">
                  {t(area)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/paragleiten"
              className="text-sm text-accent-500 hover:text-accent-400 transition-colors font-medium inline-flex items-center gap-2"
            >
              {t("crosslinkParagleitenTitle")}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why East Tyrol */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
            {t("whyTitle")}
          </h2>
          <div className="mt-5 section-divider !mx-0" />
          <div className="mt-8 space-y-5 text-base text-content-body leading-relaxed font-light">
            <p>{r("whyP1")}</p>
            <p>{r("whyP2")}</p>
            <p>{t("whyP3")}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
            {t("faqTitle")}
          </h2>
          <div className="mt-5 section-divider !mx-0" />

          <div className="mt-10 space-y-4">
            {FAQ_TOPICS.map((topic) => (
              <div
                key={topic}
                className="glass-card p-6 border-l-2 border-accent-500/20 hover:border-accent-500/50 transition-colors"
              >
                <h3 className="text-sm font-semibold text-content-primary">
                  {t(`faq${topic}Q`)}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {r(`faq${topic}A`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/paragleiten" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                    {t("crosslinkParagleitenTitle")}
                  </h3>
                  <svg
                    className="w-4 h-4 text-accent-500 shrink-0 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-content-body font-light">
                  {t("crosslinkParagleitenP")}
                </p>
              </div>
            </Link>
            <Link href="/urlaub" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                    {t("crosslinkUrlaubTitle")}
                  </h3>
                  <svg
                    className="w-4 h-4 text-accent-500 shrink-0 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-content-body font-light">
                  {t("crosslinkUrlaubP")}
                </p>
              </div>
            </Link>
            <Link href="/ablauf" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                    {t("crosslinkAblaufTitle")}
                  </h3>
                  <svg
                    className="w-4 h-4 text-accent-500 shrink-0 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-content-body font-light">
                  {t("crosslinkAblaufP")}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-surface-secondary">
        <div
          className="glow-orb glow-orb-accent w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-glow-pulse"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary">
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 text-base text-content-body font-light">
            {t("ctaP")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/buchen"
              className="cta-lift btn-glow w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors"
            >
              {t("ctaBook")}
            </Link>
            <Link
              href="/buchen#gutschein"
              className="cta-lift w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-edge-secondary text-content-body hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors"
            >
              {t("ctaVoucher")}
            </Link>
          </div>

          <p className="mt-6 text-xs text-content-muted">{t("ctaWhatsapp")}</p>
        </div>
      </section>
    </>
  );
}
