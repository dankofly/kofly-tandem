import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const SITE_URL = "https://gleitschirm-tandemflug.com";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("impressumTitle"),
    description: t("impressumDescription"),
    robots: { index: false, follow: true },
    alternates: {
      languages: {
        de: `${SITE_URL}/impressum`,
        en: `${SITE_URL}/en/impressum`,
        nl: `${SITE_URL}/nl/impressum`,
        "x-default": `${SITE_URL}/impressum`,
      },
    },
  };
}

export default function ImpressumPage() {
  return (
    <section className="pt-32 pb-28 lg:pt-40 lg:pb-40">
      <div className="max-w-2xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-xs text-content-subtle font-light">
            <li>
              <Link href="/" className="hover:text-accent-400 transition-colors">
                Startseite
              </Link>
            </li>
            <li aria-hidden="true" className="text-content-faint">/</li>
            <li className="text-content-strong font-medium">Impressum</li>
          </ol>
        </nav>

        <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
          Rechtliches
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
          Impressum
        </h1>
        <div className="mt-6 section-divider !mx-0" />

        <div className="mt-10 space-y-8 text-sm text-content-body leading-relaxed font-light">
          <p className="text-xs text-content-muted">
            Angaben gem{"\u00E4"}{"\u00DF"} {"\u00A7"} 5 E-Commerce-Gesetz (ECG), {"\u00A7"} 14 Unternehmensgesetzbuch (UGB) sowie Offenlegung gem{"\u00E4"}{"\u00DF"} {"\u00A7"} 25 Mediengesetz
          </p>

          {/* Medieninhaber */}
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Medieninhaber und f{"\u00FC"}r den Inhalt verantwortlich
            </h2>
            <div className="mt-2 section-divider !mx-0 !w-12" />
            <p className="mt-4">
              <strong className="text-content-strong">Daniel Kofler</strong>
            </p>
          </div>

          {/* Unternehmenssitz / Kontakt */}
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Unternehmenssitz / Kontakt
            </h2>
            <div className="mt-2 section-divider !mx-0 !w-12" />
            <div className="mt-4 space-y-1">
              <p><strong className="text-content-strong">Daniel Kofler</strong></p>
              <p>Thal-Aue 95</p>
              <p>9911 Assling</p>
              <p>{"\u00D6"}sterreich</p>
            </div>
            <div className="mt-4 space-y-1">
              <p>
                Tel.:{" "}
                <a href="tel:+436767293888" className="text-accent-400 hover:text-accent-500 transition-colors">
                  +43 676 7293 888
                </a>
              </p>
              <p>
                E-Mail:{" "}
                <a href="mailto:info@gleitschirm-tandemflug.com" className="text-accent-400 hover:text-accent-500 transition-colors">
                  info@gleitschirm-tandemflug.com
                </a>
              </p>
              <p>
                Internet:{" "}
                <a href="https://gleitschirm-tandemflug.com" className="text-accent-400 hover:text-accent-500 transition-colors">
                  gleitschirm-tandemflug.com
                </a>
              </p>
            </div>
          </div>

          {/* Unternehmensgegenstand */}
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Unternehmensgegenstand
            </h2>
            <div className="mt-2 section-divider !mx-0 !w-12" />
            <p className="mt-4">
              Gewerbliche Durchf{"\u00FC"}hrung von Tandemfl{"\u00FC"}gen (Gleitschirm-Tandem Paragleiten) im Rahmen der gesetzlichen Bestimmungen f{"\u00FC"}r Luftfahrtunternehmen.
            </p>
          </div>

          {/* Zuständige Aufsichtsbehörde */}
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Zust{"\u00E4"}ndige Aufsichtsbeh{"\u00F6"}rde
            </h2>
            <div className="mt-2 section-divider !mx-0 !w-12" />
            <div className="mt-4 space-y-1">
              <p><strong className="text-content-strong">Austro Control GmbH</strong></p>
              <p>Schnirchgasse 17</p>
              <p>1030 Wien</p>
              <p>
                <a href="https://www.austrocontrol.at" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-500 transition-colors">
                  www.austrocontrol.at
                </a>
              </p>
            </div>
          </div>

          {/* Kammerzugehörigkeit */}
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Kammerzugeh{"\u00F6"}rigkeit
            </h2>
            <div className="mt-2 section-divider !mx-0 !w-12" />
            <div className="mt-4 space-y-1">
              <p>Wirtschaftskammer {"\u00D6"}sterreich (WKO)</p>
              <p>Fachgruppe: Luftfahrtunternehmen</p>
            </div>
          </div>

          {/* Gerichtsstand */}
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Gerichtsstand
            </h2>
            <div className="mt-2 section-divider !mx-0 !w-12" />
            <p className="mt-4">Bezirksgericht Lienz</p>
          </div>

          {/* Haftungsausschluss */}
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Haftungsausschluss
            </h2>
            <div className="mt-2 section-divider !mx-0 !w-12" />
            <div className="mt-4 space-y-4">
              <p>
                Trotz sorgf{"\u00E4"}ltiger inhaltlicher Kontrolle {"\u00FC"}bernehmen wir keine Haftung f{"\u00FC"}r die Inhalte externer Links. F{"\u00FC"}r den Inhalt der verlinkten Seiten sind ausschlie{"\u00DF"}lich deren Betreiber verantwortlich.
              </p>
              <p>
                Die Inhalte dieser Website wurden mit gr{"\u00F6"}{"\u00DF"}tm{"\u00F6"}glicher Sorgfalt erstellt. F{"\u00FC"}r die Richtigkeit, Vollst{"\u00E4"}ndigkeit und Aktualit{"\u00E4"}t der Inhalte wird jedoch keine Haftung {"\u00FC"}bernommen.
              </p>
            </div>
          </div>

          {/* Urheberrecht */}
          <div>
            <h2 className="text-lg font-semibold text-content-primary">
              Urheberrecht
            </h2>
            <div className="mt-2 section-divider !mx-0 !w-12" />
            <p className="mt-4">
              Die Inhalte dieser Website (Texte, Bilder, Videos, Grafiken) unterliegen dem Urheberrecht. Jede Verwendung, Vervielf{"\u00E4"}ltigung oder Weitergabe bedarf der ausdr{"\u00FC"}cklichen schriftlichen Zustimmung des Rechteinhabers.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-content-subtle hover:text-accent-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Zur{"\u00FC"}ck zur Startseite
          </Link>
        </div>
      </div>
    </section>
  );
}
