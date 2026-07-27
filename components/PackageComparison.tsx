import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

/**
 * Paketvergleich als echte Tabelle.
 *
 * Bis 2026-07-27 stand derselbe Vergleich auf allen drei Paketseiten als drei
 * Karten mit je einem punktgetrennten Fliesstext, dreifach dupliziert in den
 * Namespaces Classicflug, Premiumflug und Thermikflug. Inhalt unveraendert,
 * nur in Spalten zerlegt und in einen gemeinsamen Namespace gezogen.
 *
 * Tabellen sind die Struktur, die AI-Systeme am zuverlaessigsten extrahieren
 * (geo-citability). Auf schmalen Viewports scrollt sie horizontal, statt die
 * Seite zu sprengen.
 */

const ROWS = [
  { key: "classic", href: "/classicflug", label: "Classic" },
  { key: "premium", href: "/premiumflug", label: "Premium" },
  { key: "thermik", href: "/thermikflug", label: "Thermik" },
] as const;

export default async function PackageComparison({
  current,
}: {
  current: (typeof ROWS)[number]["key"];
}) {
  const t = await getTranslations("PaketVergleich");
  const cell = "px-4 py-3 text-sm text-content-body font-light align-top";

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <caption className="sr-only">{t("caption")}</caption>
        <thead>
          <tr className="border-b border-edge-faint">
            {["col1", "col2", "col3", "col4", "col5"].map((c) => (
              <th
                key={c}
                scope="col"
                className="px-4 py-3 text-[11px] font-semibold uppercase tracking-premium text-content-faint"
              >
                {t(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const active = row.key === current;
            return (
              <tr
                key={row.key}
                className={`border-b border-edge-faint last:border-0 ${
                  active ? "bg-surface-primary/60" : ""
                }`}
              >
                <th scope="row" className="px-4 py-3 align-top">
                  {active ? (
                    <span className="text-sm font-semibold text-accent-500">
                      {row.label}
                    </span>
                  ) : (
                    <Link
                      href={row.href}
                      className="text-sm font-semibold text-content-primary hover:text-accent-400 transition-colors"
                    >
                      {row.label}
                    </Link>
                  )}
                </th>
                <td className={cell}>{t(`${row.key}Zeit`)}</td>
                <td className={cell}>{t(`${row.key}Start`)}</td>
                <td className={`${cell} whitespace-nowrap`}>{t(`${row.key}Preis`)}</td>
                <td className={cell}>{t(`${row.key}Wen`)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
