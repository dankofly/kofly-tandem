import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-surface-primary border-t border-edge-faint">
      <div className="max-w-5xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-base font-extrabold tracking-premium uppercase text-content-primary"
            >
              KOFLY
            </Link>
            <p className="mt-4 text-sm text-content-subtle leading-relaxed font-light">
              {t("brand")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-premium text-content-faint mb-4">
              {t("navigation")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t("erlebnis"), href: "/#erlebnis" },
                { label: t("ablauf"), href: "/ablauf" },
                { label: t("bewertungen"), href: "/#bewertungen" },
                { label: t("flugpakete"), href: "/#pakete" },
                { label: t("faq"), href: "/#faq" },
                { label: t("kontakt"), href: "/#kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-content-muted hover:text-accent-400 transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buchen */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-premium text-content-faint mb-4">
              {t("buchen")}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/buchen"
                  className="text-sm text-content-muted hover:text-accent-400 transition-colors font-light"
                >
                  {t("terminAnfragen")}
                </Link>
              </li>
              <li>
                <Link
                  href="/buchen#gutschein"
                  className="text-sm text-content-muted hover:text-accent-400 transition-colors font-light"
                >
                  {t("gutscheinBestellen")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-premium text-content-faint mb-4">
              {t("kontakt")}
            </h4>
            <div className="space-y-2.5">
              <a
                href="tel:+436767293888"
                className="block text-sm text-content-muted hover:text-accent-400 transition-colors font-light"
              >
                +43 676 7293888
              </a>
              <a
                href="mailto:info@Gleitschirm-Tandemflug.com"
                className="block text-sm text-content-muted hover:text-accent-400 transition-colors font-light"
              >
                info@Gleitschirm-Tandemflug.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-edge-faint">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-content-ghost font-light">
              Powered by{" "}
              <a
                href="https://hypeakz.io/"
                target="_blank"
                rel="noopener"
                className="text-content-faint hover:text-accent-400 transition-colors font-medium"
              >
                HYPEAKZ.IO
              </a>
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/impressum"
                className="text-xs text-content-faint hover:text-content-muted transition-colors font-light"
              >
                {t("impressum")}
              </Link>
              <Link
                href="/datenschutz"
                className="text-xs text-content-faint hover:text-content-muted transition-colors font-light"
              >
                {t("datenschutz")}
              </Link>
              <a
                href="/admin"
                className="text-content-ghost hover:text-content-muted transition-colors"
                aria-label="Admin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.295a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.295 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.295A1 1 0 011 11.18V9.82a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.53l1.25.834a6.957 6.957 0 011.416-.587l.295-1.473zM13 10a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile sticky CTA bar */}
      <div className="h-20 lg:h-0" />
    </footer>
  );
}
