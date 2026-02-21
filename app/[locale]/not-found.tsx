"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  function openKofly() {
    // ChatBot widget button is rendered in the layout — click it to open
    const btn = document.querySelector<HTMLButtonElement>(
      'button[aria-label*="Kofly"]'
    );
    if (btn) {
      btn.click();
    }
  }

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center py-20 overflow-hidden">
      {/* Background glow */}
      <div
        className="glow-orb glow-orb-accent w-[500px] h-[500px] top-1/4 left-1/2 -translate-x-1/2 animate-glow-pulse"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        {/* Big 404 */}
        <p className="text-[8rem] sm:text-[10rem] font-black leading-none tracking-tighter text-accent-500/20 select-none">
          404
        </p>

        {/* Hook */}
        <h1 className="mt-[-1.5rem] text-3xl sm:text-4xl font-black tracking-tight text-content-primary">
          {t("title")}
        </h1>

        <p className="mt-3 text-lg text-content-secondary font-medium">
          {t("subtitle")}
        </p>

        <p className="mt-4 text-sm text-content-tertiary leading-relaxed">
          {t("description")}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-lg btn-glow"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            {t("backHome")}
          </Link>

          <button
            onClick={openKofly}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent-500/40 hover:border-accent-500 text-accent-500 font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
            </svg>
            {t("askKofly")}
          </button>
        </div>
      </div>
    </section>
  );
}
