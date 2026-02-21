import { useTranslations } from "next-intl";

const ROUTES = [
  "sillian",
  "matrei",
  "kals",
  "obertilliach",
  "stjakob",
  "spittal",
  "winklern",
] as const;

export default function TravelTimeTable() {
  const t = useTranslations("Anreise");

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-edge-faint text-xs uppercase tracking-wider text-content-muted">
              <th className="pb-3 pr-4 font-medium">{t("tableOrigin")}</th>
              <th className="pb-3 pr-4 font-medium">{t("tableDrive")}</th>
              <th className="pb-3 pr-4 font-medium">{t("tableDistance")}</th>
              <th className="pb-3 font-medium">{t("tableTransport")}</th>
            </tr>
          </thead>
          <tbody className="text-content-body font-light">
            {ROUTES.map((route) => (
              <tr
                key={route}
                className="border-b border-edge-faint/50 hover:bg-surface-secondary/50 transition-colors"
              >
                <td className="py-3 pr-4 font-medium text-content-primary">
                  {t(`${route}Origin`)}
                </td>
                <td className="py-3 pr-4">{t(`${route}Drive`)}</td>
                <td className="py-3 pr-4">{t(`${route}Distance`)}</td>
                <td className="py-3 text-content-muted text-xs">
                  {t(`${route}Tip`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {ROUTES.map((route) => (
          <div
            key={route}
            className="glass-card p-4 space-y-1"
          >
            <p className="font-medium text-content-primary text-sm">
              {t(`${route}Origin`)}
            </p>
            <div className="flex items-center gap-3 text-xs text-content-body">
              <span>{t(`${route}Drive`)}</span>
              <span className="text-content-faint">|</span>
              <span>{t(`${route}Distance`)}</span>
            </div>
            <p className="text-xs text-content-muted">{t(`${route}Tip`)}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-content-muted font-light">
        {t("tableNote")}
      </p>
    </>
  );
}
