import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { GOOGLE_REVIEW_URL, TRIPADVISOR_URL } from "@/lib/reviews-config";

type Props = { params: Promise<{ locale: string }> };

/**
 * Bewertungs-Bruecke.
 *
 * Zweck: Der Moment direkt nach der Landung ist der einzige, in dem Gaeste
 * wirklich bereit sind zu bewerten. Diese Seite haengt am QR-Schild am
 * Landeplatz Gaimberg und an der WhatsApp-Nachricht vom Flugabend, und
 * bringt von dort in einem Tap ins Google-Formular.
 *
 * Warum eine Seite und nicht der rohe Google-Link auf dem QR:
 *  - gleitschirm-tandemflug.com/bewerten kann man vorlesen, tippen und in
 *    WhatsApp verschicken, den writereview-Link mit Place-ID nicht.
 *  - Wechselt der Ziel-Link (z.B. auf einen g.page-Kurzlink), aendert sich
 *    eine Konstante. Gedruckte Schilder bleiben gueltig.
 *  - Gaeste ohne Google-Konto bekommen hier eine Alternative statt einer
 *    Sackgasse.
 *
 * noindex: Utility-Seite, kein Suchziel. Sie soll die Content-Seiten nicht
 * verwaessern und taucht nicht in der Sitemap auf (lib/routes.ts).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metadata");
  return {
    ...(await buildPageMetadata({
      locale,
      path: "/bewerten",
      title: t("bewertenTitle"),
      description: t("bewertenDescription"),
    })),
    robots: { index: false, follow: true },
  };
}

export default async function BewertenPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Bewerten");

  return (
    <section className="pt-32 pb-28 lg:pt-40 lg:pb-40">
      <div className="container-page">
        <p className="text-xs tracking-premium uppercase text-accent-500 font-semibold">
          {t("overline")}
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
          {t("title")}
        </h1>
        <div className="mt-5 section-divider !mx-0" />

        <p className="mt-8 text-base sm:text-lg text-content-body leading-relaxed font-light">
          {t("intro")}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-lift btn-glow inline-flex items-center justify-center gap-3 px-8 py-5 bg-accent-500 hover:bg-accent-400 text-white text-sm font-semibold tracking-wide uppercase transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
            </svg>
            {t("ctaGoogle")}
          </a>
          <p className="text-sm text-content-muted font-light">{t("ctaNote")}</p>
        </div>

        <p className="mt-12 text-sm text-content-body leading-relaxed font-light">
          {t("noAccount")}{" "}
          <a
            href={TRIPADVISOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-500 hover:text-accent-400 underline underline-offset-4 transition-colors"
          >
            {t("tripadvisorLink")}
          </a>
          .
        </p>

        <p className="mt-10 text-sm text-content-muted font-light">
          <Link
            href="/"
            className="text-accent-500 hover:text-accent-400 transition-colors"
          >
            {t("backHome")}
          </Link>
        </p>
      </div>
    </section>
  );
}
