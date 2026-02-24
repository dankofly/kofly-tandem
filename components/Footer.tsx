import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-surface-primary border-t border-edge-faint">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20">

        {/* ── Mobile: compact layout ── */}
        <div className="sm:hidden">
          {/* Brand + Contact row */}
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/"
                className="text-base font-extrabold tracking-premium uppercase text-content-primary"
              >
                KOFLY
              </Link>
              <p className="mt-2 text-xs text-content-subtle leading-relaxed font-light max-w-[200px]">
                {t("brand")}
              </p>
            </div>
            <div className="text-right space-y-1.5">
              <a
                href="tel:+436767293888"
                className="flex items-center justify-end gap-1.5 text-xs text-content-muted hover:text-accent-400 transition-colors font-light"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-accent-500">
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                </svg>
                +43 676 7293888
              </a>
              <a
                href="mailto:info@Gleitschirm-Tandemflug.com"
                className="flex items-center justify-end gap-1.5 text-xs text-content-muted hover:text-accent-400 transition-colors font-light"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-accent-500">
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
                info@Gleitschirm-Tandemflug.com
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-edge-faint" />

          {/* Nav + Buchen in two columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-premium text-content-faint mb-1">
              {t("navigation")}
            </h4>
            <h4 className="text-[11px] font-semibold uppercase tracking-premium text-content-faint mb-1">
              {t("buchen")}
            </h4>
            {/* Nav links */}
            <ul className="space-y-1.5">
              {[
                { label: t("erlebnis"), href: "/#erlebnis" },
                { label: t("ablauf"), href: "/ablauf" },
                { label: t("ueberUns"), href: "/ueber-uns" },
                { label: t("flugpakete"), href: "/#pakete" },
                { label: t("faq"), href: "/#faq" },
                { label: t("kontakt"), href: "/#kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-content-muted hover:text-accent-400 transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Buchen links */}
            <ul className="space-y-1.5">
              {[
                { label: t("terminAnfragen"), href: "/buchen" },
                { label: t("gutscheinBestellen"), href: "/buchen#gutschein" },
                { label: t("urlaubOsttirol"), href: "/urlaub" },
                { label: t("anreise"), href: "/anreise" },
                { label: t("paragleiten"), href: "/paragleiten" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-content-muted hover:text-accent-400 transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Desktop/Tablet: original 4-column grid ── */}
        <div className="hidden sm:grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
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
            <ul className="space-y-3">
              {[
                { label: t("erlebnis"), href: "/#erlebnis" },
                { label: t("ablauf"), href: "/ablauf" },
                { label: t("ueberUns"), href: "/ueber-uns" },
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
            <ul className="space-y-3">
              {[
                { label: t("terminAnfragen"), href: "/buchen" },
                { label: t("gutscheinBestellen"), href: "/buchen#gutschein" },
                { label: t("urlaubOsttirol"), href: "/urlaub" },
                { label: t("anreise"), href: "/anreise" },
                { label: t("paragleiten"), href: "/paragleiten" },
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

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-premium text-content-faint mb-4">
              {t("kontakt")}
            </h4>
            <div className="space-y-3">
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
        <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-edge-faint">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
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
