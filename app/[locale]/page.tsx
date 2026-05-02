import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import StatsBar from "@/components/StatsBar";
import Reviews from "@/components/Reviews";
import WhyUs from "@/components/WhyUs";
import Packages from "@/components/Packages";
import FAQ from "@/components/FAQ";
import Gallery from "@/components/Gallery";
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
  const tRegional = await getTranslations({ locale, namespace: "HomeRegional" });

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

      <Hero />
      <Ticker />
      <StatsBar />
      <Reviews />
      <WhyUs />

      {/* Regional coverage – internal link to /tandemflug-osttirol */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card border-accent-500/20 p-6 sm:p-10 lg:p-12">
            <p className="text-xs tracking-premium uppercase text-accent-500 font-semibold">
              {tRegional("tagline")}
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-content-primary tracking-tight">
              {tRegional("title")}
            </h2>
            <div className="mt-5 section-divider !mx-0" />

            <div className="mt-6 space-y-5 text-base text-content-body leading-relaxed font-light">
              <p>{tRegional("p1")}</p>
              <p>{tRegional("p2")}</p>
              <p>{tRegional("p3")}</p>
              <p>{tRegional("p4")}</p>
            </div>

            {/* Pull quote */}
            <blockquote className="mt-10 sm:mt-12 text-center">
              <p className="text-2xl sm:text-3xl font-light italic text-accent-500 tracking-tight leading-snug">
                {tRegional("quote")}
              </p>
            </blockquote>

            {/* Closing line */}
            <p className="mt-6 text-sm sm:text-[15px] text-content-muted text-center leading-relaxed max-w-xl mx-auto">
              {tRegional("closing")}
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/tandemflug-osttirol"
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-accent-500 hover:text-accent-400 transition-colors"
              >
                {tRegional("cta")}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Packages />
      <Gallery />
      <FAQ />
      <MapContact />
    </>
  );
}
