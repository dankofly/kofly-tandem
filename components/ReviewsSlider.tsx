"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";

interface Review {
  name: string;
  rating: number;
  text: Record<string, string>;
  date: string;
}

const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g230011-d8720066-Reviews-Gleitschirm_Tandemflug_com-Lienz_Tirol_Austrian_Alps.html";

const reviews: Review[] = [
  {
    name: "Carmen S.",
    rating: 5,
    text: {
      de: "Der Tandemflug war einfach traumhaft! Schon der Start und der Weg dorthin waren ein Erlebnis, und dann dieses Gef\u00fchl, hoch oben \u00fcber der Region zu gleiten \u2013 unbeschreiblich. Die Aussicht war atemberaubend, man konnte die Landschaft in voller Sch\u00f6nheit genie\u00dfen. Alles war super organisiert, ich habe mich die ganze Zeit sicher und bestens betreut gef\u00fchlt. Absolute Empfehlung f\u00fcr alle, die etwas Besonderes erleben wollen!",
      en: "The tandem flight was simply amazing! Even the start and the way up were an experience, and then that feeling of gliding high above the region \u2013 indescribable. The view was breathtaking, you could enjoy the landscape in all its beauty. Everything was perfectly organized, I felt safe and well looked after the entire time. Absolute recommendation for anyone who wants to experience something special!",
      nl: "De tandemvlucht was gewoon fantastisch! Al de start en de weg ernaartoe waren een belevenis, en dan dat gevoel om hoog boven de regio te zweven \u2013 onbeschrijflijk. Het uitzicht was adembenemend, je kon het landschap in al zijn schoonheid bewonderen. Alles was perfect georganiseerd, ik voelde me de hele tijd veilig en uitstekend begeleid. Absolute aanrader!",
    },
    date: "2025-09-01",
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
  },
  {
    name: "Familie \u00d6vermann",
    rating: 5,
    text: {
      de: "Alles hat wunderbar gepasst!! Angefangen mit dem sch\u00f6nen Gutschein, der zu uns nach Hause punktgenau zum Geburtstag unseres Sohnes geschickt wurde bis hin zur pers\u00f6nlichen Termin-Absprache vor Ort war es durchweg eine sehr sympathische und verl\u00e4ssliche Absprache. Der Flug verlief dann sehr feinf\u00fchlig und empathisch. Der Blick \u00fcber Lienz und die umliegenden Bergketten sind ein Traum!! Ganz herzlichen Dank f\u00fcr dieses tolle Erlebnis!!",
      en: "Everything came together wonderfully!! Starting with the beautiful voucher that was sent to our home right on time for our son\u2019s birthday, through to the personal appointment arrangements on site \u2013 it was a consistently friendly and reliable experience. The flight itself was very sensitive and empathetic. The view over Lienz and the surrounding mountain ranges is a dream!! Heartfelt thanks for this amazing experience!!",
      nl: "Alles klopte perfect!! Vanaf de mooie cadeaubon die precies op tijd voor de verjaardag van onze zoon naar huis werd gestuurd tot de persoonlijke afspraak ter plaatse \u2013 het was een door en door sympathieke en betrouwbare ervaring. De vlucht verliep zeer gevoelig en empathisch. Het uitzicht over Lienz en de omliggende bergketens is een droom!! Heel hartelijk dank voor deze geweldige ervaring!!",
    },
    date: "2025-08-01",
  },
  {
    name: "Christina S.",
    rating: 5,
    text: {
      de: "Ein voller Erfolg, bin dem ganzen Team echt dankbar. Aber nicht nur wegen dem Flug sondern auch weil ich vom Bahnhof geholt, wieder zur\u00fcckgebracht wurde und sch\u00f6ne Fotos gemacht wurden. All das sind keine Witze \u2013 euer ganzes Team ist spitze. So komme ich gerne ein weiteres Mal!",
      en: "A complete success, I\u2019m truly grateful to the whole team. Not just because of the flight, but also because I was picked up from the train station, brought back, and beautiful photos were taken. None of this is a joke \u2013 your whole team is top-notch. I\u2019ll gladly come again!",
      nl: "Een volledig succes, ik ben het hele team echt dankbaar. Niet alleen vanwege de vlucht, maar ook omdat ik van het station werd gehaald, weer teruggebracht en er mooie foto\u2019s werden gemaakt. Dit alles is geen grap \u2013 jullie hele team is top. Zo kom ik graag nog een keer!",
    },
    date: "2025-08-01",
  },
];

/* Duplicate reviews for seamless infinite scroll */
const SCROLL_SPEED = 0.4; // px per frame (~24px/s at 60fps)

const dateLocaleMap: Record<string, string> = {
  de: "de-AT",
  en: "en-US",
  nl: "nl-NL",
};

function Stars() {
  return (
    <div className="flex gap-0.5">
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
  );
}

export default function ReviewsSlider() {
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const posRef = useRef(0);

  /* Duplicate items 3× for seamless loop */
  const items = [...reviews, ...reviews, ...reviews];

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (!pausedRef.current) {
      posRef.current += SCROLL_SPEED;
      /* Reset when first set of reviews scrolls off */
      const singleSetWidth = el.scrollWidth / 3;
      if (posRef.current >= singleSetWidth) {
        posRef.current -= singleSetWidth;
      }
      el.scrollLeft = posRef.current;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handleMouseEnter = () => {
    pausedRef.current = true;
  };
  const handleMouseLeave = () => {
    pausedRef.current = false;
    if (scrollRef.current) posRef.current = scrollRef.current.scrollLeft;
  };

  return (
    <section className="py-20 lg:py-28 bg-surface-secondary overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 mb-12 text-center">
        <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
          Tripadvisor 5.0/5
        </p>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
          Was unsere Passagiere sagen
        </h2>
        <div className="mt-6 section-divider" />
      </div>

      {/* Slider wrapper with fade edges */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-surface-secondary to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-surface-secondary to-transparent" />

        <div
          ref={scrollRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseEnter}
          onTouchEnd={handleMouseLeave}
          className="flex gap-5 overflow-x-hidden px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((review, i) => {
            const fullText = review.text[locale] || review.text.de;
            return (
              <article
                key={i}
                className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col shrink-0 w-[300px] sm:w-[340px]"
              >
                <Stars />
                <p className="mt-4 text-sm text-content-strong leading-relaxed font-light flex-1">
                  &ldquo;{fullText}&rdquo;
                </p>
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
                      {new Date(review.date).toLocaleDateString(
                        dateLocaleMap[locale] || locale,
                        { year: "numeric", month: "long" }
                      )}
                    </time>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* TripAdvisor CTA */}
      <div className="mt-10 text-center">
        <a
          href={TRIPADVISOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-content-subtle hover:text-accent-400 transition-colors"
        >
          Alle Bewertungen auf TripAdvisor
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </a>
      </div>
    </section>
  );
}
