import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };
import { Link } from "@/i18n/navigation";
import {
  breadcrumbSchema,
  faqSchema,
  flightAreaSchemas,
  touristAttractionSchema,
} from "@/lib/schema";

const SITE_URL = "https://gleitschirm-tandemflug.com";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

const LAUNCH_SITES = ["zettersfeld", "hochstein"] as const;
const FAQ_TOPICS = ["Meeting", "FromTown", "Season", "Weather", "Duration"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metadata");
  return {
    title: t("tandemflugLienzTitle"),
    description: t("tandemflugLienzDescription"),
    openGraph: {
      title: t("tandemflugLienzOgTitle"),
      description: t("tandemflugLienzOgDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("tandemflugLienzOgTitle"),
      description: t("tandemflugLienzOgDescription"),
    },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/tandemflug-lienz`,
        en: `${SITE_URL}/en/tandemflug-lienz`,
        nl: `${SITE_URL}/nl/tandemflug-lienz`,
        "x-default": `${SITE_URL}/de/tandemflug-lienz`,
      },
    },
  };
}

export default async function TandemflugLienzPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TandemflugLienz");
  const r = (key: string) => t.rich(key, rich);

  const breadcrumbs = breadcrumbSchema([
    { name: t("breadcrumbHome"), url: `${SITE_URL}/${locale}` },
    {
      name: t("breadcrumbCurrent"),
      url: `${SITE_URL}/${locale}/tandemflug-lienz`,
    },
  ]);

  // Nur die beiden Lienzer Hausberge, nicht alle 7 Fluggebiete (Fokus auf Lienz).
  const lienzAreaSchemas = flightAreaSchemas().slice(0, 2);

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
          __html: JSON.stringify(touristAttractionSchema(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqItems)),
        }}
      />
      {lienzAreaSchemas.map((schema, i) => (
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

          <p className="mt-4 text-xs text-content-muted font-light max-w-md">
            {t("heroProof")}
          </p>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-edge-secondary/40 rounded-xl overflow-hidden">
            {[
              { value: "10.000+", label: t("statFlightsLabel") },
              { value: "5,0★", label: t("statRatingLabel") },
              { value: "2.220 m", label: t("statHeightLabel") },
              { value: "ab €150", label: t("statPriceLabel") },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-primary p-5 text-center">
                <div className="text-xl sm:text-2xl font-bold text-content-primary">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs tracking-premium uppercase text-content-muted font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof – Vertrauen vor der Handlung */}
      <section className="-mt-4 pb-4">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card border-accent-500/20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="shrink-0 text-center sm:text-left sm:border-r sm:border-edge-secondary/40 sm:pr-6">
              <div
                className="flex items-center justify-center sm:justify-start gap-0.5 text-accent-500"
                aria-hidden="true"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1.6l2.47 5.18 5.69.74-4.2 3.9 1.07 5.62L10 14.9l-5.0 2.14 1.07-5.62-4.2-3.9 5.69-.74z" />
                  </svg>
                ))}
              </div>
              <div className="mt-2 text-sm font-semibold text-content-primary">
                {t("proofRating")}
              </div>
              <div className="mt-1 text-xs text-content-muted font-light">
                {t("proofBadge")}
              </div>
            </div>
            <figure className="flex-1">
              <blockquote className="text-sm sm:text-base text-content-body leading-relaxed font-light italic">
                {t("proofQuote")}
              </blockquote>
              <figcaption className="mt-2 text-xs tracking-premium uppercase text-content-muted font-medium not-italic">
                {t("proofAuthor")}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Warum Lienz */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
            {t("whyTitle")}
          </h2>
          <div className="mt-5 section-divider !mx-0" />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {["why1", "why2", "why3"].map((key) => (
              <div key={key} className="glass-card card-hover-glow p-6 h-full border-accent-500/20">
                <h3 className="text-base font-semibold text-content-primary">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {r(`${key}P`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zwei Startplätze über Lienz */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
            {t("launchTitle")}
          </h2>
          <div className="mt-5 section-divider !mx-0" />
          <p className="mt-6 text-base text-content-body leading-relaxed font-light">
            {t("launchIntro")}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {LAUNCH_SITES.map((site) => (
              <div key={site} className="glass-card card-hover-glow p-6 sm:p-8 h-full border-accent-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-content-primary">
                    {t(`${site}Name`)}
                  </h3>
                  <span className="text-xs font-medium text-accent-500 bg-accent-500/10 px-2 py-1 rounded">
                    {t(`${site}Height`)}
                  </span>
                </div>
                <p className="mt-1 text-xs tracking-premium uppercase text-content-muted font-medium">
                  {t(`${site}Tag`)}
                </p>
                <div className="mt-4 space-y-3 text-sm text-content-body leading-relaxed font-light">
                  <p>{r(`${site}P1`)}</p>
                  <p>{r(`${site}P2`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treffpunkt & Anreise in Lienz */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card border-accent-500/20 p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              {t("meetTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <div className="mt-6 space-y-5 text-sm sm:text-base text-content-body leading-relaxed font-light">
              <p>{r("meetP1")}</p>
              <p>{r("meetP2")}</p>
            </div>
            <div className="mt-8">
              <Link
                href="/anreise"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent-500 hover:text-accent-400 transition-colors"
              >
                {t("meetLink")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24">
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

      {/* E-E-A-T */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card border-accent-500/20 p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-content-primary tracking-tight">
              {t("eeatTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <div className="mt-6 space-y-5 text-sm text-content-body leading-relaxed font-light">
              <p>{r("eeatP1")}</p>
              <p>{r("eeatP2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Links */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/tandemflug-osttirol", key: "Osttirol" },
              { href: "/anreise", key: "Anreise" },
              { href: "/buchen", key: "Buchen" },
              { href: "/ueber-uns", key: "UeberUns" },
            ].map((link) => (
              <Link key={link.key} href={link.href} className="block group">
                <div className="glass-card card-hover-glow p-6 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                      {t(`crosslink${link.key}Title`)}
                    </h3>
                    <svg className="w-4 h-4 text-accent-500 shrink-0 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="mt-2 text-sm text-content-body font-light">
                    {t(`crosslink${link.key}P`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
