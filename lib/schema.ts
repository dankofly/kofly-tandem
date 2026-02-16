const SITE_URL = "https://www.gleitschirm-tandemflug.com";
const BUSINESS_NAME = "Gleitschirm-Tandemflug.com";
const PHONE = "+43 676 7293888";
const EMAIL = "info@Gleitschirm-Tandemflug.com";

export function organizationSchema(locale: string = "de") {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "SportsActivityLocation"],
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    alternateName: [
      "KOFLY",
      "KOFLY.com",
      "Tandemflug Lienz",
      "Gleitschirm Tandemflug Osttirol",
      "Flugschule Osttirol",
      "Paragleiten Osttirol",
      "Tandemflug Sillian",
      "Tandemflug Matrei",
      "Tandemflug Kals",
      "Tandemflug Defereggental",
    ],
    url: `${SITE_URL}/${locale}`,
    telephone: PHONE,
    email: EMAIL,
    description:
      "Gleitschirm Tandemflüge & Paragleiten im Airpark Lienzer Dolomiten mit erfahrenen zertifizierten Tandempiloten. Tandemflug & Tandemsprung in Osttirol – Lienz, Sillian, Matrei, St. Jakob im Defereggental & Kals am Großglockner. Ab €150.",
    foundingDate: "2015",
    priceRange: "€150–€250",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Bank Transfer, PayPal",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unterassling 29",
      addressLocality: "Assling",
      addressRegion: "Osttirol",
      postalCode: "9911",
      addressCountry: "AT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.7572,
      longitude: 12.7581,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Lienz",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Osttirol",
        },
      },
      {
        "@type": "City",
        name: "Sillian",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Osttirol",
        },
      },
      {
        "@type": "City",
        name: "Matrei in Osttirol",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Osttirol",
        },
      },
      {
        "@type": "City",
        name: "Nußdorf-Debant",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Osttirol",
        },
      },
      {
        "@type": "City",
        name: "St. Jakob im Defereggental",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Osttirol",
        },
      },
      {
        "@type": "City",
        name: "Kals am Großglockner",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Osttirol",
        },
      },
      {
        "@type": "AdministrativeArea",
        name: "Defereggental",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Osttirol",
        },
      },
      {
        "@type": "AdministrativeArea",
        name: "Osttirol",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Tirol",
          containedInPlace: {
            "@type": "Country",
            name: "Austria",
          },
        },
      },
    ],
    location: [
      {
        "@type": "Place",
        name: "Airpark Lienzer Dolomiten",
        description:
          "Fluggebiet für Gleitschirmfliegen & Tandem-Paragleiten mit Start ab Zettersfeld oder Hochstein, je nach Wetterbedingungen.",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 46.8298,
          longitude: 12.7693,
        },
      },
      {
        "@type": "Place",
        name: 'Landeplatz "Touch Heaven"',
        description:
          "Treffpunkt und Landeplatz für Tandemflüge im Airpark Lienzer Dolomiten.",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 46.8177,
          longitude: 12.748,
        },
      },
      {
        "@type": "Place",
        name: "Kasse am Eingang der Lienzer Bergbahnen",
        description:
          "Alternativer Treffpunkt an der Kasse am Eingang der Lienzer Bergbahnen in Gaimberg.",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "250",
      reviewCount: "250",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      email: EMAIL,
      contactType: "customer service",
      availableLanguage: ["German", "English", "Dutch"],
    },
    sameAs: [
      "https://www.instagram.com/tandemfluglienz/",
      "https://www.tripadvisor.com/Attraction_Review-g190432-d12963049-Reviews-Gleitschirm_Tandemflug-Lienz_Tirol_Austrian_Alps.html",
    ],
    keywords:
      "Paragleiten, Tandemflug, Gleitschirmfliegen, Osttirol, Lienz, Sillian, Matrei, St. Jakob im Defereggental, Kals am Großglockner, Defereggental, KOFLY, Tandemsprung, Flugschule Osttirol, Airtime Austria, Tandemfliegen, Tandem Paragliding",
  };
}

