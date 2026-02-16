import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const SITE_URL = "https://www.gleitschirm-tandemflug.com";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("agbTitle"),
    description: t("agbDescription"),
    alternates: {
      languages: {
        de: `${SITE_URL}/de/agb`,
        en: `${SITE_URL}/en/agb`,
        nl: `${SITE_URL}/nl/agb`,
        "x-default": `${SITE_URL}/de/agb`,
      },
    },
  };
}

export default async function AGBPage() {
  const t = await getTranslations("AGB");

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
        <div className="glow-orb glow-orb-accent w-[500px] h-[500px] -top-40 -right-40 opacity-40 animate-glow-pulse" />

        <div className="relative max-w-3xl mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-xs text-content-subtle font-light">
              <li>
                <Link href="/" className="hover:text-accent-400 transition-colors">
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-content-muted">{t("breadcrumbCurrent")}</li>
            </ol>
          </nav>

          <p className="text-sm tracking-premium uppercase text-accent-500 font-medium">
            {t("tagline")}
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-content-primary tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-content-muted font-light">
            {t("subtitle")}
          </p>
          <div className="mt-6 section-divider" />
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-20 lg:pb-28">
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="space-y-12">

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("generalTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("generalP1")}</p>
                <p>{t("generalP2")}</p>
                <p>{t("generalP3")}</p>
                <p>{t("generalP4")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("bookingTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("bookingP1")}</p>
                <p>{t("bookingP2")}</p>
                <p>{t("bookingP3")}</p>
                <p>{t("bookingP4")}</p>
                <p>{t("bookingP5")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("riskTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("riskP1")}</p>
                <p>{t("riskP2")}</p>
                <p>{t("riskP3")}</p>
                <p>{t("riskP4")}</p>
                <p className="font-medium text-content-strong">{t("riskListIntro")}</p>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                    {t("riskItem1")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                    {t("riskItem2")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                    {t("riskItem3")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                    {t("riskItem4")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                    {t("riskItem5")}
                  </li>
                </ul>
                <p>{t("riskP5")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("equipmentTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("equipmentP1")}</p>
                <p>{t("equipmentP2")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("insuranceTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("insuranceP1")}</p>
                <p>{t("insuranceP2")}</p>
                <p>{t("insuranceP3")}</p>
                <p>{t("insuranceP4")}</p>
                <p>{t("insuranceP5")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("photoTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("photoP1")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("rightsTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("rightsP1")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("voucherTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("voucherP1")}</p>
                <p>{t("voucherP2")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("cancelTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("cancelP1")}</p>
                <p>{t("cancelP2")}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-content-primary tracking-tight uppercase mb-4">
                {t("finalTitle")}
              </h2>
              <div className="space-y-4 text-sm text-content-body leading-relaxed font-light">
                <p>{t("finalP1")}</p>
                <p>{t("finalP2")}</p>
              </div>
            </div>

          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-edge-faint">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-500 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t("backToHome")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
