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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-base font-extrabold tracking-premium uppercase text-hero transition-all duration-300 hover:scale-105"
          >
            KOFLY
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label={t("hauptnavigation")}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-underline text-[13px] font-semibold tracking-wide uppercase text-hero-secondary hover:text-hero transition-colors duration-300"
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

          {/* Mobile: KI + Burger */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => window.dispatchEvent(new Event("open-chat"))}
              className="relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-accent-500 hover:text-accent-400 transition-colors"
              aria-label="Kofly KI öffnen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 animate-[pulse_3s_ease-in-out_infinite]">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500" />
            </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-hero transition-colors"
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
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="bg-[var(--bg-header-mobile)] backdrop-blur-xl border-t border-edge-faint">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-6" aria-label={t("mobileNavigation")}>
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block py-3.5 text-base text-content-body font-semibold hover:text-accent-400 transition-colors border-b border-edge-faint min-h-[44px] ${menuOpen ? "menu-stagger" : ""}`}
                style={menuOpen ? { animationDelay: `${i * 60}ms` } : undefined}
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
