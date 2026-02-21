import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema, flightAreaSchemas } from "@/lib/schema";
import ScrollReveal from "@/components/ScrollReveal";

const SITE_URL = "https://gleitschirm-tandemflug.com";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

const TANDEM_AREAS = ["zettersfeld", "hochstein"] as const;
const PILOT_PUSTERTAL = ["thurntaler", "golzentipp"] as const;
const PILOT_ISELTAL = ["goldried", "praegraten", "virgen"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("paragleitenTitle"),
    description: t("paragleitenDescription"),
    openGraph: {
      title: t("paragleitenOgTitle"),
      description: t("paragleitenOgDescription"),
    },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/paragleiten`,
        en: `${SITE_URL}/en/paragleiten`,
        nl: `${SITE_URL}/nl/paragleiten`,
        "x-default": `${SITE_URL}/de/paragleiten`,
      },
    },
  };
}

export default async function ParagleitenPage() {
  const t = await getTranslations("Paragleiten");
  const locale = await getLocale();
  const r = (key: string) => t.rich(key, rich);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    {
      name: t("breadcrumbCurrent"),
      url: `${SITE_URL}/${locale}/paragleiten`,
    },
  ]);

  const areaSchemas = flightAreaSchemas();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
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

      {/* Tandem vs. Solo */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("tandemVsSoloTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
          </ScrollReveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <ScrollReveal delay={0}>
              <div className="glass-card card-hover-glow p-6 h-full border-accent-500/20">
                <span className="text-xs tracking-premium uppercase text-accent-500 font-medium">
                  Tandem
                </span>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {r("tandemVsSoloP1")}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="glass-card card-hover-glow p-6 h-full">
                <span className="text-xs tracking-premium uppercase text-content-muted font-medium">
                  Solo
                </span>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">
                  {r("tandemVsSoloP2")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Beste Jahreszeit */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("seasonTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <div className="mt-6 space-y-5 text-base text-content-body leading-relaxed font-light">
              <p>{r("seasonP1")}</p>
              <p>{r("seasonP2")}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tandemfluggebiete */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("tandemAreasTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base text-content-body leading-relaxed font-light">
              {t("tandemAreasIntro")}
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {TANDEM_AREAS.map((area, i) => (
              <ScrollReveal key={area} delay={i * 100}>
                <div className="glass-card card-hover-glow p-6 sm:p-8 h-full border-accent-500/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-content-primary">
                      {t(`${area}Name`)}
                    </h3>
                    <span className="text-xs font-medium text-accent-500 bg-accent-500/10 px-2 py-1 rounded">
                      {t(`${area}Alt`)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs tracking-premium uppercase text-content-muted font-medium">
                    {t(`${area}Tag`)}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-content-body leading-relaxed font-light">
                    <p>{r(`${area}P1`)}</p>
                    <p>{r(`${area}P2`)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fluggebiete Pustertal */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("pilotPustertalTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base text-content-body leading-relaxed font-light">
              {t("pilotPustertalIntro")}
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {PILOT_PUSTERTAL.map((area, i) => (
              <ScrollReveal key={area} delay={i * 100}>
                <div className="glass-card card-hover-glow p-6 sm:p-8 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-content-primary">
                      {t(`${area}Name`)}
                    </h3>
                    <span className="text-xs font-medium text-accent-500 bg-accent-500/10 px-2 py-1 rounded">
                      {t(`${area}Alt`)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs tracking-premium uppercase text-content-muted font-medium">
                    {t(`${area}Tag`)}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-content-body leading-relaxed font-light">
                    <p>{r(`${area}P1`)}</p>
                    <p>{r(`${area}P2`)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fluggebiete Iseltal */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("pilotIseltalTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <p className="mt-6 text-base text-content-body leading-relaxed font-light">
              {t("pilotIseltalIntro")}
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILOT_ISELTAL.map((area, i) => (
              <ScrollReveal key={area} delay={i * 100}>
                <div className="glass-card card-hover-glow p-6 sm:p-8 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-content-primary">
                      {t(`${area}Name`)}
                    </h3>
                    <span className="text-xs font-medium text-accent-500 bg-accent-500/10 px-2 py-1 rounded">
                      {t(`${area}Alt`)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs tracking-premium uppercase text-content-muted font-medium">
                    {t(`${area}Tag`)}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-content-body leading-relaxed font-light">
                    <p>{r(`${area}P1`)}</p>
                    <p>{r(`${area}P2`)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Weitere Fluggebiete + Tandem-CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("moreAreasTitle")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />
            <div className="mt-6 space-y-5 text-base text-content-body leading-relaxed font-light">
              <p>{t("moreAreasP1")}</p>
              <p>{t("moreAreasP2")}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-12 glass-card border-accent-500/20 p-6 sm:p-10">
              <h3 className="text-xl font-bold text-content-primary">
                {t("tandemFromAreasTitle")}
              </h3>
              <p className="mt-4 text-sm text-content-body leading-relaxed font-light">
                {t("tandemFromAreasP")}
              </p>
              <div className="mt-6">
                <Link
                  href="/buchen"
                  className="cta-lift btn-glow inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors"
                >
                  {t("ctaTermin")}
                </Link>
              </div>
            </div>
          </ScrollReveal>
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
            {(["Safety", "Clothing", "Media"] as const).map((topic) => (
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

      {/* E-E-A-T: Sicherheit & Transparenz */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
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
          </ScrollReveal>
        </div>
      </section>

      {/* Cross-Links */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-2">
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
            <Link href="/anreise" className="block group">
              <div className="glass-card card-hover-glow p-6 h-full">
                <h3 className="text-lg font-semibold text-content-primary group-hover:text-accent-400 transition-colors">
                  {t("crosslinkAnreiseTitle")}
                </h3>
                <p className="mt-2 text-sm text-content-body font-light">
                  {t("crosslinkAnreiseP")}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 lg:py-40 overflow-hidden bg-surface-secondary">
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
