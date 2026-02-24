import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema } from "@/lib/schema";
import { getImageUrl } from "@/lib/images-config";
import { getVideosConfig, extractYouTubeId } from "@/lib/videos-config";
import ScrollReveal from "@/components/ScrollReveal";
import ReviewsSlider from "@/components/ReviewsSlider";

const SITE_URL = "https://gleitschirm-tandemflug.com";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("ueberUnsTitle"),
    description: t("ueberUnsDescription"),
    alternates: {
      languages: {
        de: `${SITE_URL}/de/ueber-uns`,
        en: `${SITE_URL}/en/ueber-uns`,
        nl: `${SITE_URL}/nl/ueber-uns`,
        "x-default": `${SITE_URL}/de/ueber-uns`,
      },
    },
  };
}

/* ── tiny svg icons (inline to avoid extra deps) ── */
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
  </svg>
);
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-accent-500 shrink-0 mt-0.5">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);
/* Mountain silhouette divider */
const MountainDivider = () => (
  <div className="relative w-full h-16 sm:h-24 -mb-px overflow-hidden">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full" fill="var(--bg-secondary)">
      <path d="M0,120 L0,80 Q120,20 240,60 T480,40 Q600,10 720,50 T960,30 Q1080,0 1200,45 T1440,35 L1440,120 Z" />
    </svg>
  </div>
);

/* Placeholder shown when no admin image is uploaded */
function ImagePlaceholder({ label, icon = "photo" }: { label: string; icon?: "photo" | "person" }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-surface-secondary to-surface-tertiary flex items-center justify-center">
      <div className="text-center px-6">
        {icon === "person" ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-content-faint mx-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-content-faint mx-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        )}
        <p className="mt-3 text-sm text-content-faint font-light">{label}</p>
      </div>
    </div>
  );
}

