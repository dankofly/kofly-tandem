"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQGroup {
  category: string;
  items: FAQItem[];
}

export default function FAQ() {
  const t = useTranslations("FAQ");
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqGroups: FAQGroup[] = [
    {
      category: t("cat1"),
      items: [
        { q: t("q1_1"), a: t("a1_1") },
        { q: t("q1_2"), a: t("a1_2") },
        { q: t("q1_3"), a: t("a1_3") },
        { q: t("q1_4"), a: t("a1_4") },
      ],
    },
    {
      category: t("cat2"),
      items: [
        { q: t("q2_1"), a: t("a2_1") },
        { q: t("q2_2"), a: t("a2_2") },
        { q: t("q2_3"), a: t("a2_3") },
        { q: t("q2_4"), a: t("a2_4") },
      ],
    },
    {
      category: t("cat3"),
      items: [
        { q: t("q3_1"), a: t("a3_1") },
        { q: t("q3_2"), a: t("a3_2") },
        { q: t("q3_3"), a: t("a3_3") },
        { q: t("q3_4"), a: t("a3_4") },
        { q: t("q3_5"), a: t("a3_5") },
      ],
    },
    {
      category: t("cat4"),
      items: [
        { q: t("q4_1"), a: t("a4_1") },
        { q: t("q4_2"), a: t("a4_2") },
        { q: t("q4_3"), a: t("a4_3") },
        { q: t("q4_4"), a: t("a4_4") },
        { q: t("q4_5"), a: t("a4_5") },
        { q: t("q4_6"), a: t("a4_6") },
      ],
    },
    {
      category: t("cat5"),
      items: [
        { q: t("q5_1"), a: t("a5_1") },
        { q: t("q5_2"), a: t("a5_2") },
      ],
    },
  ];

  const toggleCategory = (gi: number) => {
    if (openCategory === gi) {
      setOpenCategory(null);
      setOpenItem(null);
    } else {
      setOpenCategory(gi);
      setOpenItem(null);
    }
  };

  return (
    <section id="faq" className="relative py-16 lg:py-24 bg-surface-secondary overflow-hidden scroll-mt-20">
      {/* Glow orb */}
      <div className="glow-orb glow-orb-sky w-[400px] h-[400px] top-1/2 -left-40 animate-glow-pulse" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-10">
          <p className="text-sm tracking-premium uppercase text-accent-500 font-semibold">
            {t("tagline")}
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black text-content-primary tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm text-content-muted font-normal max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="mt-5 section-divider" />
        </ScrollReveal>

        {/* Category Accordion */}
        <ScrollReveal className="space-y-3" delay={100}>
          {faqGroups.map((group, gi) => {
            const isCatOpen = openCategory === gi;
            return (
              <div
                key={group.category}
                className={`rounded-2xl border transition-all duration-300 ${
                  isCatOpen
                    ? "glass-card border-accent-500/20 shadow-glow-accent"
                    : "glass-card card-hover-glow"
                }`}
              >
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(gi)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group cursor-pointer"
                  aria-expanded={isCatOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${isCatOpen ? "bg-accent-500" : "bg-content-subtle"}`} />
                    <span className="text-base font-bold text-content-primary group-hover:text-accent-400 transition-colors">
                      {group.category}
                    </span>
                    <span className="text-xs text-content-subtle font-light">
                      ({group.items.length})
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-content-subtle transition-transform duration-300 flex-shrink-0 ${
                      isCatOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Inner FAQ accordion */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isCatOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-4 divide-y divide-edge-subtle">
                    {group.items.map((faq, fi) => {
                      const key = `${gi}-${fi}`;
                      const isOpen = openItem === key;
                      return (
                        <div key={key}>
                          <button
                            onClick={() => setOpenItem(isOpen ? null : key)}
                            className="w-full flex items-center justify-between py-4 text-left group cursor-pointer"
                            aria-expanded={isOpen}
                          >
                            <span className="text-sm font-semibold text-content-strong pr-6 group-hover:text-accent-400 transition-colors leading-snug">
                              {faq.q}
                            </span>
                            <span
                              className={`text-content-subtle transition-transform duration-300 flex-shrink-0 ${
                                isOpen ? "rotate-45" : ""
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </span>
                          </button>
                          <div className={`accordion-content ${isOpen ? "open" : ""}`}>
                            <div>
                              <p className="pb-4 text-sm text-content-muted leading-relaxed font-light whitespace-pre-line">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
