"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
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
      de: "Der Tandemflug war einfach traumhaft! Schon der Start und der Weg dorthin waren ein Erlebnis, und dann dieses Gef\u00fchl, hoch oben \u00fcber der Region zu gleiten \u2013 unbeschreiblich. Die Aussicht war atemberaubend, man konnte die Landschaft in voller Sch\u00f6nheit genie\u00dfen. Alles war super organisiert, ich habe mich die ganze Zeit sicher und bestens betreut gef\u00fchlt. Absolute Empfehlung f\u00fcr alle, die etwas Besonderes erleben wollen \u2013 ein echtes Wow-Erlebnis!",
      en: "The tandem flight was simply amazing! Even the start and the way up were an experience, and then that feeling of gliding high above the region \u2013 indescribable. The view was breathtaking, you could enjoy the landscape in all its beauty. Everything was perfectly organized, I felt safe and well looked after the entire time. Absolute recommendation for anyone who wants to experience something special \u2013 a true wow experience!",
      nl: "De tandemvlucht was gewoon fantastisch! Al de start en de weg ernaartoe waren een belevenis, en dan dat gevoel om hoog boven de regio te zweven \u2013 onbeschrijflijk. Het uitzicht was adembenemend, je kon het landschap in al zijn schoonheid bewonderen. Alles was perfect georganiseerd, ik voelde me de hele tijd veilig en uitstekend begeleid. Absolute aanrader voor iedereen die iets bijzonders wil beleven \u2013 een echt wow-erlebnis!",
    },
    date: "2025-09-01",
    sourceUrl: TRIPADVISOR_URL,
  },
  {
    name: "Georg K.",
    rating: 5,
    text: {
      de: "Einfach unvergesslich! Die Tandempiloten waren super lieb, mega erfahren und haben einem vom ersten Moment an ein absolut sicheres Gef\u00fchl gegeben. Bei traumhaftem Wetter durch die L\u00fcfte zu gleiten war der Wahnsinn \u2013 k\u00f6nnen wir jedem nur empfehlen!",
      en: "Simply unforgettable! The tandem pilots were incredibly kind, hugely experienced and gave you an absolutely safe feeling from the very first moment. Gliding through the skies in perfect weather was incredible \u2013 we can only recommend it to everyone!",
      nl: "Gewoon onvergetelijk! De tandempiloten waren super lief, enorm ervaren en gaven je vanaf het eerste moment een absoluut veilig gevoel. Bij prachtig weer door de lucht zweven was waanzinnig \u2013 we kunnen het iedereen aanbevelen!",
    },
    date: "2025-08-01",
    sourceUrl: TRIPADVISOR_URL,
  },
  {
    name: "Familie \u00d6vermann",
    rating: 5,
    text: {
      de: "Alles hat wunderbar gepasst!! Angefangen mit dem sch\u00f6nen Gutschein, der zu uns nach Hause punktgenau zum Geburtstag unseres Sohnes geschickt wurde bis hin zur pers\u00f6nlichen Termin-Absprache vor Ort war es durchweg eine sehr sympathische und verl\u00e4ssliche Absprache. Der Flug verlief dann sehr feinf\u00fchlig und empathisch, anf\u00e4ngliche Nervosit\u00e4t war schnell verflogen. Digital begleitet mit Live-Standort, Bild vom Abflugsort sowie Kurzvideo w\u00e4hrend des Fluges. Der Blick \u00fcber Lienz und die umliegenden Bergketten sind ein Traum!! Ganz herzlichen Dank f\u00fcr dieses tolle Erlebnis!!",
      en: "Everything came together wonderfully!! Starting with the beautiful voucher that was sent to our home right on time for our son\u2019s birthday, through to the personal appointment arrangements on site \u2013 it was a consistently friendly and reliable experience. The flight itself was very sensitive and empathetic, initial nervousness quickly disappeared. Digitally accompanied with live location, a photo from the launch site and a short video during the flight. The view over Lienz and the surrounding mountain ranges is a dream!! Heartfelt thanks for this amazing experience!!",
      nl: "Alles klopte perfect!! Vanaf de mooie cadeaubon die precies op tijd voor de verjaardag van onze zoon naar huis werd gestuurd tot de persoonlijke afspraak ter plaatse \u2013 het was een door en door sympathieke en betrouwbare ervaring. De vlucht verliep zeer gevoelig en empathisch, de aanvankelijke zenuwen waren snel verdwenen. Digitaal begeleid met live locatie, foto van de startplaats en een kort filmpje tijdens de vlucht. Het uitzicht over Lienz en de omliggende bergketens is een droom!! Heel hartelijk dank voor deze geweldige ervaring!!",
    },
    date: "2025-08-01",
    sourceUrl: TRIPADVISOR_URL,
  },
  {
    name: "Christina S.",
    rating: 5,
    text: {
      de: "Ein voller Erfolg, bin dem ganzen Team echt dankbar. Aber nicht nur wegen dem Flug sondern auch weil ich vom Bahnhof geholt, wieder zur\u00fcckgebracht wurde und sch\u00f6ne Fotos gemacht wurden. Aber eine gro\u00dfe positive \u00dcberraschung war, da ich gerne dichte, dass die Piloten nach dem Flug mit mir gereimt haben. All das sind keine Witze \u2013 euer ganzes Team ist spitze. So komme ich gerne ein weiteres Mal, weil durch viel Spa\u00df und Freude seid ihr genial.",
      en: "A complete success, I\u2019m truly grateful to the whole team. Not just because of the flight, but also because I was picked up from the train station, brought back, and beautiful photos were taken. But a big positive surprise was that, since I love writing poetry, the pilots rhymed with me after the flight. None of this is a joke \u2013 your whole team is top-notch. I\u2019ll gladly come again, because with so much fun and joy, you\u2019re simply brilliant.",
      nl: "Een volledig succes, ik ben het hele team echt dankbaar. Niet alleen vanwege de vlucht, maar ook omdat ik van het station werd gehaald, weer teruggebracht en er mooie foto\u2019s werden gemaakt. Maar een grote positieve verrassing was dat, omdat ik graag dicht, de piloten na de vlucht met mij hebben gerijmd. Dit alles is geen grap \u2013 jullie hele team is top. Zo kom ik graag nog een keer, want met zoveel plezier en vreugde zijn jullie geniaal.",
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

function ReviewCard({ review, locale }: { review: Review; locale: string }) {
  const t = useTranslations("Reviews");
  const [expanded, setExpanded] = useState(false);
  const fullText = review.text[locale] || review.text.de;
  const long = fullText.length > TRUNCATE;
  const text =
    !expanded && long
      ? fullText.slice(0, TRUNCATE).trimEnd() + "\u2026"
      : fullText;

  return (
    <article className="glass-card card-hover-glow rounded-2xl p-6 sm:p-8 flex flex-col hover:-translate-y-1 transition-transform duration-300">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-accent-500"
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
          className="mt-3 text-sm font-medium text-accent-400 hover:text-accent-500 self-start transition-colors cursor-pointer tracking-wide uppercase py-1"
        >
          {expanded ? t("readLess") : t("readMore")}
        </button>
      )}
      <div className="mt-5 pt-5 border-t border-edge-subtle">
        <p className="text-xs font-medium text-content-strong tracking-wide">
          {review.name}
        </p>
        <time className="text-[11px] text-content-subtle" dateTime={review.date} suppressHydrationWarning>
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
        className={`inline-flex items-center flex-wrap justify-center gap-3 sm:gap-4 glass-card rounded-full px-5 sm:px-8 py-3 sm:py-4 border border-accent-500/20 shadow-[0_0_30px_rgba(232,104,48,0.1)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
        <span className="text-xl sm:text-2xl font-bold text-accent-500 tracking-tight">5,0</span>

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
    <section id="bewertungen" className="relative py-14 sm:py-16 lg:py-24 overflow-hidden scroll-mt-20">
      {/* Glow orb */}
      <div className="glow-orb glow-orb-sky w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] top-20 right-0 animate-glow-pulse" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-6">
          <p className="text-sm tracking-premium uppercase text-accent-500 font-semibold">
            {t("tagline")}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-content-primary tracking-tight">
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
        <ScrollReveal className="mt-8 flex flex-col items-center gap-3">
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
          <a
            href="https://g.page/r/CaGNb8TkNHIKEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("googleReviewsLabel")}
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-content-subtle hover:text-accent-400 transition-colors"
          >
            {t("googleReviews")}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
