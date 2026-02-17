import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getImageUrl } from "@/lib/images-config";
import { breadcrumbSchema } from "@/lib/schema";

const SITE_URL = "https://www.gleitschirm-tandemflug.com";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("ablaufTitle"),
    description: t("ablaufDescription"),
    alternates: {
      languages: {
        de: `${SITE_URL}/de/ablauf`,
        en: `${SITE_URL}/en/ablauf`,
        nl: `${SITE_URL}/nl/ablauf`,
        "x-default": `${SITE_URL}/de/ablauf`,
      },
    },
  };
}

export default async function AblaufPage() {
  const t = await getTranslations("Ablauf");
  const locale = await getLocale();

  const r = (key: string) => t.rich(key, rich);

  const [ablaufHero, ablaufFlug, ablaufLanding] = await Promise.all([
    getImageUrl("ablauf-hero"),
    getImageUrl("ablauf-flug"),
    getImageUrl("ablauf-landing"),
  ]);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("breadcrumbCurrent"), url: `${SITE_URL}/${locale}/ablauf` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {/* -- Hero: Emotion & Sehnsucht -- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {ablaufHero && (
          <Image
            src={ablaufHero}
            alt="Tandemflug Ablauf"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
        )}
        <div className="glow-orb glow-orb-accent w-[500px] h-[500px] -top-40 -right-40 opacity-40 animate-glow-pulse" />
        <div className="glow-orb glow-orb-sky w-[400px] h-[400px] -bottom-32 -left-32 opacity-30 animate-glow-pulse [animation-delay:2s]" />

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
              <li className="text-content-strong font-medium">{t("breadcrumbCurrent")}</li>
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
            <p>{r("heroP3")}</p>
          </div>
        </div>
      </section>

      {/* -- Sicherheit & Erfahrung -- */}
      <section className="py-20 lg:py-28 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card border-accent-500/30 p-8 sm:p-10">
            <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
              {t("safetyTagline")}
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">
              {t("safetyTitle")}
            </h2>
            <div className="mt-6 section-divider !mx-0" />

            <div className="mt-8 space-y-5 text-base text-content-body leading-relaxed font-light">
              <p>{r("safetyP1")}</p>
              <p>{r("safetyP2")}</p>
              <p>{r("safetyP3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 01: Kontaktaufnahme -- */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                01
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    01
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step01Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step01P1")}</p>
                  <p>{r("step01P2")}</p>
                </div>

                <div className="highlight-glow mt-6 bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
                  <p>{r("step01Hint")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 02: Voraussetzungen -- */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                02
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    02
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step02Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step02P1")}</p>
                  <p>{r("step02P2")}</p>
                  <p>{r("step02P3")}</p>
                  <p>{r("step02P4")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 03: Flugpaket -- */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                03
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    03
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step03Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step03P1")}</p>
                  <p>{r("step03P2")}</p>
                  <p>{r("step03P3")}</p>
                </div>

                <div className="highlight-glow mt-6 bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                    <span>{t("step03Premium")}</span>
                    <span className="text-content-strong font-medium">
                      {"\u20AC"}{"\u2009"}190
                    </span>
                    <span>{t("step03ClassicMedia")}</span>
                    <span className="text-content-strong font-medium">
                      {"\u20AC"}{"\u2009"}170
                    </span>
                    <span>{t("step03Classic")}</span>
                    <span className="text-content-strong font-medium">
                      {"\u20AC"}{"\u2009"}150
                    </span>
                    <span>{t("step03Thermik")}</span>
                    <span className="text-content-strong font-medium">
                      {"\u20AC"}{"\u2009"}250
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 04: Gutschein -- */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                04
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    04
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step04Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step04P1")}</p>
                  <p>{r("step04P2")}</p>
                </div>

                <div className="highlight-glow mt-6 bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
                  <p>{r("step04Hint")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 05: Terminplanung -- */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                05
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    05
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step05Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step05P1")}</p>
                  <p>{r("step05P2")}</p>
                  <p>{r("step05P3")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 06: Treffpunkt -- */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                06
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    06
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step06Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step06P1")}</p>
                  <p>{r("step06P2")}</p>
                </div>

                <div className="highlight-glow mt-6 bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
                  <p>{r("step06Hint")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 07: Vorbereitung -- */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                07
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    07
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step07Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step07P1")}</p>
                  <p>{r("step07P2")}</p>
                  <p>{r("step07P3")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 08: Der Flug (sensorisches Highlight) -- */}
      <section className="relative py-16 lg:py-24 bg-surface-secondary overflow-hidden">
        <div className="glow-orb glow-orb-accent w-[500px] h-[500px] top-1/2 -right-32 -translate-y-1/2 opacity-30 animate-glow-pulse" />

        <div className="relative max-w-3xl mx-auto px-6">
          <div className="step-card flight-card glass-card card-hover-glow border-accent-500/20 p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                08
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    08
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step08Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step08P1")}</p>
                  <p>{r("step08P2")}</p>
                  <p>{r("step08P3")}</p>
                </div>
                {ablaufFlug && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-edge-faint">
                    <Image
                      src={ablaufFlug}
                      alt={t("step08ImageAlt")}
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 09: Landung -- */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                09
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    09
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step09Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step09P1")}</p>
                  <p>{r("step09P2")}</p>
                  <p className="text-content-subtle text-xs">{r("step09P3")}</p>
                </div>
                {ablaufLanding && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-edge-faint">
                    <Image
                      src={ablaufLanding}
                      alt={t("step09ImageAlt")}
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Schritt 10: Bezahlung & Nachbetreuung -- */}
      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="step-card glass-card card-hover-glow p-8 sm:p-10">
            <div className="flex items-start gap-6">
              <span className="step-num hidden sm:block text-4xl lg:text-5xl font-bold text-accent-500/25 leading-none select-none shrink-0">
                10
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="sm:hidden text-2xl font-bold text-accent-500/40 leading-none">
                    10
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-content-primary">
                    {t("step10Title")}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 text-base text-content-body leading-relaxed font-light">
                  <p>{r("step10P1")}</p>
                  <p>{r("step10P2")}</p>
                </div>

                <div className="highlight-glow mt-6 bg-accent-500/5 border border-accent-500/20 rounded-sm px-5 py-4 text-sm text-content-body">
                  <p>{r("step10Hint")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Emotional Close + CTA -- */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <div className="glow-orb glow-orb-accent w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-glow-pulse" />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <p className="quote-float text-2xl sm:text-3xl font-bold text-content-primary italic">
            {t("closeQuote")}
          </p>
          <div className="mt-8 space-y-5 text-base sm:text-lg text-content-body leading-relaxed font-light">
            <p>{r("closeP1")}</p>
            <p>{r("closeP2")}</p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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

          <p className="mt-8 text-sm text-content-muted font-light">
            {t("contactDirect")}{" "}
            <a
              href="https://wa.me/436767293888"
              className="text-accent-400 hover:text-accent-500 transition-colors"
            >
              WhatsApp
            </a>{" "}
            unter{" "}
            <a
              href="tel:+436767293888"
              className="text-accent-400 hover:text-accent-500 transition-colors"
            >
              +43 676 7293888
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
