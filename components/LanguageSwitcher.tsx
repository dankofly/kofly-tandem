"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  de: "DE",
  en: "EN",
  nl: "NL",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Language">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span className="text-content-faint mx-0.5 text-[10px]" aria-hidden="true">|</span>
          )}
          <button
            onClick={() => switchLocale(l)}
            aria-current={locale === l ? "true" : undefined}
            className={`text-xs font-bold tracking-wide transition-colors duration-300 px-1 py-0.5 ${
              locale === l
                ? "text-accent-500"
                : "text-hero-secondary hover:text-hero"
            }`}
          >
            {localeLabels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
