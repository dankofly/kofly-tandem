import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-surface-primary border-t border-edge-faint">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20">

        {/* ── Mobile: compact layout ── */}
        <div className="sm:hidden space-y-6">

          {/* Brand block */}
          <div className="text-center">
            <Link
              href="/"
              className="text-lg font-extrabold tracking-premium uppercase text-content-primary"
            >
              KOFLY
            </Link>
            <p className="mt-2 text-xs text-content-subtle leading-relaxed font-light max-w-[260px] mx-auto">
              {t("brand")}
            </p>
          </div>

          {/* Contact CTAs */}
          <div className="flex gap-3">
            <a
              href="tel:+436767293888"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-secondary border border-edge-faint text-content-muted hover:text-accent-400 hover:border-accent-500/30 transition-all text-sm font-medium min-h-[44px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent-500 shrink-0">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
              </svg>
              {t("anrufen")}
            </a>
            <a
              href="mailto:info@Gleitschirm-Tandemflug.com"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-secondary border border-edge-faint text-content-muted hover:text-accent-400 hover:border-accent-500/30 transition-all text-sm font-medium min-h-[44px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent-500 shrink-0">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              {t("email")}
            </a>
          </div>

          {/* Social proof badge + Instagram */}
          <div className="flex items-center justify-between px-1">
            {/* Google rating badge */}
            <a
              href="https://g.page/r/CaGNb8TkNHIKEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 text-accent-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-content-muted group-hover:text-accent-400 transition-colors">
                <span className="font-semibold text-content-primary">5.0</span>{" "}
                · 284+ {t("bewertungen")}
              </span>
            </a>

            {/* Instagram link */}
            <a
              href="https://www.instagram.com/tandemfluglienz/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-hover w-9 h-9 rounded-full border border-edge-faint bg-surface-secondary flex items-center justify-center text-content-faint hover:text-accent-400 hover:border-accent-500/30 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-edge-faint" />

          {/* Nav + Buchen in two columns */}
          <div className="grid grid-cols-2 gap-x-8">
            {/* Navigation column */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-premium text-content-faint mb-3">
                {t("navigation")}
              </h4>
              <ul className="space-y-2.5">
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
                      className="text-[13px] text-content-muted hover:text-accent-400 transition-colors font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Buchen column */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-premium text-content-faint mb-3">
                {t("buchen")}
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: t("terminAnfragen"), href: "/buchen" },
                  { label: t("classicflug"), href: "/classicflug" },
                  { label: t("premiumflug"), href: "/premiumflug" },
                  { label: t("thermikflug"), href: "/thermikflug" },
                  { label: t("gutschein"), href: "/gutschein" },
                  { label: t("tandemflugOsttirol"), href: "/tandemflug-osttirol" },
                  { label: t("paragleiten"), href: "/paragleiten" },
                  { label: t("sicherheit"), href: "/sicherheit" },
                  { label: t("urlaubOsttirol"), href: "/urlaub" },
                  { label: t("anreise"), href: "/anreise" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-content-muted hover:text-accent-400 transition-colors font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
