"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookieInfoSeen")) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("cookieInfoSeen", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-4 lg:p-6 hero-enter hero-enter-1">
      <div className="max-w-xl mx-auto glass-card rounded-xl px-5 py-4 flex items-center gap-4 shadow-lg border border-edge-faint">
        <p className="flex-1 text-xs text-content-muted font-light leading-relaxed">
          {t("text")}{" "}
          <Link
            href="/datenschutz"
            className="text-accent-500 hover:text-accent-400 underline underline-offset-2 font-medium"
          >
            {t("link")}
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 px-4 py-2 text-xs font-medium tracking-wide uppercase bg-accent-500 hover:bg-accent-400 text-white rounded-lg transition-colors"
        >
          {t("button")}
        </button>
      </div>
    </div>
  );
}
