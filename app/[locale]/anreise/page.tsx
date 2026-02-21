import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema } from "@/lib/schema";
import ScrollReveal from "@/components/ScrollReveal";
import TravelTimeTable from "@/components/TravelTimeTable";

const SITE_URL = "https://gleitschirm-tandemflug.com";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
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

      {/* Parken & Treffpunkt */}
      <section className="py-16 lg:py-24">
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
          </div>

          <ScrollReveal>
            <div className="mt-6 glass-card p-5">
              <p className="text-sm text-content-body leading-relaxed font-light">
                {t("parkingHint")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Terminplanung & Wetter */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
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
