"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

interface Review {
  name: string;
  rating: number;
  text: Record<string, string>;
  date: string;
  sourceUrl: string;
}

const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g230011-d8720066-Reviews-Gleitschirm_Tandemflug_com-Lienz_Tirol_Austrian_Alps.html";

const reviews: Review[] = [
  {
    name: "Carmen S.",
    rating: 5,
    text: {
      de: "Der Tandemflug war einfach traumhaft! Schon der Start und der Weg dorthin waren ein Erlebnis, und dann dieses Gefühl, hoch oben über der Region zu gleiten – unbeschreiblich. Die Aussicht war atemberaubend, man konnte die Landschaft in voller Schönheit genießen. Alles war super organisiert, ich habe mich die ganze Zeit sicher und bestens betreut gefühlt. Absolute Empfehlung für alle, die etwas Besonderes erleben wollen – ein echtes Wow-Erlebnis!",
      en: "The tandem flight was simply amazing! Even the start and the way up were an experience, and then that feeling of gliding high above the region – indescribable. The view was breathtaking, you could enjoy the landscape in all its beauty. Everything was perfectly organized, I felt safe and well looked after the entire time. Absolute recommendation for anyone who wants to experience something special – a true wow experience!",
      nl: "De tandemvlucht was gewoon fantastisch! Al de start en de weg ernaartoe waren een belevenis, en dan dat gevoel om hoog boven de regio te zweven – onbeschrijflijk. Het uitzicht was adembenemend, je kon het landschap in al zijn schoonheid bewonderen. Alles was perfect georganiseerd, ik voelde me de hele tijd veilig en uitstekend begeleid. Absolute aanrader voor iedereen die iets bijzonders wil beleven – een echt wow-erlebnis!",
    },
    date: "2025-09-01",
    sourceUrl: TRIPADVISOR_URL,
  },
  {
    name: "Georg K.",
    rating: 5,
    text: {
      de: "Einfach unvergesslich! Die Tandempiloten waren super lieb, mega erfahren und haben einem vom ersten Moment an ein absolut sicheres Gefühl gegeben. Bei traumhaftem Wetter durch die Lüfte zu gleiten war der Wahnsinn – können wir jedem nur empfehlen!",
      en: "Simply unforgettable! The tandem pilots were incredibly kind, hugely experienced and gave you an absolutely safe feeling from the very first moment. Gliding through the skies in perfect weather was incredible – we can only recommend it to everyone!",
      nl: "Gewoon onvergetelijk! De tandempiloten waren super lief, enorm ervaren en gaven je vanaf het eerste moment een absoluut veilig gevoel. Bij prachtig weer door de lucht zweven was waanzinnig – we kunnen het iedereen aanbevelen!",
    },
    date: "2025-08-01",
    sourceUrl: TRIPADVISOR_URL,
  },
  {
    name: "Familie Övermann",
    rating: 5,
    text: {
      de: "Alles hat wunderbar gepasst!! Angefangen mit dem schönen Gutschein, der zu uns nach Hause punktgenau zum Geburtstag unseres Sohnes geschickt wurde bis hin zur persönlichen Termin-Absprache vor Ort war es durchweg eine sehr sympathische und verlässliche Absprache. Der Flug verlief dann sehr feinfühlig und empathisch, anfängliche Nervosität war schnell verflogen. Digital begleitet mit Live-Standort, Bild vom Abflugsort sowie Kurzvideo während des Fluges. Der Blick über Lienz und die umliegenden Bergketten sind ein Traum!! Ganz herzlichen Dank für dieses tolle Erlebnis!!",
      en: "Everything came together wonderfully!! Starting with the beautiful voucher that was sent to our home right on time for our son's birthday, through to the personal appointment arrangements on site – it was a consistently friendly and reliable experience. The flight itself was very sensitive and empathetic, initial nervousness quickly disappeared. Digitally accompanied with live location, a photo from the launch site and a short video during the flight. The view over Lienz and the surrounding mountain ranges is a dream!! Heartfelt thanks for this amazing experience!!",
      nl: "Alles klopte perfect!! Vanaf de mooie cadeaubon die precies op tijd voor de verjaardag van onze zoon naar huis werd gestuurd tot de persoonlijke afspraak ter plaatse – het was een door en door sympathieke en betrouwbare ervaring. De vlucht verliep zeer gevoelig en empathisch, de aanvankelijke zenuwen waren snel verdwenen. Digitaal begeleid met live locatie, foto van de startplaats en een kort filmpje tijdens de vlucht. Het uitzicht over Lienz en de omliggende bergketens is een droom!! Heel hartelijk dank voor deze geweldige ervaring!!",
    },
    date: "2025-08-01",
    sourceUrl: TRIPADVISOR_URL,
  },
  {
    name: "Christina S.",
    rating: 5,
    text: {
      de: "Ein voller Erfolg, bin dem ganzen Team echt dankbar. Aber nicht nur wegen dem Flug sondern auch weil ich vom Bahnhof geholt, wieder zurückgebracht wurde und schöne Fotos gemacht wurden. Aber eine große positive Überraschung war, da ich gerne dichte, dass die Piloten nach dem Flug mit mir gereimt haben. All das sind keine Witze – euer ganzes Team ist spitze. So komme ich gerne ein weiteres Mal, weil durch viel Spaß und Freude seid ihr genial.",
      en: "A complete success, I'm truly grateful to the whole team. Not just because of the flight, but also because I was picked up from the train station, brought back, and beautiful photos were taken. But a big positive surprise was that, since I love writing poetry, the pilots rhymed with me after the flight. None of this is a joke – your whole team is top-notch. I'll gladly come again, because with so much fun and joy, you're simply brilliant.",
      nl: "Een volledig succes, ik ben het hele team echt dankbaar. Niet alleen vanwege de vlucht, maar ook omdat ik van het station werd gehaald, weer teruggebracht en er mooie foto's werden gemaakt. Maar een grote positieve verrassing was dat, omdat ik graag dicht, de piloten na de vlucht met mij hebben gerijmd. Dit alles is geen grap – jullie hele team is top. Zo kom ik graag nog een keer, want met zoveel plezier en vreugde zijn jullie geniaal.",
    },
    date: "2025-08-01",
    sourceUrl: TRIPADVISOR_URL,
  },
];

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
  const count = useCountUp(250, inView);

  const baseStat =
    "bg-white border border-[var(--border-default)] rounded-2xl p-5 sm:p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10"
    >
      {/* Stat 1 — Rating */}
      <div
        className={`${baseStat} border-accent-500 bg-gradient-to-b from-white to-[#fff7f1] flex flex-col items-center justify-center`}
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
          <Image
            src="/images/tripadvisor-tc-badge-left-aligned.png"
            alt={t("travelersChoiceAlt")}
            width={2000}
            height={784}
            className="h-12 sm:h-14 w-auto"
            loading="lazy"
            sizes="(max-width: 640px) 144px, 168px"
          />
        </a>
        <div className="mt-3 text-xs text-content-muted text-center max-w-[220px]">
          {t("statAwardSub")}
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
