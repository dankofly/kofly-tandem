import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const SITE_URL = "https://www.gleitschirm-tandemflug.com";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("datenschutzTitle"),
    description: t("datenschutzDescription"),
    robots: { index: false, follow: true },
    alternates: {
      languages: {
        de: `${SITE_URL}/de/datenschutz`,
        en: `${SITE_URL}/en/datenschutz`,
        nl: `${SITE_URL}/nl/datenschutz`,
        "x-default": `${SITE_URL}/de/datenschutz`,
      },
    },
  };
}

export default function DatenschutzPage() {
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
            <li className="text-content-strong font-medium">Datenschutz</li>
          </ol>
        </nav>

        <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
          Rechtliches
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
          Datenschutzerkl{"\u00E4"}rung
        </h1>
        <div className="mt-6 section-divider !mx-0" />

        <div className="mt-10 space-y-8 text-sm text-content-body leading-relaxed font-light">
          {/* TODO: Replace with actual DSGVO-compliant privacy policy */}

          <h2 className="text-lg font-semibold text-content-primary !mt-12">
            Verantwortlicher
          </h2>
          <p>
            Gleitschirm-Tandemflug.com
            <br />
            Telefon:{" "}
            <a href="tel:+436767293888" className="text-accent-400 hover:text-accent-500 transition-colors">
              +43 676 7293888
            </a>
            <br />
            E-Mail:{" "}
            <a
              href="mailto:info@Gleitschirm-Tandemflug.com"
              className="text-accent-400 hover:text-accent-500 transition-colors"
            >
              info@Gleitschirm-Tandemflug.com
            </a>
          </p>

          <h2 className="text-lg font-semibold text-content-primary !mt-12">
            Erhebung und Verarbeitung personenbezogener Daten
          </h2>
          <p>
            {/* TODO: Insert actual data processing details */}
            [Datenschutzerkl{"\u00E4"}rung gem{"\u00E4"}{"\u00DF"} DSGVO / DSG hier einf{"\u00FC"}gen. Beschreibe
            insbesondere die Verarbeitung von Daten aus dem Kontaktformular,
            Buchungsanfragen, Gutscheinbestellungen, sowie ggf. eingesetzte
            Analyse-Tools.]
          </p>

          <h2 className="text-lg font-semibold text-content-primary !mt-12">
            Kontaktformular &amp; Buchungsanfragen
          </h2>
          <p>
            Wenn du {"\u00FC"}ber unser Kontaktformular eine Buchungsanfrage oder
            Gutscheinbestellung sendest, werden die von dir eingegebenen Daten
            (Name, E-Mail, Telefon, Nachricht und weitere Angaben) zum Zweck der
            Bearbeitung deiner Anfrage gespeichert. Diese Daten werden nicht ohne
            deine Einwilligung weitergegeben.
          </p>

          <h2 className="text-lg font-semibold text-content-primary !mt-12">
            Deine Rechte
          </h2>
          <p>
            Du hast das Recht auf Auskunft, Berichtigung, L{"\u00F6"}schung,
            Einschr{"\u00E4"}nkung der Verarbeitung, Daten{"\u00FC"}bertragbarkeit und Widerspruch.
            Wende dich daf{"\u00FC"}r an:{" "}
            <a
              href="mailto:info@Gleitschirm-Tandemflug.com"
              className="text-accent-400 hover:text-accent-500 transition-colors"
            >
              info@Gleitschirm-Tandemflug.com
            </a>
          </p>

          <h2 className="text-lg font-semibold text-content-primary !mt-12">
            Cookies &amp; Analyse
          </h2>
          <p>
            {/* TODO: Insert cookie / analytics details */}
            [Details zu eingesetzten Cookies und Analyse-Tools hier einf{"\u00FC"}gen.]
          </p>
        </div>
      </div>
    </section>
  );
}
