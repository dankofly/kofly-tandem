/**
 * Single Source of Truth für Bewertungszahlen.
 *
 * Jede Stelle, die eine Bewertungszahl zeigt (Schema, UI, Meta-Texte,
 * llms.txt, pricing.md), muss mit diesen Werten übereinstimmen.
 * scripts/seo-verify prüft das automatisch.
 *
 * Zahlenbasis (Stand 2026-07): Google Business Profile 41 Bewertungen,
 * Tripadvisor 262 Bewertungen, beide 5,0. Sichtbar kommuniziert wird
 * "300+" mit dem Quell-Label, nie eine Summe ohne Label.
 */
export const REVIEWS = {
  ratingValue: "5.0",
  /** Exakte Zahl für Schema ratingCount/reviewCount (Google + Tripadvisor). */
  countExact: 303,
  /** Sichtbare Angabe in UI und Meta-Texten. */
  displayLabel: "300+",
  /** Gehört überall neben die Zahl, sonst ist sie irreführend. */
  sourceLabel: {
    de: "auf Google & Tripadvisor",
    en: "on Google & Tripadvisor",
    nl: "op Google & Tripadvisor",
  },
  /** Zahl für die Countup-Animation im Reviews-Widget. */
  countUpTarget: 300,
  asOf: "2026-07",
} as const;

/**
 * Die Gaeste-Stimmen, die auf der Seite sichtbar sind. Zweitverwendung im
 * Product-Schema als review-Objekte: Googles Richtlinie fuer Rich Results
 * verlangt, dass ein aggregateRating durch Bewertungen belegt ist, die auf
 * der Seite dargestellt werden. Quelle beider Zahlen ist Tripadvisor/Google.
 */
export interface Review {
  name: string;
  rating: number;
  text: Record<string, string>;
  date: string;
  sourceUrl: string;
}

export const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g230011-d8720066-Reviews-Gleitschirm_Tandemflug_com-Lienz_Tirol_Austrian_Alps.html";

export const REVIEW_QUOTES: Review[] = [
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
