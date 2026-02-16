"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import BookingForm from "@/components/BookingForm";
import VoucherForm from "@/components/VoucherForm";

const tabIds = ["termin", "gutschein"] as const;
type TabId = (typeof tabIds)[number];

export default function BuchenPage() {
  const t = useTranslations("Buchen");
  const [activeTab, setActiveTab] = useState<TabId>("termin");

  useEffect(() => {
    if (window.location.hash === "#gutschein") {
      setActiveTab("gutschein");
    }
  }, []);

  function handleTabChange(tabId: TabId) {
    setActiveTab(tabId);
    window.history.replaceState(
      null,
      "",
      tabId === "gutschein" ? "#gutschein" : "/buchen"
    );
  }

  const tabs = [
    { id: "termin" as const, label: t("tabTermin") },
    { id: "gutschein" as const, label: t("tabGutschein") },
  ];

  return (
    <>
      <section className="pt-32 pb-28 lg:pt-40 lg:pb-40">
        <div className="max-w-2xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-xs text-content-subtle font-light">
              <li>
                <Link href="/" className="hover:text-accent-400 transition-colors">
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-content-faint">/</li>
              <li className="text-content-strong font-medium">{t("breadcrumbCurrent")}</li>
            </ol>
          </nav>

          {/* Header */}
          <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
            {t("tagline")}
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
            {t("title")}
          </h1>
          <div className="mt-6 section-divider !mx-0" />

          <p className="mt-8 text-sm text-content-muted leading-relaxed font-light">
            {t("intro")}
          </p>

          {/* Tabs */}
          <div className="mt-12 flex border-b border-edge-subtle" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-4 text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "text-content-primary border-b-2 border-accent-500 -mb-px"
                    : "text-content-subtle hover:text-content-body"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-10">
            {activeTab === "termin" && (
              <div role="tabpanel" aria-label={t("tabTermin")}>
                <h2 className="text-lg font-semibold text-content-primary mb-2">
                  {t("terminTitle")}
                </h2>
                <p className="text-sm text-content-muted font-light mb-8">
                  {t("terminSubtitle")}
                </p>
                <BookingForm />
              </div>
            )}

            {activeTab === "gutschein" && (
              <div role="tabpanel" aria-label={t("tabGutschein")} id="gutschein">
                <h2 className="text-lg font-semibold text-content-primary mb-2">
                  {t("gutscheinTitle")}
                </h2>
                <p className="text-sm text-content-muted font-light mb-8">
                  {t("gutscheinSubtitle")}
                </p>
                <VoucherForm />
              </div>
            )}
          </div>

          {/* Contact fallback */}
          <div className="mt-16 border-t border-edge-subtle pt-10 text-center">
            <p className="text-xs text-content-subtle font-light">
              {t("contactDirect")}{" "}
              <a
                href="https://wa.me/436767293888"
                target="_blank"
                rel="noopener noreferrer"
                className="text-content-body font-medium hover:text-accent-400 transition-colors"
              >
                WhatsApp
              </a>{" "}
              oder{" "}
              <a
                href="tel:+436767293888"
                className="text-content-body font-medium hover:text-accent-400 transition-colors"
              >
                +43 676 7293888
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
