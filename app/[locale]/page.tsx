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

/* ──────────────────────────────────────────────────────────
   DEBUG: ?only=hero|ticker|stats|reviews|whyus|packages|faq|map|none
   Renders only the specified component. Omit param for all.
   ────────────────────────────────────────────────────────── */
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams;
  const only = typeof sp?.only === "string" ? sp.only : undefined;
  const show = (name: string) => !only || only === name;

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "FAQ" });

  const faqItems = FAQ_KEYS.map((key) => ({
    name: t(`q${key}`),
    text: t(`a${key}`),
  }));

  return (
    <>
      {show("schema") && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema(faqItems)),
          }}
        />
      )}

      {show("hero") && <Hero />}
      {show("ticker") && <Ticker />}
      {show("stats") && <StatsBar />}
      {show("reviews") && <Reviews />}
      {show("whyus") && <WhyUs />}
      {show("packages") && <Packages />}
      {show("faq") && <FAQ />}
      {show("map") && <MapContact />}
    </>
  );
}
