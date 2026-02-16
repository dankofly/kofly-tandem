import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import StatsBar from "@/components/StatsBar";
import Reviews from "@/components/Reviews";
import WhyUs from "@/components/WhyUs";
import Packages from "@/components/Packages";
import FAQ from "@/components/FAQ";
import MapContact from "@/components/MapContact";
import { faqSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema()),
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
