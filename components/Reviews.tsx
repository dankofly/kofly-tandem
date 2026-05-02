"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

interface Review {
  name: string;
  featured: Record<string, string>;
  date: string;
}

const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g230011-d8720066-Reviews-Gleitschirm_Tandemflug_com-Lienz_Tirol_Austrian_Alps.html";

const reviews: Review[] = [
  {
    name: "Carmen S.",
    featured: {
      de: "Hoch oben über der Region zu gleiten — unbeschreiblich. Alles war super organisiert, ich habe mich sicher gefühlt.",
      en: "Gliding high above the region — indescribable. Everything was perfectly organized, I felt safe the entire time.",
      nl: "Hoog boven de regio zweven — onbeschrijflijk. Alles was perfect georganiseerd, ik voelde me veilig.",
    },
    date: "2025-09-01",
  },
  {
    name: "Georg K.",
    featured: {
      de: "Die Tandempiloten waren super lieb, mega erfahren und haben einem vom ersten Moment an ein absolut sicheres Gefühl gegeben.",
      en: "The tandem pilots were incredibly kind, hugely experienced and gave you an absolutely safe feeling from the very first moment.",
      nl: "De tandempiloten waren super lief, enorm ervaren en gaven je vanaf het eerste moment een absoluut veilig gevoel.",
    },
    date: "2025-08-01",
  },
  {
    name: "Familie Övermann",
    featured: {
      de: "Sehr feinfühliger Flug, anfängliche Nervosität war schnell verflogen. Der Blick über Lienz ist ein Traum!",
      en: "Very sensitive flight, initial nervousness quickly disappeared. The view over Lienz is a dream!",
      nl: "Zeer gevoelige vlucht, aanvankelijke zenuwen waren snel verdwenen. Het uitzicht over Lienz is een droom!",
    },
    date: "2025-08-01",
  },
];

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
  const [value, setValue] = useState(0);
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

function Stars({ size = "text-base" }: { size?: string }) {
  return (
    <div className={`flex gap-0.5 justify-center ${size}`} aria-label="5 von 5 Sternen">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-[1em] h-[1em] text-accent-500"
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
  const count = useCountUp(250, inView);

  const baseStat =
    "bg-white border border-[var(--border-default)] rounded-2xl p-5 sm:p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10"
    >
      {/* Stat 1 — Rating (highlight) */}
      <div
        className={`${baseStat} border-accent-500 bg-gradient-to-b from-white to-[#fff7f1] flex flex-col items-center justify-center`}
      >
        <div className="text-4xl sm:text-5xl font-black text-accent-500 tracking-tight leading-none">
          5,0
        </div>
        <div className="mt-2">
          <Stars size="text-sm" />
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
          <Image
            src="/images/tripadvisor-travelers-choice-2026-pin.png"
            alt={t("travelersChoiceAlt")}
            width={400}
            height={400}
            className="h-[60px] sm:h-[68px] w-auto"
            loading="lazy"
            sizes="68px"
          />
        </a>
        <div className="mt-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-content-strong">
          Travelers&apos; Choice
        </div>
        <div className="mt-1 text-xs text-content-muted">
          {t("statAwardSub")}
        </div>
      </div>
    </div>
  );
}

function FeaturedQuote({
  review,
  locale,
  isLast,
}: {
  review: Review;
  locale: string;
  isLast: boolean;
}) {
  const text = review.featured[locale] || review.featured.de;
  const dateLocale = dateLocaleMap[locale] || locale;
  const formattedDate = new Date(review.date).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "short",
  });

  return (
    <article
      className={`flex flex-col px-1 ${
        isLast
          ? ""
          : "md:pr-6 lg:pr-8 md:border-r md:border-[var(--border-default)]"
      } pb-6 md:pb-0 ${
        isLast ? "" : "border-b border-[var(--border-default)] md:border-b-0"
      }`}
    >
      <Stars size="text-[13px]" />
      <p className="font-editorial italic text-base sm:text-[17px] leading-relaxed text-content-strong mt-3">
        <span aria-hidden="true">“</span>
        {text}
        <span aria-hidden="true">”</span>
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-content-muted">
        <span className="font-semibold text-content-strong">{review.name}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={review.date} suppressHydrationWarning>
          {formattedDate}
        </time>
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

        {/* Stats strip */}
        <ScrollReveal>
          <StatsStrip />
        </ScrollReveal>

        {/* Featured quotes block */}
        <ScrollReveal>
          <div className="mt-6 sm:mt-8 bg-white border border-[var(--border-default)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {reviews.map((review, i) => (
              <FeaturedQuote
                key={review.name}
                review={review}
                locale={locale}
                isLast={i === reviews.length - 1}
              />
            ))}
          </div>
        </ScrollReveal>

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
