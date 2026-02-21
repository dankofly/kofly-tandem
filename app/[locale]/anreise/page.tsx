import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import ScrollReveal from "@/components/ScrollReveal";
import TravelTimeTable from "@/components/TravelTimeTable";

const SITE_URL = "https://gleitschirm-tandemflug.com";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

const FAQ_TOPICS = [
  "Meeting",
  "Parking",
  "Train",
  "Distance",
  "Road",
  "Lift",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("anreiseTitle"),
    description: t("anreiseDescription"),
    openGraph: {
      title: t("anreiseOgTitle"),
      description: t("anreiseOgDescription"),
    },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/anreise`,
        en: `${SITE_URL}/en/anreise`,
        nl: `${SITE_URL}/nl/anreise`,
        "x-default": `${SITE_URL}/de/anreise`,
      },
    },
  };
}

export default async function AnreisePage() {
  const t = await getTranslations("Anreise");
  const locale = await getLocale();
  const r = (key: string) => t.rich(key, rich);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("breadcrumbCurrent"), url: `${SITE_URL}/${locale}/anreise` },
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
          __html: JSON.stringify(faqSchema(faqItems)),
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div
          className="glow-orb glow-orb-accent w-[500px] h-[500px] -top-40 -right-40 opacity-40 animate-glow-pulse"
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

      {/* Fahrzeit-Matrix */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("tableTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-10">
              <TravelTimeTable />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Anreise per Auto */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("carTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base text-content-body leading-relaxed font-light">
              {t("carP1")}
            </p>
          </ScrollReveal>

          <div className="mt-8 space-y-4">
            <ScrollReveal>
              <div className="glass-card card-hover-glow p-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("carNorthTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("carNorthP1")}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="glass-card card-hover-glow p-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("carSouthTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("carSouthP1")}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="glass-card card-hover-glow p-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("carItalyTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("carItalyP1")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Anreise mit Bahn & Bus */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("trainTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base text-content-body leading-relaxed font-light">
              {t("trainP1")}
            </p>
          </ScrollReveal>

          <div className="mt-8 space-y-4">
            <ScrollReveal>
              <div className="glass-card card-hover-glow p-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("trainStationTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {r("trainStationP1")}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="glass-card card-hover-glow p-6">
                <h3 className="text-lg font-semibold text-content-primary">
                  {t("trainBusTitle")}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {t("trainBusP1")}
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="mt-6 highlight-glow bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
              <p>{r("trainTransferP1")}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mid-CTA */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div
          className="glow-orb glow-orb-accent w-[350px] h-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-glow-pulse"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <ScrollReveal>
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
                className="cta-lift w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-accent-500/40 hover:border-accent-500 text-accent-500 text-xs font-medium tracking-wide uppercase transition-colors"
              >
                {t("ctaGutschein")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Parken & Treffpunkt */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("parkingTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base text-content-body leading-relaxed font-light">
              {t("parkingP1")}
            </p>
          </ScrollReveal>

          <div className="mt-8 space-y-4">
            <ScrollReveal>
              <div className="highlight-glow bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
                <p>{r("parkingZettersfeld")}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="highlight-glow bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
                <p>{r("parkingHochstein")}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="highlight-glow bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
                <p>{r("parkingTouchHeaven")}</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Erkennungszeichen */}
          <ScrollReveal>
            <div className="mt-10 glass-card card-hover-glow p-6 sm:p-8 border-l-2 border-accent-500/40">
              <h3 className="text-lg font-semibold text-content-primary">
                {t("meetingTitle")}
              </h3>
              <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                {t("meetingP1")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-6 text-center">
              <a
                href="https://maps.app.goo.gl/zettersfeld-lienz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-500 transition-colors font-medium"
              >
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {t("mapsLink")}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Terminplanung & Wetter */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("schedulingTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base text-content-body leading-relaxed font-light">
              {t("schedulingP1")}
            </p>
          </ScrollReveal>

          <div className="mt-8 space-y-4">
            {(["1", "2", "3"] as const).map((step, i) => (
              <ScrollReveal key={step} delay={i * 100}>
                <div className="glass-card p-5">
                  <p className="text-sm text-content-body leading-relaxed">
                    {r(`schedulingStep${step}`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-8 highlight-glow bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
              <p>{r("schedulingP2")}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-4 glass-card p-5">
              <p className="text-sm text-content-body leading-relaxed font-light">
                {t("webcamHint")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Unterkünfte */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("accommodationTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base text-content-body leading-relaxed font-light">
              {t("accommodationP1")}
            </p>
          </ScrollReveal>

          <div className="mt-10 space-y-6">
            {(["1", "2", "3"] as const).map((num, i) => (
              <ScrollReveal key={num} delay={i * 100}>
                <div className="glass-card card-hover-glow p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-content-primary">
                    {t(`accommodationTip${num}Title`)}
                  </h3>
                  <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                    {t(`accommodationTip${num}P1`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("faqTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
          </ScrollReveal>

          <div className="mt-10 space-y-4">
            {FAQ_TOPICS.map((topic) => (
              <ScrollReveal key={topic}>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-content-primary">
                    {t(`faq${topic}Q`)}
                  </h3>
                  <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                    {r(`faq${topic}A`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Links */}
      <section className="py-12 lg:py-16 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/urlaub" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                  {t("crosslinkUrlaubTitle")}
                </h3>
                <p className="mt-2 text-sm text-content-body font-light">
                  {t("crosslinkUrlaubP")}
                </p>
              </div>
            </Link>
            <Link href="/paragleiten" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                  {t("crosslinkParagleitenTitle")}
                </h3>
                <p className="mt-2 text-sm text-content-body font-light">
                  {t("crosslinkParagleitenP")}
                </p>
              </div>
            </Link>
            <Link href="/ablauf" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                  {t("crosslinkAblaufTitle")}
                </h3>
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
          className="glow-orb glow-orb-accent w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-glow-pulse"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <ScrollReveal>
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
                className="cta-lift w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-accent-500/40 hover:border-accent-500 text-accent-500 text-xs font-medium tracking-wide uppercase transition-colors"
              >
                {t("ctaGutschein")}
              </Link>
            </div>

            <p className="mt-6 text-xs text-content-muted">
              {t("ctaWhatsapp")}
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
