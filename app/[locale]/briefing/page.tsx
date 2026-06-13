import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: string }> };

const SITE_URL = "https://gleitschirm-tandemflug.com";

interface Step {
  title: string;
  body: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metadata");
  return {
    title: t("briefingTitle"),
    description: t("briefingDescription"),
    openGraph: {
      title: t("briefingOgTitle"),
      description: t("briefingOgDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("briefingOgTitle"),
      description: t("briefingOgDescription"),
    },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/briefing`,
        en: `${SITE_URL}/en/briefing`,
        nl: `${SITE_URL}/nl/briefing`,
        "x-default": `${SITE_URL}/de/briefing`,
      },
    },
  };
}

export default async function BriefingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Briefing");

  const breadcrumbs = breadcrumbSchema([
    { name: t("breadcrumbHome"), url: `${SITE_URL}/${locale}` },
    { name: t("breadcrumbCurrent"), url: `${SITE_URL}/${locale}/briefing` },
  ]);

  const steps = t.raw("steps") as Step[];
  const checklist = t.raw("checklist") as string[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

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
            {t("heroTitle")}{" "}
            <span className="shimmer-text text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400">{t("heroTitleAccent")}</span>
          </h1>
          <div className="mt-6 section-divider !mx-0" />
          <div className="mt-8 space-y-5 text-base sm:text-lg text-content-body leading-relaxed font-light">
            <p>{t("heroP1")}</p>
            <p>{t("heroP2")}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">{t("stepsTitle")}</h2>
          <div className="mt-5 section-divider !mx-0" />
          <ol className="mt-10 space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="glass-card p-6 border-l-2 border-accent-500/20">
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-sm font-bold text-accent-500 tabular-nums">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-content-primary">{step.title}</h3>
                    <p className="mt-2 text-sm text-content-body leading-relaxed font-light">{step.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight">{t("checklistTitle")}</h2>
          <div className="mt-5 section-divider !mx-0" />
          <p className="mt-6 text-base text-content-body font-light">{t("checklistIntro")}</p>
          <ul className="mt-8 space-y-3">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-4 glass-card">
                <svg className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-content-body font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card border-accent-500/20 p-6 sm:p-10 border-l-2">
            <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">{t("workflowTagline")}</p>
            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-content-primary tracking-tight">{t("workflowTitle")}</h2>
            <p className="mt-5 text-base text-content-body leading-relaxed font-light">{t("workflowText")}</p>
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="glow-orb glow-orb-accent w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-glow-pulse" aria-hidden="true" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary">{t("ctaTitle")}</h2>
          <p className="mt-4 text-base text-content-body font-light">{t("ctaP")}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/buchen" className="cta-lift btn-glow w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors">{t("ctaBook")}</Link>
            <a href="https://wa.me/436767293888" target="_blank" rel="noopener noreferrer" className="cta-lift w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-edge-secondary text-content-body hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors">WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
