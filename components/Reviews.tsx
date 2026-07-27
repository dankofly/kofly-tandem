"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { REVIEWS, REVIEW_QUOTES as reviews, TRIPADVISOR_URL, type Review } from "@/lib/reviews-config";


const TRUNCATE = 110;

const dateLocaleMap: Record<string, string> = {
  de: "de-AT",
  en: "en-US",
  nl: "nl-NL",
};

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useCountUp(target: number, active: boolean, durationMs = 1800) {
  // Mit dem Zielwert initialisieren, damit SSR/no-JS (und Crawler) die echte
  // Zahl sehen statt "0" — die Animation überschreibt den Wert am Client.
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!active) return;
    const startTime = performance.now();
    let raf: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, durationMs]);
  return value;
}

function StarsRow({ size = "w-4 h-4" }: { size?: string }) {
  return (
    <div className="flex gap-0.5" aria-label="5 von 5 Sternen">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${size} text-accent-500`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StatsStrip() {
  const t = useTranslations("Reviews");
  const { ref, inView } = useInView(0.2);
  const count = useCountUp(REVIEWS.countUpTarget, inView);

  const baseStat =
    "bg-[var(--bg-input)] border border-[var(--border-default)] rounded-2xl p-5 sm:p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10"
    >
      {/* Stat 1 — Rating (highlight via accent border + subtle accent ring) */}
      <div
        className={`${baseStat} !border-accent-500 ring-1 ring-accent-500/20 flex flex-col items-center justify-center`}
      >
        <div className="text-4xl sm:text-5xl font-black text-accent-500 tracking-tight leading-none">
          5,0
        </div>
        <div className="mt-2 flex justify-center">
          <StarsRow size="w-3.5 h-3.5" />
        </div>
        <div className="mt-2 text-xs text-content-muted">
          {t("statReviewsLabel", { count })}
        </div>
      </div>

      {/* Stat 2 — Ranking */}
      <div className={`${baseStat} flex flex-col items-center justify-center`}>
        <div className="text-4xl sm:text-5xl font-black text-accent-500 tracking-tight leading-none">
          Nr. 1
        </div>
        <div className="mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-content-strong">
          {t("statRankingLabel")}
        </div>
        <div className="mt-1 text-xs text-content-muted">
          {t("statRankingSub")}
        </div>
      </div>

      {/* Stat 3 — Award */}
      <div className={`${baseStat} flex flex-col items-center justify-center`}>
        <a
          href={TRIPADVISOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("travelersChoiceAlt")}
          className="cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          {/* Light-theme badge (black text) */}
          <Image
            src="/images/tripadvisor-tc-badge-left-aligned.png"
            alt={t("travelersChoiceAlt")}
            width={2000}
            height={784}
            className="theme-asset-light h-12 sm:h-14 w-auto"
            loading="lazy"
            sizes="(max-width: 640px) 144px, 168px"
          />
          {/* Dark-theme badge (white text) */}
          <Image
            src="/images/tripadvisor-tc-badge-left-aligned-white.png"
            alt=""
            aria-hidden="true"
            width={2000}
            height={784}
            className="theme-asset-dark h-12 sm:h-14 w-auto"
            loading="lazy"
            sizes="(max-width: 640px) 144px, 168px"
          />
        </a>
        <div className="mt-3 text-xs text-content-muted text-center max-w-[260px] leading-relaxed">
          {t.rich("statAwardSub", { br: () => <br /> })}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review, locale }: { review: Review; locale: string }) {
  const t = useTranslations("Reviews");
  const [expanded, setExpanded] = useState(false);
  const fullText = review.text[locale] || review.text.de;
  const long = fullText.length > TRUNCATE;
  const text =
    !expanded && long
      ? fullText.slice(0, TRUNCATE).trimEnd() + "…"
      : fullText;

  const formattedDate = new Date(review.date).toLocaleDateString(
    dateLocaleMap[locale] || locale,
    { year: "numeric", month: "long" }
  );

  return (
    <article className="glass-card card-hover-glow rounded-2xl p-6 sm:p-8 flex flex-col hover:-translate-y-1 transition-transform duration-300">
      <div className="mb-4">
        <StarsRow />
      </div>
      <p className="text-sm text-content-strong leading-relaxed font-light flex-1">
        {text}
      </p>
      {long && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-medium text-accent-400 hover:text-accent-500 self-start transition-colors cursor-pointer tracking-wide uppercase py-1"
        >
          {expanded ? t("readLess") : t("readMore")}
        </button>
      )}
      <div className="mt-5 pt-5 border-t border-edge-subtle flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-accent-500/15 text-accent-500 text-xs font-bold flex items-center justify-center shrink-0">
          {review.name.charAt(0)}
        </span>
        <div>
          <p className="text-xs font-medium text-content-strong tracking-wide">
            {review.name}
          </p>
          <time
            className="text-[11px] text-content-subtle"
            dateTime={review.date}
            suppressHydrationWarning
          >
            {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
}

export default function Reviews() {
  const t = useTranslations("Reviews");
  const locale = useLocale();

  return (
    <section
      id="bewertungen"
      className="relative py-14 sm:py-16 lg:py-24 overflow-hidden scroll-mt-20"
    >
      {/* Glow orb */}
      <div
        className="glow-orb glow-orb-sky w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] top-20 right-0 opacity-70 animate-glow-pulse"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-2">
          <p className="text-sm tracking-premium uppercase text-accent-500 font-semibold">
            {t("tagline")}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
            {t("title")}
          </h2>
          <div className="mt-4 section-divider" />
        </ScrollReveal>

        {/* Stats strip — Variante J: 3 boxes (Rating · Ranking · Award) */}
        <ScrollReveal>
          <StatsStrip />
        </ScrollReveal>

        {/* Review cards grid (4 cards, original style) */}
        <div className="mt-6 sm:mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, i) => (
            <ScrollReveal key={review.name} delay={i * 100}>
              <ReviewCard review={review} locale={locale} />
            </ScrollReveal>
          ))}
        </div>

        {/* CTAs */}
        <ScrollReveal className="mt-8 flex flex-col items-center gap-3">
          <a
            href={TRIPADVISOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("allReviewsLabel")}
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-content-subtle hover:text-accent-400 transition-colors"
          >
            {t("allReviews")}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </a>
          <a
            href="https://g.page/r/CaGNb8TkNHIKEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("googleReviewsLabel")}
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-content-subtle hover:text-accent-400 transition-colors"
          >
            {t("googleReviews")}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
