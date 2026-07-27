import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

type Props = { params: Promise<{ locale: string }> };
import { Link } from "@/i18n/navigation";
import {
  breadcrumbSchema,
  faqSchema,
  flightAreaSchemas,
  packageProductSchema,
} from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/routes";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

const EXPERIENCES = ["exp1", "exp2"] as const;
const STEPS = ["step1", "step2", "step3", "step4"] as const;
const FAQ_TOPICS = ["Height", "Beginner", "Duration", "Bergbahn", "Weather"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metadata");
  return buildPageMetadata({
    locale,
    path: "/tandemflug-zettersfeld",
    title: t("tandemflugZettersfeldTitle"),
    description: t("tandemflugZettersfeldDescription"),
    ogTitle: t("tandemflugZettersfeldOgTitle"),
    ogDescription: t("tandemflugZettersfeldOgDescription"),
  });
}

export default async function TandemflugZettersfeldPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TandemflugZettersfeld");
  const r = (key: string) => t.rich(key, rich);

  const breadcrumbs = breadcrumbSchema([
    { name: t("breadcrumbHome"), url: `${SITE_URL}/${locale}` },
    {
      name: t("breadcrumbCurrent"),
      url: `${SITE_URL}/${locale}/tandemflug-zettersfeld`,
    },
  ]);

  // Nur das Zettersfeld-Place-Schema (Index 0), Fokus auf diesen Startplatz.
  const zettersfeldSchema = flightAreaSchemas().slice(0, 1);

  const faqItems = FAQ_TOPICS.map((topic) => ({
    name: t(`faq${topic}Q`),
    text: t(`faq${topic}A`),
  }));

  // Product-Schema mit AggregateRating + Offer -> berechtigt für Stern- und
  // Preis-Rich-Results im SERP. Die Konkurrenz-Seite (nur BreadcrumbList) ist
  // dafür strukturell nicht qualifiziert.
  const zettersfeldProduct = packageProductSchema({
    name: t("productName"),
    description: t("productDescription"),
    price: "150.00",
    url: `${SITE_URL}/${locale}/tandemflug-zettersfeld`,
    image: `${SITE_URL}/images/tandemflug-zettersfeld-hero.webp`,
    locale,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {/* TouristAttraction kommt sitewide aus dem Layout-@graph,
          hier kein zweites Mal ausliefern (doppelte Entitaet). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(zettersfeldProduct) }}
      />
      {zettersfeldSchema.map((schema, i) => (
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
                <Link href="/" className="hover:text-accent-400 transition-colors">
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

          {/* Hero-Bild */}
          <figure className="mt-12 group">
            <div className="relative overflow-hidden rounded-2xl border border-edge-secondary/40 shadow-2xl shadow-black/40">
              <Image
                src="/images/tandemflug-zettersfeld-hero.webp"
                alt={t("heroImageAlt")}
                width={1333}
                height={811}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="w-full h-auto transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
            <figcaption className="mt-3 text-xs text-content-muted font-light text-center">
              {t("heroImageAlt")}
            </figcaption>
          </figure>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-edge-secondary/40 rounded-xl overflow-hidden">
            {[
              { value: "2.220 m", label: t("statHeightLabel") },
              { value: "5,0★", label: t("statRatingLabel") },
              { value: "360°", label: t("statFlightsLabel") },
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

      {/* Social Proof */}
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

      {/* Warum Zettersfeld */}
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

      {/* Flugerlebnisse am Zettersfeld */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
            {t("expTitle")}
          </h2>
          <div className="mt-5 section-divider !mx-0" />
          <p className="mt-6 text-base text-content-body leading-relaxed font-light">
            {t("expIntro")}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {EXPERIENCES.map((exp) => (
              <div key={exp} className="glass-card card-hover-glow p-6 sm:p-8 h-full border-accent-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-content-primary">
                    {t(`${exp}Name`)}
                  </h3>
                  <span className="text-xs font-medium text-accent-500 bg-accent-500/10 px-2 py-1 rounded">
                    {t(`${exp}Tag`)}
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-content-body leading-relaxed font-light">
                  <p>{r(`${exp}P1`)}</p>
                  <p>{r(`${exp}P2`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ablauf am Zettersfeld */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
            {t("stepTitle")}
          </h2>
          <div className="mt-5 section-divider !mx-0" />
          <p className="mt-6 text-base text-content-body leading-relaxed font-light">
            {t("stepIntro")}
          </p>

          <ol className="mt-10 space-y-4">
            {STEPS.map((step, i) => (
              <li key={step} className="glass-card p-6 flex gap-5 border-l-2 border-accent-500/20">
                <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-accent-500/10 text-accent-500 font-bold text-sm">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-content-primary">
                    {t(`${step}Title`)}
                  </h3>
                  <p className="mt-2 text-sm text-content-body leading-relaxed font-light">
                    {r(`${step}P`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Treffpunkt & Anreise */}
      <section className="py-16 lg:py-24">
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
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <Link
                href="/anreise"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent-500 hover:text-accent-400 transition-colors"
              >
                {t("meetLink")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/tandemflug-hochstein"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent-500 hover:text-accent-400 transition-colors"
              >
                {t("otherStartLink")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
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
                  {t(`faq${topic}A`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-E-A-T */}
      <section className="py-16 lg:py-24">
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
      <section className="py-12 lg:py-16 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/tandemflug-lienz", key: "Lienz" },
              { href: "/paragleiten", key: "Hochstein" },
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
      <section className="relative py-20 lg:py-28 overflow-hidden">
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
