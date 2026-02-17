import { getTranslations, getLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import StatsBar from "@/components/StatsBar";
import Reviews from "@/components/Reviews";
import WhyUs from "@/components/WhyUs";
import Packages from "@/components/Packages";
import FAQ from "@/components/FAQ";
import MapContact from "@/components/MapContact";
import { faqSchema } from "@/lib/schema";

const FAQ_KEYS = [
  ...Array.from({ length: 4 }, (_, i) => `1_${i + 1}`),
  ...Array.from({ length: 4 }, (_, i) => `2_${i + 1}`),
  ...Array.from({ length: 11 }, (_, i) => `3_${i + 1}`),
  ...Array.from({ length: 6 }, (_, i) => `4_${i + 1}`),
  ...Array.from({ length: 2 }, (_, i) => `5_${i + 1}`),
  ...Array.from({ length: 4 }, (_, i) => `6_${i + 1}`),
];

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "FAQ" });

  const faqItems = FAQ_KEYS.map((key) => ({
    name: t(`q${key}`),
    text: t(`a${key}`),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqItems)),
        }}
      />

      {/* 1. Hero / Erlebnis */}
      <Hero />

      {/* Scrolling ticker */}
      <Ticker />

      {/* Stats bar */}
      <StatsBar />

      {/* 2. Bewertungen (Tripadvisor) */}
      <Reviews />

      {/* 3. Warum wir / About */}
      <WhyUs />

      {/* 4. Flugpakete */}
      <Packages />

      {/* 5. FAQ */}
      <FAQ />

      {/* 6. Google Maps + Kontakt */}
      <MapContact />
    </>
  );
}
