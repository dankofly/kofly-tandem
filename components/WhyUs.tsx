import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getImageUrl } from "@/lib/images-config";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "./ScrollReveal";
import ParallaxBg from "./ParallaxBg";

const tileSlots = ["tile-einfach", "tile-sicher", "tile-unvergesslich"];

export default async function WhyUs() {
  const t = await getTranslations("WhyUs");

  const tiles = [
    {
      title: t("einfachTitle"),
      slot: "tile-einfach",
      text: t("einfachText"),
      href: "/ablauf",
    },
    {
      title: t("sicherTitle"),
      slot: "tile-sicher",
      text: t("sicherText"),
      href: "/ablauf",
    },
    {
      title: t("unvergesslichTitle"),
      slot: "tile-unvergesslich",
      text: t("unvergesslichText"),
      href: "/buchen",
    },
  ];

  const [bgImage, ...images] = await Promise.all([
    getImageUrl("whyus-bg"),
    ...tileSlots.map((slot) => getImageUrl(slot)),
  ]);

  return (
    <section id="warum-wir" className="relative py-16 lg:py-24 overflow-hidden scroll-mt-20 [clip-path:inset(0)]">
      {/* Parallax background image */}
      {bgImage ? (
        <>
          <ParallaxBg src={bgImage} alt={t("bgAlt")} />
          <div className="absolute inset-0 hero-overlay" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[var(--bg-secondary)]" />
      )}

      {/* Glow orb */}
      <div className="glow-orb glow-orb-accent w-[400px] h-[400px] top-0 left-1/2 -translate-x-1/2 animate-glow-pulse" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-10">
          <p className="text-sm tracking-premium uppercase text-accent-500 font-semibold">
            {t("tagline")}
          </p>
          <h2 className={`mt-3 text-4xl sm:text-5xl font-black tracking-tight ${bgImage ? "text-white" : "text-content-primary"}`}>
            {t("title")}
          </h2>
          <div className="mt-5 section-divider" />
        </ScrollReveal>

        {/* Three image tiles */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile, i) => (
            <ScrollReveal
              key={tile.title}
              delay={i * 120}
              animation="scale-in"
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-edge-faint flight-card"
            >
              {/* Background image or placeholder */}
              {images[i] ? (
                <Image
                  src={images[i]}
                  alt={tile.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--bg-tertiary)]" />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Title top-left */}
              <h3 className="absolute top-5 left-5 right-5 text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                {tile.title}
              </h3>

              {/* Text + Link bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">
                <p className="text-sm text-white/85 leading-relaxed font-normal">
                  {tile.text}
                </p>
                <Link
                  href={tile.href}
                  aria-label={`${t("learnMore")} – ${tile.title}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold tracking-wide uppercase text-accent-400 hover:text-white transition-colors"
                >
                  {t("learnMore")}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Signature phrase */}
        <ScrollReveal animation="fade-in" className={`mt-12 text-center text-2xl sm:text-3xl font-light italic tracking-wide ${bgImage ? "text-white/90 drop-shadow-lg" : "text-content-muted"}`}>
          {t("signature")}
        </ScrollReveal>
      </div>
    </section>
  );
}