export default async function UeberUnsPage() {
  const locale = await getLocale();
  const t = await getTranslations("UeberUns");

  /* Fetch all über-uns images in parallel */
  const [ueberHero, ueberGruender, pilot1, pilot2, pilot3, pilot4] =
    await Promise.all([
      getImageUrl("ueber-hero"),
      getImageUrl("ueber-gruender"),
      getImageUrl("ueber-pilot-1"),
      getImageUrl("ueber-pilot-2"),
      getImageUrl("ueber-pilot-3"),
      getImageUrl("ueber-pilot-4"),
    ]);

  /* Fetch video URLs */
  const videoSlots = await getVideosConfig();
  const videos = [
    { id: "ueber-video-1", ...videoSlots["ueber-video-1"] },
    { id: "ueber-video-2", ...videoSlots["ueber-video-2"] },
    { id: "ueber-video-3", ...videoSlots["ueber-video-3"] },
    { id: "ueber-video-4", ...videoSlots["ueber-video-4"] },
  ].map((v) => ({
    ...v,
    youtubeId: v.url ? extractYouTubeId(v.url) : null,
  }));

  const hasVideos = videos.some((v) => v.youtubeId);

  const pilotImages = [
    { url: pilot1, label: "Pilot 1" },
    { url: pilot2, label: "Pilot 2" },
    { url: pilot3, label: "Pilot 3" },
    { url: pilot4, label: "Pilot 4" },
  ];

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/${locale}` },
    { name: t("breadcrumb"), url: `${SITE_URL}/${locale}/ueber-uns` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* ══════════════════════════════════════════
          HERO – Cinematic Opening with staggered entrance
          ══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden">
        {/* Multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />
        {/* Glow orbs with staggered pulse */}
        <div className="glow-orb glow-orb-accent w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] -top-60 -right-40 opacity-25 animate-glow-pulse" />
        <div className="glow-orb glow-orb-sky w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] -bottom-40 -left-40 opacity-15 animate-glow-pulse [animation-delay:2s]" />

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Breadcrumb – immediate */}
          <nav aria-label="Breadcrumb" className="hero-enter hero-enter-1 mb-10">
            <ol className="flex items-center gap-2 text-xs text-white/50 font-light">
              <li>
                <Link href="/" className="hover:text-accent-400 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/30">/</li>
              <li className="text-white/80 font-medium">{t("breadcrumb")}</li>
            </ol>
          </nav>

          {/* Staggered hero content */}
          <p className="hero-enter hero-enter-2 text-xs tracking-premium uppercase text-accent-500 font-medium">
            {t("heroOverline")}
          </p>

          <h1 className="hero-enter hero-enter-3 mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            {t("heroHighlight1")}{" "}
            <span className="shimmer-text text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400">
              {t("heroHighlight2")}
            </span>
          </h1>

          <div className="hero-enter hero-enter-4 mt-8 section-divider !mx-0" />

          <p className="hero-enter hero-enter-5 mt-8 text-lg sm:text-xl text-white/80 leading-relaxed font-light max-w-2xl">
            {t("heroDescription")}
          </p>

          {/* Hero CTA – above the fold */}
          <div className="hero-enter hero-enter-5 mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/buchen"
              className="cta-lift btn-glow cursor-pointer inline-flex items-center justify-center px-7 py-3.5 min-h-[44px] bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors duration-200"
            >
              {t("ctaBooking")}
            </Link>
            <a
              href="https://wa.me/436767293888"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-lift cursor-pointer inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] border border-white/20 text-white/80 hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.239 0-4.332-.726-6.02-1.956a.5.5 0 00-.417-.072l-3.234.848.66-2.907a.5.5 0 00-.063-.39A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              {t("ctaWhatsApp")}
            </a>
          </div>

          {/* Hero Image with entrance animation */}
          <div className="hero-enter hero-enter-6 mt-12 relative rounded-2xl overflow-hidden border border-white/10 aspect-[21/9] card-hover-glow">
            {ueberHero ? (
              <Image
                src={ueberHero}
                alt={t("heroImageAlt")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-700 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-white/20 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <p className="mt-3 text-sm text-white/30 font-light">{t("heroImagePlaceholder")}</p>
                </div>
              </div>
            )}
          </div>

          {/* Scroll hint */}
          <div className="mt-10 flex justify-center hero-enter hero-enter-6">
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
              <div className="w-1 h-2 rounded-full bg-white/40 animate-scroll-hint" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          UNSERE GESCHICHTE
          ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
                {t("geschichteOverline")}
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
                {t("geschichteTitle")}
              </h2>
              <div className="mt-6 section-divider" />
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Story text – spans 3 columns */}
            <ScrollReveal animation="fade-right" className="lg:col-span-3 space-y-6 text-base text-content-body leading-relaxed font-light max-w-prose">
              <p>{t("geschichteP1")}</p>
              <p>{t("geschichteP2")}</p>
              <p>{t("geschichteP3")}</p>
            </ScrollReveal>

            {/* Gründer-Bild – spans 2 columns */}
            <ScrollReveal animation="fade-left" delay={200} className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden border border-edge-faint aspect-[3/4] card-hover-glow">
                {ueberGruender ? (
                  <Image
                    src={ueberGruender}
                    alt={t("geschichteImageAlt")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 360px"
                  />
                ) : (
                  <ImagePlaceholder label={t("geschichteImageLabel")} icon="person" />
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Continuation of story */}
          <ScrollReveal animation="fade-up" className="mt-12 space-y-6 text-base text-content-body leading-relaxed font-light max-w-prose">
            <p>{t("geschichteP4")}</p>
            <p>{t("geschichteP5")}</p>
          </ScrollReveal>

          {/* KOFLY Rebrand Callout */}
          <ScrollReveal animation="scale-in" delay={100}>
            <div className="glass-card premium-shimmer border-accent-500/30 p-8 sm:p-10 mt-8">
              <p className="text-xs tracking-premium uppercase text-accent-500 font-medium mb-3">{t("rebrandTitle")}</p>
              <p className="text-base text-content-body leading-relaxed font-light">
                {t("rebrandText")}
              </p>
            </div>
          </ScrollReveal>

          {/* TripAdvisor Link */}
          <ScrollReveal animation="fade-up" delay={200}>
            <a
              href="https://www.tripadvisor.de/Attraction_Review-g230011-d8720066-Reviews-Gleitschirm_Tandemflug_com-Lienz_Tirol_Austrian_Alps.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group block cursor-pointer highlight-glow bg-accent-500/5 border border-accent-500/20 hover:border-accent-500/40 rounded-sm px-6 py-5 mt-8 text-center transition-all duration-200"
            >
              <span className="text-accent-400 group-hover:text-accent-500 transition-colors duration-200 text-base font-medium underline underline-offset-4">
                {t("tripAdvisorTitle")}
              </span>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Mountain transition */}
      <MountainDivider />

      {/* ══════════════════════════════════════════
          BEWERTUNGEN SLIDER
          ══════════════════════════════════════════ */}
      <ReviewsSlider />

      {/* ══════════════════════════════════════════
          UNSERE TANDEMPILOTEN
          ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-surface-secondary relative overflow-hidden">
        {/* Background orb */}
        <div className="glow-orb glow-orb-sky w-[400px] h-[400px] -top-40 right-0 opacity-10 animate-glow-pulse" />

        <div className="relative max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
                {t("teamOverline")}
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
                {t("teamTitle")}
              </h2>
              <div className="mt-6 section-divider" />
              <p className="mt-8 text-base text-content-body leading-relaxed font-light max-w-2xl mx-auto">
                {t("teamDescription")}
              </p>
            </div>
          </ScrollReveal>

          {/* Pilot Photos – only shown when at least one is uploaded */}
          {pilotImages.some((p) => p.url) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
              {pilotImages.filter((p) => p.url).map((pilot, i) => (
                <ScrollReveal key={i} animation="fade-up" delay={i * 120}>
                  <div className="group">
                    <div className="relative rounded-xl overflow-hidden border border-edge-faint aspect-[3/4] card-hover-glow">
                      <Image
                        src={pilot.url!}
                        alt={pilot.label}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal animation="fade-up">
            <p className="text-base text-content-body leading-relaxed font-light mb-10">
              {t("teamValuesIntro")}
            </p>
          </ScrollReveal>

          {/* Values – Open Layout ohne Boxen */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 max-w-3xl mx-auto">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                ),
                title: t("valueSafetyTitle"),
                text: t("valueSafetyDesc"),
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.025 7.5a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.905 0a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zm0 3.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" clipRule="evenodd" />
                  </svg>
                ),
                title: t("valueCommunicationTitle"),
                text: t("valueCommunicationDesc"),
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ),
                title: t("valuePassionTitle"),
                text: t("valuePassionDesc"),
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 012.25 0v10.937a4.505 4.505 0 00-3.25 2.373 8.963 8.963 0 014-.935A.75.75 0 0018 15v-2.266a3.368 3.368 0 01.988-2.37 1.125 1.125 0 011.591 1.59 1.118 1.118 0 00-.329.79v3.006h-.005a6 6 0 01-3.996 4.71l-.062.024a6.004 6.004 0 01-8.054-2.996l-.04-.09a6 6 0 01-.396-1.593 8.957 8.957 0 013.241.553A4.505 4.505 0 007.5 14.312V3.375a1.125 1.125 0 012.25 0v7.378a5.477 5.477 0 01.75-.753V1.875z" />
                  </svg>
                ),
                title: t("valueCareTitle"),
                text: t("valueCareDesc"),
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
                  </svg>
                ),
                title: t("valueUniquenessTitle"),
                text: t("valueUniquenessDesc"),
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                ),
                title: t("valueYouTitle"),
                text: t("valueYouDesc"),
              },
            ].map((value, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
                <div className="group text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-500/15 to-accent-500/5 flex items-center justify-center mx-auto text-accent-500 transition-transform duration-300 group-hover:scale-110">
                    {value.icon}
                  </div>
                  <div className="mt-5 w-8 h-px bg-accent-500/30 mx-auto" />
                  <h4 className="mt-4 text-base font-semibold text-content-primary tracking-wide">
                    {value.title}
                  </h4>
                  <p className="mt-2 text-sm text-content-body leading-relaxed font-light">
                    {value.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade-up" className="mt-12 space-y-6 text-base text-content-body leading-relaxed font-light max-w-prose">
            <p>{t("teamAfterP1")}</p>
            <p>{t("teamAfterP2")}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VIDEO GALLERY – YouTube Shorts 9:16
          ══════════════════════════════════════════ */}
      {hasVideos && (
        <section className="py-20 lg:py-28 overflow-hidden relative">
          <div className="glow-orb glow-orb-accent w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 animate-glow-pulse" />

          <div className="relative max-w-5xl mx-auto px-6">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
                  {t("videoOverline")}
                </p>
                <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
                  {t("videoTitle")}
                </h2>
                <div className="mt-6 section-divider" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {videos.filter((v) => v.youtubeId).map((video, i) => (
                <ScrollReveal key={video.id} animation="fade-up" delay={i * 150}>
                  <div className="relative rounded-xl overflow-hidden border border-edge-faint aspect-[9/16] card-hover-glow">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}?loop=1&playlist=${video.youtubeId}&modestbranding=1&rel=0`}
                      title={video.label}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          UNSERE PHILOSOPHIE
          ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-surface-secondary relative overflow-hidden">
        {/* Dual glow orbs */}
        <div className="glow-orb glow-orb-accent w-[400px] h-[400px] -top-40 -left-40 opacity-10 animate-glow-pulse" />
        <div className="glow-orb glow-orb-sky w-[300px] h-[300px] bottom-0 right-0 opacity-10 animate-glow-pulse [animation-delay:2s]" />

        <div className="relative max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
                {t("philosophieOverline")}
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
                {t("philosophieTitle")}
              </h2>
              <div className="mt-6 section-divider" />
            </div>
          </ScrollReveal>

          {/* Big statement with float */}
          <ScrollReveal animation="scale-in">
            <div className="text-center mb-16">
              <p className="quote-float text-2xl sm:text-3xl font-bold text-content-primary italic">
                {t("philosophieTagline")}
              </p>
              <p className="mt-6 text-base text-content-body leading-relaxed font-light max-w-2xl mx-auto">
                {t("philosophieIntro")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up">
            <p className="text-base text-content-body leading-relaxed font-light mb-10">
              {t("philosophiePillarsIntro")}
            </p>
          </ScrollReveal>

          {/* Three Pillars with stagger + step-card accent line */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldIcon />,
                title: t("pillar1Title"),
                text: t("pillar1Text"),
              },
              {
                icon: <SparklesIcon />,
                title: t("pillar2Title"),
                text: t("pillar2Text"),
              },
              {
                icon: <GlobeIcon />,
                title: t("pillar3Title"),
                text: t("pillar3Text"),
              },
            ].map((pillar, i) => (
              <ScrollReveal key={i} animation="fade-up" delay={i * 150}>
                <div className="step-card glass-card card-hover-glow cursor-default p-8 text-center h-full transition-all duration-200">
                  <div className="w-14 h-14 rounded-full bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto text-accent-500 transition-colors duration-200">
                    {pillar.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-content-primary">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-sm text-content-body leading-relaxed font-light max-w-[28ch] mx-auto">
                    {pillar.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade-in" delay={300}>
            <p className="mt-12 text-center text-lg text-content-body italic font-light">
              {t("philosophieClosing")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          UNSERE PARTNER
          ══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <p className="text-xs tracking-premium uppercase text-accent-500 font-medium">
                {t("partnerOverline")}
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-content-primary tracking-tight">
                {t("partnerTitle")}
              </h2>
              <div className="mt-6 section-divider" />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-base text-content-body leading-relaxed font-light">
              <p>{t("partnerIntro")}</p>
            </div>
          </ScrollReveal>

          {/* Partner values with stagger */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t("partnerValue1") },
              { label: t("partnerValue2") },
              { label: t("partnerValue3") },
              { label: t("partnerValue4") },
            ].map((item, i) => (
              <ScrollReveal key={i} animation="scale-in" delay={i * 100}>
                <div className="glass-card card-hover-glow cursor-default p-5 text-center flex flex-col items-center gap-2 transition-all duration-200">
                  <span className="text-accent-500"><CheckIcon /></span>
                  <span className="text-sm text-content-body font-medium">{item.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade-up" className="mt-12 space-y-6 text-base text-content-body leading-relaxed font-light">
            <p>{t("partnerOutro")}</p>
          </ScrollReveal>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          EMOTIONAL CLOSE + CTA
          ══════════════════════════════════════════ */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        {/* Multi-layer glow */}
        <div className="glow-orb glow-orb-accent w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-glow-pulse" />
        <div className="glow-orb glow-orb-sky w-[400px] h-[400px] top-0 -right-20 opacity-10 animate-glow-pulse [animation-delay:3s]" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal animation="scale-in">
            <p className="quote-float text-2xl sm:text-3xl font-bold text-content-primary italic">
              {t("ctaHeadline")}
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150} className="mt-8 space-y-5 text-base sm:text-lg text-content-body leading-relaxed font-light">
            <p>{t("ctaText")}</p>
            <p>{t("ctaSubtext")}</p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/buchen"
                className="cta-lift btn-glow cursor-pointer w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 min-h-[44px] bg-accent-500 hover:bg-accent-400 text-white text-xs font-medium tracking-wide uppercase transition-colors duration-200"
              >
                {t("ctaBooking")}
              </Link>
              <Link
                href="/buchen#gutschein"
                className="cta-lift cursor-pointer w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 min-h-[44px] border border-edge-secondary text-content-body hover:text-accent-400 hover:border-accent-500 text-xs font-medium tracking-wide uppercase transition-colors duration-200"
              >
                {t("ctaVoucher")}
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" delay={450}>
            <p className="mt-8 text-sm text-content-muted font-light">
              {t("ctaContactIntro")}{" "}
              <a
                href="https://wa.me/436767293888"
                className="cursor-pointer text-accent-400 hover:text-accent-500 transition-colors duration-200"
              >
                {t("ctaWhatsApp")}
              </a>{" "}
              {t("ctaUnter")}{" "}
              <a
                href="tel:+436767293888"
                className="cursor-pointer text-accent-400 hover:text-accent-500 transition-colors duration-200"
              >
                +43 676 7293888
              </a>
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
