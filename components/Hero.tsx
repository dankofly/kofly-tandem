import { Link } from "@/i18n/navigation";
import Image from "next/image";
import ScrollIndicator from "./ScrollIndicator";
import { getImageUrl } from "@/lib/images-config";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const [heroImage, heroMobileImage] = await Promise.all([
    getImageUrl("hero"),
    getImageUrl("hero-mobile"),
  ]);
  const t = await getTranslations("Hero");
  const tNav = await getTranslations("Navigation");

  const whatsappUrl = `https://wa.me/436767293888?text=${encodeURIComponent(tNav("whatsappMessage"))}`;

  return (
    <section
      id="erlebnis"
      aria-label={t("ariaLabel")}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background — separate images for mobile (9:16) and desktop (16:9) */}
      {heroMobileImage && (
        <Image
          src={heroMobileImage}
          alt={t("heroImageAlt")}
          fill
          className="object-cover sm:hidden"
          priority
          sizes="100vw"
          quality={85}
        />
      )}
      {heroImage ? (
        <Image
          src={heroImage}
          alt={t("heroImageAlt")}
          fill
          className={`object-cover ${heroMobileImage ? "hidden sm:block" : ""}`}
          priority
          sizes="100vw"
          quality={90}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-gradient)" }}
          aria-hidden="true"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, var(--hero-overlay-from), transparent, var(--hero-overlay-to))`,
        }}
        aria-hidden="true"
      />

      {/* Glow orbs — responsive sizes */}
      <div className="glow-orb glow-orb-accent w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] -top-40 -right-40 animate-glow-pulse" aria-hidden="true" />
      <div className="glow-orb glow-orb-sky w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] -bottom-60 -left-40 animate-glow-pulse" style={{ animationDelay: "2s" }} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 text-center sm:text-left">
        {/* Desktop: constrained wrapper so title + buttons share same width */}
        <div className="sm:w-min">
          {/* Slogan */}
          <p className="hero-enter hero-enter-1 text-xs sm:text-sm tracking-[0.25em] sm:tracking-premium uppercase text-hero-secondary font-semibold">
            {t("tagline")}
          </p>

          <h1 className="hero-enter hero-enter-2 mt-5 sm:mt-5 leading-[1.05] tracking-tight">
            <span className="block text-5xl sm:text-5xl lg:text-7xl font-black uppercase">
              {t("titleLine1")}
            </span>
            <span className="block text-5xl sm:text-5xl lg:text-7xl font-black uppercase">
              {t("titleLine2")}
            </span>
            <span className="block mt-3 sm:mt-3 text-xl sm:text-xl lg:text-2xl font-bold text-hero-secondary">
              {t("subtitle")}
            </span>
          </h1>

          {/* Description — short on mobile, full on desktop */}
          <p className="hero-enter hero-enter-3 mt-5 sm:mt-6 text-base sm:text-lg text-hero-secondary leading-relaxed font-light max-w-sm sm:max-w-none mx-auto sm:mx-0">
            <span className="sm:hidden">{t("descLine1")} {t("descLine2")}</span>
            <span className="hidden sm:inline">
              {t("descLine1")} {t("descLine2")}{" "}
              {t("descLine3")} {t("descLine4")}
            </span>
          </p>

          {/* CTAs — hidden on mobile (MobileCTA bar handles actions), visible on desktop */}
          <div className="hero-enter hero-enter-4 mt-8 hidden sm:flex flex-col gap-3" role="group" aria-label={t("ctaGroupLabel")}>
            <div className="flex flex-row gap-3">
              <Link
                href="/buchen"
                className="cta-lift btn-glow btn-press inline-flex items-center justify-center flex-1 py-4 rounded-lg bg-accent-500 hover:bg-accent-400 text-white font-bold text-sm tracking-wide uppercase transition-all duration-300 min-h-[48px]"
              >
                {t("ctaBook")}
              </Link>
              <Link
                href="/buchen#gutschein"
                className="cta-lift btn-press inline-flex items-center justify-center flex-1 py-4 rounded-lg border border-[var(--hero-border)] hover:border-[var(--hero-border-hover)] text-hero-secondary hover:text-hero font-semibold text-sm tracking-wide uppercase transition-all duration-300 min-h-[48px]"
              >
                {t("ctaVoucher")}
              </Link>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-enter hero-enter-5 cta-lift flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-[var(--hero-border)] hover:border-[var(--hero-border-hover)] text-hero-secondary hover:text-hero font-semibold text-sm tracking-wide uppercase transition-all duration-300 min-h-[44px]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("whatsappHint")}
            </a>
          </div>
        </div>
      </div>

      {/* Social sharing — desktop only */}
      <div className="absolute bottom-8 left-6 z-10 hidden sm:flex flex-col gap-3">
        <a
          href="https://wa.me/?text=Schau%20dir%20das%20an%20%E2%80%93%20Gleitschirm-Tandemflug%20in%20Osttirol!%20https%3A%2F%2Fgleitschirm-tandemflug.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("shareWhatsApp")}
          className="social-hover w-9 h-9 rounded-full border border-white/20 hover:border-accent-500/60 bg-white/5 hover:bg-accent-500/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
        <a
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgleitschirm-tandemflug.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("shareFacebook")}
          className="social-hover w-9 h-9 rounded-full border border-white/20 hover:border-accent-500/60 bg-white/5 hover:bg-accent-500/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <a
          href="https://www.instagram.com/tandemfluglienz/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("followInstagram")}
          className="social-hover w-9 h-9 rounded-full border border-white/20 hover:border-accent-500/60 bg-white/5 hover:bg-accent-500/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("followTikTok")}
          className="social-hover w-9 h-9 rounded-full border border-white/20 hover:border-accent-500/60 bg-white/5 hover:bg-accent-500/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.17V11.7a4.85 4.85 0 01-3.58-1.59V6.69h3.58z" />
          </svg>
        </a>
      </div>

      <ScrollIndicator />
    </section>
  );
}
