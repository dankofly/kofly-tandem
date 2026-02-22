import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema, touristTripSchema, faqSchema } from "@/lib/schema";

const SITE_URL = "https://gleitschirm-tandemflug.com";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

const FAQ_TOPICS = [
  "Clothing",
  "Weather",
  "Weight",
  "Kids",
  "Media",
  "Voucher",
  "Season",
  "Price",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("urlaubTitle"),
    description: t("urlaubDescription"),
    openGraph: {
      title: t("urlaubOgTitle"),
      description: t("urlaubOgDescription"),
    },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/urlaub`,
        en: `${SITE_URL}/en/urlaub`,
        nl: `${SITE_URL}/nl/urlaub`,
        "x-default": `${SITE_URL}/de/urlaub`,
      },
    },
  };
}

export default async function UrlaubPage() {
  const t = await getTranslations("Urlaub");
  const locale = await getLocale();
  const r = (key: string) => t.rich(key, rich);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("breadcrumbCurrent"), url: `${SITE_URL}/${locale}/urlaub` },
  ]);

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(touristTripSchema(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqItems)),
        }}
      />

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
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-content-primary tracking-tight leading-[1.15]">
            {t("heroTitle")}
            <span className="shimmer-text text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400">
              {t("heroTitleAccent")}
            </span>
          </h1>
          <div className="mt-6 section-divider !mx-0" />

          <div className="mt-8 space-y-5 text-base sm:text-lg text-content-body leading-relaxed font-light">
            <p>{r("heroP1")}</p>
            <p>{r("heroP2")}</p>
          </div>
        </div>
      </section>

      {/* Warum Tandem */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("whyTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base sm:text-lg text-content-body leading-relaxed font-light">
              {r("whyP1")}
            </p>

          {/* Panorama H3 */}
          <div className="mt-10 glass-card card-hover-glow p-6 sm:p-8 border-l-2 border-accent-500/40">
              <h3 className="text-lg font-semibold text-content-primary">
                {t("whyPanoramaTitle")}
              </h3>
              <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                {t("whyPanoramaP1")}
              </p>
            </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="glass-card card-hover-glow p-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("whyTimeTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("whyTimeP1")}
                </p>
              </div>
            <div className="glass-card card-hover-glow p-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("whyEmotionTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("whyEmotionP1")}
                </p>
              </div>
            <div className="glass-card card-hover-glow p-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("whySocialTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("whySocialP1")}
                </p>
              </div>
          </div>
        </div>
      </section>

      {/* Mid-CTA */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div
          className="glow-orb glow-orb-accent w-[350px] h-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-glow-pulse"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-content-primary">
              {t("midCtaTitle")}
            </h2>
            <p className="mt-3 text-sm text-content-body font-light">
              {t("midCtaP1")}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/buchen"
                className="cta-lift btn-glow w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors"
              >
                {t("ctaTermin")}
              </Link>
              <Link
                href="/buchen#gutschein"
                className="cta-lift w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-edge-secondary text-content-body hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors"
              >
                {t("ctaGutschein")}
              </Link>
            </div>
        </div>
      </section>

      {/* So laufts ab */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
                {t("processTitle")}
              </h2>
            <p className="mt-2 text-sm text-content-subtle font-light">
              {t("processSubtitle")}
            </p>
            <div className="mt-5 section-divider !mx-0" />

          <div className="mt-10 space-y-6">
            {(["1", "2", "3"] as const).map((step) => (
              <div key={step} className="step-card glass-card card-hover-glow p-6 sm:p-8">
                  <div className="flex items-start gap-5">
                    <span className="hidden sm:block text-3xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                      0{step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 sm:gap-0">
                        <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                          0{step}
                        </span>
                        <h3 className="text-lg font-semibold text-content-primary">
                          {t(`processStep${step}Title`)}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                        {t(`processStep${step}P1`)}
                      </p>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          <div className="mt-8 text-center">
              <Link
                href="/ablauf"
                className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-500 transition-colors font-medium"
              >
                {t("processLink")}
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

      {/* Zielgruppen */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("targetTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />

          <div className="mt-10 space-y-6">
            <div className="glass-card card-hover-glow p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("targetFamilyTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("targetFamilyP1")}
                </p>
              </div>
            <div className="glass-card card-hover-glow p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("targetCoupleTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("targetCoupleP1")}
                </p>
              </div>
            <div className="glass-card card-hover-glow p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("targetSoloTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("targetSoloP1")}
                </p>
              </div>
          </div>
        </div>
      </section>

      {/* Trust / Reviews */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
                {t("trustTitle")}
              </h2>
            <p className="mt-2 text-sm text-accent-500 font-medium">
              {t("trustSubtitle")}
            </p>
            <div className="mt-5 section-divider !mx-0" />

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {(["1", "2", "3"] as const).map((num) => (
              <div key={num} className="glass-card p-6 h-full flex flex-col">
                  <svg
                    className="w-6 h-6 text-accent-500/40 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="mt-4 text-sm text-content-body leading-relaxed font-light italic flex-1">
                    {t(`trustReview${num}`)}
                  </p>
                  <p className="mt-4 text-xs text-content-subtle font-medium">
                    — {t(`trustReview${num}Author`)}
                  </p>
                </div>
            ))}
          </div>

          <div className="mt-10 glass-card p-6 sm:p-8 border-l-2 border-accent-500/40">
              <h3 className="text-lg font-semibold text-content-primary">
                {t("trustCertTitle")}
              </h3>
              <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                {r("trustCertP1")}
              </p>
            </div>
        </div>
      </section>

      {/* Tips & Highlights */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("tipsTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base sm:text-lg text-content-body leading-relaxed font-light">
              {t("tipsP1")}
            </p>

          <div className="mt-10 space-y-6">
            <div className="glass-card card-hover-glow p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("tipsOutdoorTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("tipsOutdoorP1")}
                </p>
              </div>
            <div className="glass-card card-hover-glow p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("tipsArrivalTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("tipsArrivalP1")}
                </p>
                <Link
                  href="/anreise"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-500 transition-colors font-medium"
                >
                  {t("crosslinkAnreiseTitle")}
                  <svg
                    className="w-3.5 h-3.5"
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
            <div className="glass-card card-hover-glow p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("tipsFamilyTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("tipsFamilyP1")}
                </p>
              </div>
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
              <div key={topic} className="glass-card p-6 border-l-2 border-accent-500/20 hover:border-accent-500/50 transition-colors">
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

      {/* Cross-Links */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/anreise" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                    {t("crosslinkAnreiseTitle")}
                  </h3>
                  <svg className="w-4 h-4 text-accent-500 shrink-0 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-content-body font-light">
                  {t("crosslinkAnreiseP")}
                </p>
              </div>
            </Link>
            <Link href="/paragleiten" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                    {t("crosslinkParagleitenTitle")}
                  </h3>
                  <svg className="w-4 h-4 text-accent-500 shrink-0 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-content-body font-light">
                  {t("crosslinkParagleitenP")}
                </p>
              </div>
            </Link>
            <Link href="/ablauf" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                    {t("crosslinkAblaufTitle")}
                  </h3>
                  <svg className="w-4 h-4 text-accent-500 shrink-0 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

      {/* CTA */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <div
          className="glow-orb glow-orb-accent w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-glow-pulse"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary">
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 text-base text-content-body font-light">
              {t("ctaP1")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/buchen"
                className="cta-lift btn-glow w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors"
              >
                {t("ctaTermin")}
              </Link>
              <Link
                href="/buchen#gutschein"
                className="cta-lift w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-edge-secondary text-content-body hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors"
              >
                {t("ctaGutschein")}
              </Link>
            </div>

            <p className="mt-6 text-xs text-content-muted">
              {t("ctaWhatsapp")}
            </p>
        </div>
      </section>
    </>
  );
}
