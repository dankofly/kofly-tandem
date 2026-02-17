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
    image: `${SITE_URL}/images/hero-1771273007982.jpg`,
    logo: `${SITE_URL}/icon.png`,
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
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: { "@type": "Person", name: "Tripadvisor-Gast" },
        datePublished: "2024-07-01",
        reviewBody:
          "Awesome experience! Daniel and Rene are awesome instructors who are happy to explain every detail of the experience! The flight itself was on a beautiful day, the takeoff was smooth as butter and the same goes for the landing.",
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: { "@type": "Person", name: "Tripadvisor-Gast" },
        datePublished: "2023-09-01",
        reviewBody:
          "Dieses wunderbare Erlebnis wurde von Anfang bis Ende sehr professionell und sehr freundlich auf unsere Bedürfnisse zugeschnitten. Die Fotos und kleinen Videos sind eine Erinnerung fürs Leben.",
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: { "@type": "Person", name: "Tripadvisor-Gast" },
        datePublished: "2023-06-01",
        reviewBody:
          "Hervorragende Betreuung, super sympathisch. Jederzeit wieder. Absolut empfehlenswert. Bei Daniel fühlt man sich absolut sicher und optimal aufgehoben.",
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: { "@type": "Person", name: "Tripadvisor-Gast" },
        datePublished: "2023-03-01",
        reviewBody:
          "Me and my kids had a lifetime experience – we will never forget this. The team is very keen on safety so it felt all very good to go up the mountain and fly.",
      },
    ],
    sameAs: [
      "https://www.instagram.com/tandemfluglienz/",
      "https://www.tripadvisor.com/Attraction_Review-g190432-d12963049-Reviews-Gleitschirm_Tandemflug-Lienz_Tirol_Austrian_Alps.html",
    ],
    keywords:
      "Paragleiten, Tandemflug, Gleitschirmfliegen, Osttirol, Lienz, Sillian, Matrei, St. Jakob im Defereggental, Kals am Großglockner, Defereggental, KOFLY, Tandemsprung, Flugschule Osttirol, Airtime Austria, Tandemfliegen, Tandem Paragliding, Urlaub Osttirol, Aktivitäten Osttirol, Outdoor Aktivitäten Osttirol, Erlebnisse Osttirol, Freizeit Osttirol, Bruno Girstmair, Flugschule Tirol, Landeplatz Postleite, Tandemsprung Lienz, Paragliding Austria",
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

export function faqSchema(items: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.name,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.text,
      },
    })),
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
