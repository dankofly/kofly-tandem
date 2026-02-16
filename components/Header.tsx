"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: t("erlebnis"), href: "/#erlebnis" },
    { label: t("ablauf"), href: "/ablauf" },
    { label: t("bewertungen"), href: "/#bewertungen" },
    { label: t("pakete"), href: "/#pakete" },
    { label: t("agb"), href: "/agb" },
  ];

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--bg-header)] backdrop-blur-xl border-b border-edge-faint"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-base font-extrabold tracking-premium uppercase text-hero transition-colors duration-300"
          >
            KOFLY
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label={t("hauptnavigation")}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-semibold tracking-wide uppercase text-hero-secondary hover:text-hero transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+436767293888"
              className="text-[13px] font-semibold tracking-wide text-hero-secondary hover:text-hero transition-colors duration-300"
              aria-label={t("callLabel")}
            >
              +43 676 7293888
            </a>
            <Link
              href="/buchen"
              className="btn-glow inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-[13px] font-bold tracking-wide uppercase bg-accent-500 hover:bg-accent-400 text-white transition-all duration-300"
            >
              {t("anfragen")}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-hero transition-colors"
            aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
            aria-expanded={menuOpen}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className={`block h-px bg-current transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-[7.5px]" : ""
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="bg-[var(--bg-header-mobile)] backdrop-blur-xl border-t border-edge-faint">
          <nav className="max-w-6xl mx-auto px-6 py-6 space-y-0.5" aria-label={t("mobileNavigation")}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-base text-content-body font-semibold hover:text-accent-400 transition-colors border-b border-edge-faint"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-5 flex items-center justify-between">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/buchen"
                onClick={() => setMenuOpen(false)}
                className="btn-glow block text-center px-6 py-3 rounded-lg bg-accent-500 text-white text-[13px] font-bold tracking-wide uppercase"
              >
                {t("anfragen")}
              </Link>
              <a
                href="tel:+436767293888"
                className="block text-center px-6 py-3 rounded-lg border border-edge text-content-body text-[13px] font-semibold tracking-wide uppercase"
              >
                +43 676 7293888
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