export function serviceSchema(locale: string = "de") {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    name: "Gleitschirm Tandemflug & Paragleiten Osttirol",
    alternateName: [
      "Tandem Paragliding East Tyrol",
      "Tandemsprung Osttirol",
      "Gleitschirmfliegen Osttirol",
    ],
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: "Tandem Paragliding",
    areaServed: [
      { "@type": "City", name: "Lienz" },
      { "@type": "City", name: "Sillian" },
      { "@type": "City", name: "Matrei in Osttirol" },
      { "@type": "City", name: "St. Jakob im Defereggental" },
      { "@type": "City", name: "Kals am Großglockner" },
      { "@type": "City", name: "Nußdorf-Debant" },
      { "@type": "AdministrativeArea", name: "Defereggental" },
      { "@type": "AdministrativeArea", name: "Osttirol" },
    ],
    description:
      "Tandem-Gleitschirmflüge & Paragleiten im Airpark Lienzer Dolomiten. Start ab Zettersfeld oder Hochstein mit erfahrenen zertifizierten Tandempiloten. Tandemflug ab €150 – Lienz, Sillian, Matrei, St. Jakob, Kals & ganz Osttirol.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Flugpakete",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Premium-Tandemflug",
          price: "190.00",
          priceCurrency: "EUR",
          description:
            "Ausgedehnter Tandemflug mit verlängerter Flugzeit und Premium-Erlebnis im Airpark Lienzer Dolomiten.",
          url: `${SITE_URL}/${locale}/buchen`,
        },
        {
          "@type": "Offer",
          name: "Thermik Tandemflug",
          price: "250.00",
          priceCurrency: "EUR",
          description:
            "Thermikflug mit längerer Flugzeit, Aufwindnutzung und intensivem Flugerlebnis im Airpark Lienzer Dolomiten.",
          url: `${SITE_URL}/${locale}/buchen`,
        },
        {
          "@type": "Offer",
          name: "Classicflugpaket inkl. Foto- und Video-Paket",
          price: "170.00",
          priceCurrency: "EUR",
          description:
            "Klassischer Tandemflug inklusive Foto- und Video-Dokumentation im Airpark Lienzer Dolomiten.",
          url: `${SITE_URL}/${locale}/buchen`,
        },
        {
          "@type": "Offer",
          name: "Classicflugpaket",
          price: "150.00",
          priceCurrency: "EUR",
          description:
            "Klassischer Tandemflug im Airpark Lienzer Dolomiten. Foto- und Video-Paket optional buchbar.",
          url: `${SITE_URL}/${locale}/buchen`,
        },
        {
          "@type": "Offer",
          name: "Media Paket (Foto & Video)",
          price: "20.00",
          priceCurrency: "EUR",
          description:
            "Foto- und Video-Paket als Ergänzung zu jedem Flugpaket. Aufnahmen werden digital bereitgestellt.",
          url: `${SITE_URL}/${locale}/buchen`,
        },
      ],
    },
  };
}

