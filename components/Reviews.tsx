"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import ScrollReveal from "./ScrollReveal";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  sourceUrl: string;
}

const reviews: Review[] = [
  {
    name: "Tripadvisor-Gast",
    rating: 5,
    text: "Awesome experience! Daniel and Rene are awesome instructors who are happy to explain every detail of the experience! The flight itself was on a beautiful day, the takeoff was smooth as butter and the same goes for the landing. Whilst we were flying we got a whole tour of Lienz and the surroundings.",
    date: "2024-07-01",
    sourceUrl:
      "https://www.tripadvisor.com/ShowUserReviews-g230011-d8720066-r966364553-Gleitschirm_Tandemflug_com-Lienz_Tirol_Austrian_Alps.html",
  },
  {
    name: "Tripadvisor-Gast",
    rating: 5,
    text: "Dieses wunderbare Erlebnis wurde von Anfang bis Ende sehr professionell und sehr freundlich auf unsere Bed\u00FCrfnisse zugeschnitten. Alles wurde im Detail erkl\u00E4rt, sodass keine Fragen offen blieben. Der Flug war ein Traum und sehr informativ. Die Fotos und kleinen Videos, die Daniel Kofler w\u00E4hrend des Fluges gemacht hat, sind eine Erinnerung f\u00FCrs Leben.",
    date: "2023-09-01",
    sourceUrl:
      "https://www.tripadvisor.de/ShowUserReviews-g230011-d8720066-r509188385-Gleitschirm_Tandemflug-Lienz_Tirol_Austrian_Alps.html",
  },
  {
    name: "Tripadvisor-Gast",
    rating: 5,
    text: "Voll de Honisch! Hervorragende Betreuung, super sympathisch. Jederzeit wieder. Absolut empfehlenswert. Bei Daniel f\u00FChlt man sich absolut sicher und optimal aufgehoben. Danke danke danke!!!",
    date: "2023-06-01",
    sourceUrl:
      "https://www.tripadvisor.de/ShowUserReviews-g230011-d8720066-r488133272-Gleitschirm_Tandemflug-Lienz_Tirol_Austrian_Alps.html",
  },
  {
    name: "Tripadvisor-Gast",
    rating: 5,
    text: "Einfach klasse! Die Piloten sind gut drauf und machen gleichzeitig einen professionellen Eindruck. Me and my kids had a lifetime experience \u2013 we will never forget this. The team is very keen on safety so it felt all very good to go up the mountain and fly.",
    date: "2023-03-01",
    sourceUrl:
      "https://www.tripadvisor.de/ShowUserReviews-g230011-d8720066-r377728147-Gleitschirm_Tandemflug-Lienz_Tirol_Austrian_Alps.html",
  },
];

const TRUNCATE = 110;

const dateLocaleMap: Record<string, string> = {
  de: "de-AT",
  en: "en-US",
  nl: "nl-NL",
};

function ReviewCard({ review, locale }: { review: Review; locale: string }) {
  const t = useTranslations("Reviews");
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > TRUNCATE;
  const text =
    !expanded && long
      ? review.text.slice(0, TRUNCATE).trimEnd() + "\u2026"
      : review.text;

  return (
    <article className="glass-card card-hover-glow rounded-2xl p-8 flex flex-col">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
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
      <p className="text-sm text-content-strong leading-relaxed font-light flex-1">
        {text}
      </p>
      {long && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-medium text-accent-400 hover:text-accent-500 self-start transition-colors cursor-pointer tracking-wide uppercase"
        >
          {expanded ? t("readLess") : t("readMore")}
        </button>
      )}
      <div className="mt-5 pt-5 border-t border-edge-subtle">
        <p className="text-xs font-medium text-content-strong tracking-wide">
          {review.name}
        </p>
        <time className="text-[11px] text-content-subtle" dateTime={review.date}>
          {new Date(review.date).toLocaleDateString(dateLocaleMap[locale] || locale, {
            year: "numeric",
            month: "long",
          })}
        </time>
      </div>
    </article>
  );
}

function RatingBadge() {
  const t = useTranslations("Reviews");
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Count-up animation with easeOutExpo
  useEffect(() => {
    if (!visible) return;
    const target = 250;
    const duration = 2000;
    const startTime = performance.now();
    let raf: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return (
    <div className="mb-8 flex justify-center">
      <div
        ref={ref}
        className={`inline-flex items-center gap-4 glass-card rounded-full px-8 py-4 border border-accent-500/20 shadow-[0_0_30px_rgba(232,104,48,0.1)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.92]"
        }`}
      >
        {/* Animated stars — pop in one by one */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 text-accent-500 ${visible ? "star-pop-in" : "star-init"}`}
              style={{ animationDelay: `${300 + i * 120}ms` }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Score */}
        <span className="text-2xl font-bold text-accent-500 tracking-tight">5,0</span>

        {/* Divider */}
        <span className="w-px h-6 bg-[var(--border-default)]" aria-hidden="true" />

        {/* Animated counter + text */}
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-content-strong tracking-tight">
            {t("reviewsCount", { count })}
          </span>
          <span className="text-xs text-content-muted">{t("topActivity")}</span>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const t = useTranslations("Reviews");
  const locale = useLocale();

  return (
    <section id="bewertungen" className="relative py-16 lg:py-24 overflow-hidden scroll-mt-20">
      {/* Glow orb */}
      <div className="glow-orb glow-orb-sky w-[500px] h-[500px] top-20 right-0 animate-glow-pulse" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-6">
          <p className="text-sm tracking-premium uppercase text-accent-500 font-semibold">
            {t("tagline")}
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black text-content-primary tracking-tight">
            {t("title")}
          </h2>
          <div className="mt-4 section-divider" />
        </ScrollReveal>

        {/* Rating badge — self-animated */}
        <RatingBadge />

        {/* Review grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <ReviewCard review={review} locale={locale} />
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal className="mt-8 text-center">
          <a
            href="https://www.tripadvisor.com/Attraction_Review-g230011-d8720066-Reviews-Gleitschirm_Tandemflug_com-Lienz_Tirol_Austrian_Alps.html"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("allReviewsLabel")}
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-content-subtle hover:text-accent-400 transition-colors"
          >
            {t("allReviews")}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
