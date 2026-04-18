import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  breadcrumbSchema,
  faqSchema,
  packageProductSchema,
} from "@/lib/schema";

const SITE_URL = "https://gleitschirm-tandemflug.com";

const rich = {
  b: (chunks: ReactNode) => (
    <strong className="font-semibold text-content-strong">{chunks}</strong>
  ),
};

const FAQ_TOPICS = ["Duration", "Weather", "Voucher", "DiffThermik"] as const;
const FEATURES = ["1", "2", "3"] as const;
const STEPS = ["1", "2", "3", "4"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("premiumflugTitle"),
    description: t("premiumflugDescription"),
    openGraph: {
      title: t("premiumflugOgTitle"),
      description: t("premiumflugOgDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("premiumflugOgTitle"),
      description: t("premiumflugOgDescription"),
    },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/premiumflug`,
        en: `${SITE_URL}/en/premiumflug`,
        nl: `${SITE_URL}/nl/premiumflug`,
        "x-default": `${SITE_URL}/de/premiumflug`,
      },
    },
  };
}

export default async function PremiumflugPage() {
  const t = await getTranslations("Premiumflug");
  const locale = await getLocale();
  const r = (key: string) => t.rich(key, rich);

  const breadcrumbs = breadcrumbSchema([
    { name: t("breadcrumbHome"), url: `${SITE_URL}/${locale}` },
    { name: t("breadcrumbCurrent"), url: `${SITE_URL}/${locale}/premiumflug` },
  ]);

  const product = packageProductSchema({
    name: "Premium Tandemflug Osttirol – KOFLY",
    description: t("heroP2").replace(/<\/?b>/g, ""),
    price: "190.00",
    url: `${SITE_URL}/${locale}/premiumflug`,
  });

  const faqItems = FAQ_TOPICS.map((topic) => ({
    name: t(`faq${topic}Q`),
    text: t(`faq${topic}A`),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }} />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="glow-orb glow-orb-accent w-[500px] h-[500px] -top-40 -right-40 opacity-40 animate-glow-pulse" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-xs text-content-subtle font-light">
              <li><Link href="/" className="hover:text-accent-400 transition-colors">{t("breadcrumbHome")}</Link></li>
              <li aria-hidden="true" className="text-content-faint">/</li>
              <li className="text-content-strong font-medium">{t("breadcrumbCurrent")}</li>
            </ol>
          </nav>
          <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">{t("heroTagline")}</p>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-content-primary tracking-tight leading-[1.15] text-balance">
            {t("heroTitle")}
            <span className="shimmer-text text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400">{t("heroTitleAccent")}</span>
          </h1>
          <p className="mt-3 text-sm text-content-muted font-light tracking-wide">{t("heroSubtitle")}</p>
          <div className="mt-6 section-divider !mx-0" />
          <div className="mt-8 space-y-5 text-base sm:text-lg text-content-body leading-relaxed font-light">
            <p>{t("heroP1")}</p>
            <p>{r("heroP2")}</p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/buchen" className="cta-lift btn-glow inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors">{t("ctaBook")}</Link>
            <Link href="/gutschein" className="cta-lift inline-flex items-center justify-center px-8 py-4 border border-edge-secondary text-content-body hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors">{t("ctaVoucher")}</Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">{t("featuresTitle")}</h2>
          <div className="mt-5 section-divider !mx-0" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f} className="glass-card card-hover-glow p-6 h-full border-accent-500/20">
                <h3 className="text-lg font-bold text-content-primary">{t(`feature${f}Title`)}</h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">{t(`feature${f}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card border-accent-500/20 p-6 sm:p-10 border-l-2">
            <h2 className="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">{t("commitmentTitle")}</h2>
            <p className="mt-5 text-base text-content-body leading-relaxed font-light">{t("commitmentText")}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">{t("processTitle")}</h2>
          <div className="mt-5 section-divider !mx-0" />
          <ol className="mt-10 space-y-4">
            {STEPS.map((s) => (
              <li key={s} className="flex items-start gap-4 glass-card p-5">
                <span className="text-2xl font-bold text-accent-500/40 leading-none shrink-0">0{s}</span>
                <p className="text-sm text-content-body leading-relaxed font-light">{t(`processStep${s}`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">{t("faqTitle")}</h2>
          <div className="mt-5 section-divider !mx-0" />
          <div className="mt-10 space-y-4">
            {FAQ_TOPICS.map((topic) => (
              <div key={topic} className="glass-card p-6 border-l-2 border-accent-500/20">
                <h3 className="text-sm font-semibold text-content-primary">{t(`faq${topic}Q`)}</h3>
                <p className="mt-3 text-sm text-content-body leading-relaxed font-light">{t(`faq${topic}A`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 overflow-hidden bg-surface-secondary">
        <div className="glow-orb glow-orb-accent w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-glow-pulse" aria-hidden="true" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary">{t("ctaTitle")}</h2>
          <p className="mt-4 text-base text-content-body font-light">{t("ctaP")}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/buchen" className="cta-lift btn-glow w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors">{t("ctaBook")}</Link>
            <Link href="/gutschein" className="cta-lift w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-edge-secondary text-content-body hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors">{t("ctaVoucher")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