export function voucherServiceSchema(locale: string = "de") {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gleitschirm-Tandemflug Gutschein",
    provider: { "@id": `${SITE_URL}/#organization` },
    description:
      "Gutschein für einen Gleitschirm Tandemflug im Airpark Lienzer Dolomiten. Persönliche Abholung oder Postversand möglich. Zahlung per Überweisung.",
    url: `${SITE_URL}/${locale}/buchen#gutschein`,
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was kostet ein Gleitschirm Tandemflug in Osttirol?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ein Tandemflug im Airpark Lienzer Dolomiten kostet ab €150 (Classicflug). Das Classicflugpaket inkl. Foto & Video gibt es für €170, den Premium-Tandemflug für €190 und den Thermikflug für €250. Das Foto- und Video-Paket kann optional für €20 dazugebucht werden.",
        },
      },
      {
        "@type": "Question",
        name: "Welche Voraussetzungen brauche ich für einen Tandemflug?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Du brauchst keine Vorkenntnisse. Ein Mindestalter von etwa 4 Jahren ist möglich, Kinder fliegen auf Anfrage. Wichtig ist normale bis gute körperliche Fitness und die Fähigkeit, ein paar schnelle Schritte beim Start zu laufen. Ideal ist ein Gewicht bis 110 kg, bis 120 kg auf Anfrage. Als Richtwert gilt ein BMI von 27.",
        },
      },
      {
        "@type": "Question",
        name: "Wo kann man in Osttirol Paragleiten?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wir fliegen im Airpark Lienzer Dolomiten in Osttirol. Je nach Wetter starten wir am Zettersfeld oder am Hochstein – beides bei Lienz. Wir sind auch erreichbar für Gäste aus Sillian, Matrei, St. Jakob im Defereggental, Kals am Großglockner und dem gesamten Osttiroler Raum. Treffpunkt ist der Landeplatz Touch Heaven oder die Kasse der Lienzer Bergbahnen.",
        },
      },
      {
        "@type": "Question",
        name: "Welche Flugpakete gibt es beim Gleitschirm Tandemflug?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Der Classicflug ohne Foto/Video (€150) ist der klassische Tandemflug. Der Classicflug mit Foto/Video (€170) kombiniert den Flug mit professionellen Aufnahmen. Der Premiumflug (€190) ist ein besonders betreutes Premium-Erlebnis. Der Thermikflug (€250) ist für passende Thermikbedingungen ausgelegt. Optional: Fotos/Videos zu jedem Paket dazubuchen (+€20).",
        },
      },
      {
        "@type": "Question",
        name: "Wie vereinbare ich einen Termin für einen Tandemflug in Lienz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kurz vor deinem Urlaub meldest du dich am besten nach unserem täglichen Wetterbriefing (ca. 18–19 Uhr) telefonisch oder per WhatsApp unter +43 676 7293888. 1–2 Tage vor dem Flug bestätigen wir den Termin final. Wir fliegen ausschließlich bei geeigneten Bedingungen – wenn es wetterbedingt nicht passt, verschieben wir kostenlos.",
        },
      },
      {
        "@type": "Question",
        name: "Kann ich meinen Tandemflug kostenlos verschieben?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Sollte das Wetter nicht mitspielen, verschieben oder stornieren wir deinen Termin kostenlos. Du gehst kein Risiko ein.",
        },
      },
      {
        "@type": "Question",
        name: "Ist Paragleiten und Tandemfliegen sicher?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Wir fliegen nur bei passenden, flugtechnisch sicheren Wetterbedingungen und ausschließlich mit erfahrenen, erfahrenen zertifizierten Tandempiloten. Unsere Ausrüstung wird regelmäßig nach gesetzlichen Vorgaben geprüft. Zusätzlich verfügen wir über die vorgeschriebene gewerbliche Haftpflichtversicherung über Air & More.",
        },
      },
      {
        "@type": "Question",
        name: "Wie schwer darf man beim Tandemflug sein?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ideal sind 20 kg bis 110 kg, bis 120 kg auf Anfrage. Als Richtwert gilt ein BMI von 27. Wichtig ist, dass du beim Start einige zügige Schritte laufen kannst. Bei der Landung ist in der Regel kein Laufen nötig, da wir sanft im Sitzen landen.",
        },
      },
      {
        "@type": "Question",
        name: "Was muss ich zum Tandemflug mitbringen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Je nach Saison warme, winddichte Kleidung: Jacke, lange Hose, knöchelhohe feste Schuhe. Optional Handschuhe (beheizbare Handschuhe stellen wir auf Wunsch kostenlos zur Verfügung) und eine Sonnenbrille.",
        },
      },
      {
        "@type": "Question",
        name: "Was ist der Thermik Tandemflug?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Beim Thermikflug starten wir am Steinermandl am Zettersfeld (2.220 m), meist am späten Vormittag mit Einsetzen der Thermik. Der Thermikflug dauert mindestens 60 Minuten, oft länger. Bitte mindestens 2 Wochen im Voraus buchen und 1–2 Tage vor Anreise telefonisch den Termin fixieren.",
        },
      },
      {
        "@type": "Question",
        name: "Wie lange dauert ein Tandemflug in Osttirol?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Die reine Flugzeit beim Classic-Tandemflug beträgt ca. 15–30 Minuten, beim Premium-Tandemflug bis zu 40 Minuten und beim Thermikflug mindestens 60 Minuten. Die Gesamtdauer inklusive Einweisung, Aufstieg und Nachbesprechung liegt bei ca. 1,5 bis 2,5 Stunden.",
        },
      },
      {
        "@type": "Question",
        name: "Können Kinder einen Tandemflug in Lienz machen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, Kinder können ab ca. 30 kg Körpergewicht auf Anfrage mitfliegen. Es gibt keine starre Altersgrenze – entscheidend sind Gewicht, Entwicklung und eine schriftliche Einverständniserklärung der Eltern. Generell ist ein Tandemflug ab etwa 4 Jahren möglich.",
        },
      },
      {
        "@type": "Question",
        name: "Kann man einen Tandemflug in Osttirol als Geschenk buchen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, wir bieten Gutscheine für alle Flugpakete an. Persönliche Abholung oder Postversand möglich. Der Gutschein ist 2 Jahre gültig, die Terminvereinbarung bleibt flexibel und wetterbedingte Verschiebungen sind kostenlos.",
        },
      },
      {
        "@type": "Question",
        name: "Kann man von Sillian, St. Jakob im Defereggental oder Kals zum Tandemflug kommen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Unser Fluggebiet im Airpark Lienzer Dolomiten ist von Sillian (ca. 30 Min.), St. Jakob im Defereggental (ca. 35 Min.) und Kals am Großglockner (ca. 40 Min.) gut erreichbar. Auch Gäste aus dem Defereggental, Matrei in Osttirol und dem gesamten Osttiroler Raum sind herzlich willkommen. Treffpunkt ist der Landeplatz Touch Heaven oder die Kasse der Lienzer Bergbahnen.",
        },
      },
      {
        "@type": "Question",
        name: "Wo ist der nächste Tandemflug-Anbieter bei Kals am Großglockner?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Der nächste Tandemflug-Anbieter bei Kals am Großglockner ist Gleitschirm-Tandemflug.com (KOFLY) im Airpark Lienzer Dolomiten bei Lienz. Die Anfahrt von Kals dauert ca. 40 Minuten. Wir bieten Tandemflüge ab €150 mit erfahrenen zertifizierten Tandempiloten – Terminvereinbarung telefonisch oder per WhatsApp unter +43 676 7293888.",
        },
      },
      {
        "@type": "Question",
        name: "Gibt es Paragleiten im Defereggental?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Direkt im Defereggental gibt es kein kommerzielles Tandem-Paragleiten. Der nächste Anbieter ist Gleitschirm-Tandemflug.com (KOFLY) im Airpark Lienzer Dolomiten. Von St. Jakob im Defereggental sind es ca. 35 Minuten Fahrzeit. Wir fliegen bei geeignetem Wetter mit Start ab Zettersfeld oder Hochstein – Tandemflüge ab €150.",
        },
      },
    ],
  };
}

export function webSiteSchema(locale: string = "de") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BUSINESS_NAME,
    url: `${SITE_URL}/${locale}`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: locale === "nl" ? "nl-NL" : locale === "en" ? "en-US" : "de-AT",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}/buchen?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
