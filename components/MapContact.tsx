import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";

function buildMapEmbedUrl() {
  return "https://www.google.com/maps/d/embed?mid=1hKkecbjcXcWEo9NgrHdzJ5IqVb-vxIo&hl=de&ehbc=2E312F";
}

function buildAllPointsUrl(locations: { lat: number; lng: number }[]) {
  return `https://www.google.com/maps/dir/${locations.map((l) => `${l.lat},${l.lng}`).join("/")}`;
}

function buildPointUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/* ---------- tiny icon components ---------- */
function ArrowUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  );
}
function ArrowDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

/* ---------- location card ---------- */
function LocationCard({
  name,
  description,
  lat,
  lng,
  elevation,
  openLabel,
}: {
  name: string;
  description: string;
  lat: number;
  lng: number;
  elevation?: string;
  openLabel: string;
}) {
  return (
    <a
      href={buildPointUrl(lat, lng)}
      target="_blank"
      rel="noopener noreferrer"
      className="group glass-card step-card rounded-2xl p-5 flex flex-col gap-2 transition-all duration-500 hover:shadow-[0_0_60px_var(--glow-card)] hover:border-[var(--glow-card-border)]"
    >
      {/* Title row */}
      <div className="flex items-start gap-3">
        <h4 className="text-sm font-bold text-content-strong group-hover:text-accent-400 transition-colors leading-snug flex-1">
          {name}
        </h4>
        {elevation && (
          <span className="flex-shrink-0 px-2.5 py-1 rounded-full bg-accent-500/15 text-accent-400 text-[10px] font-semibold tracking-wide border border-accent-500/20">
            {elevation}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-content-muted font-light leading-relaxed">
        {description}
      </p>

      {/* Footer */}
      <span className="mt-auto pt-1 inline-flex items-center gap-1.5 text-[10px] text-content-subtle group-hover:text-accent-400 font-semibold uppercase tracking-premium transition-colors">
        {openLabel}
        <ExternalIcon />
      </span>
    </a>
  );
}

/* ---------- main component ---------- */
export default function MapContact() {
  const t = useTranslations("MapContact");

  const locations = {
    starts: [
      {
        name: t("startHochstein"),
        elevation: "2.057 m",
        description: t("startHochsteinDesc"),
        lat: 46.81857480488911,
        lng: 12.70694815874197,
      },
      {
        name: t("startZettersfeld"),
        elevation: "2.220 m",
        description: t("startZettersfeldDesc"),
        lat: 46.875198183908886,
        lng: 12.7884460899549,
      },
    ],
    landings: [
      {
        name: t("landingTouchHeaven"),
        description: t("landingTouchHeavenDesc"),
        lat: 46.8377617074957,
        lng: 12.779760482590454,
      },
      {
        name: t("landingGirstmair"),
        description: t("landingGirstmairDesc"),
        lat: 46.83774008698708,
        lng: 12.784149259967565,
      },
    ],
    meeting: [
      {
        name: t("meetingBergbahnen"),
        description: t("meetingBergbahnenDesc"),
        lat: 46.84181884045783,
        lng: 12.775690262816282,
      },
      {
        name: t("meetingMittelstation"),
        description: t("meetingMittelstationDesc"),
        lat: 46.86341349635841,
        lng: 12.79073347444253,
      },
    ],
  };

  const allPoints = [
    ...locations.starts,
    ...locations.landings,
    ...locations.meeting,
  ];

  const openLabel = t("openInMaps");

  return (
    <section id="kontakt" className="relative py-16 lg:py-24 overflow-hidden scroll-mt-20">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-accent w-[500px] h-[500px] -bottom-40 right-0 animate-glow-pulse" aria-hidden="true" />
      <div className="glow-orb glow-orb-sky w-[400px] h-[400px] top-20 -left-40 animate-glow-pulse" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-10">
          <p className="text-sm tracking-premium uppercase text-accent-500 font-semibold">
            {t("tagline")}
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black text-content-primary tracking-tight">
            {t("title")}
          </h2>
          <div className="mt-5 section-divider" />
          <p className="mt-5 text-sm text-content-muted font-normal max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        {/* Map */}
        <ScrollReveal animation="scale-in" className="relative rounded-2xl overflow-hidden border border-edge-faint shadow-[0_0_80px_var(--glow-card)] mb-10">
          <iframe
            src={buildMapEmbedUrl()}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t("mapTitle")}
            className="w-full"
          />
          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
          {/* Overlay CTA */}
          <a
            href={buildAllPointsUrl(allPoints)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-xs font-semibold text-content-strong hover:text-accent-400 transition-all hover:border-accent-500/30 shadow-lg"
          >
            <PinIcon />
            {t("allPoints")}
            <ExternalIcon />
          </a>
        </ScrollReveal>

        {/* ---- Startplätze ---- */}
        <ScrollReveal className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20">
              <ArrowUpIcon />
            </span>
            <h3 className="text-[13px] font-bold tracking-premium uppercase text-content-strong">
              {t("startplaetze")}
            </h3>
            <span className="flex-1 h-px bg-gradient-to-r from-[var(--border-faint)] to-transparent" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {locations.starts.map((loc) => (
              <LocationCard key={loc.lat} {...loc} openLabel={openLabel} />
            ))}
          </div>
        </ScrollReveal>

        {/* ---- Landeplätze ---- */}
        <ScrollReveal className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20">
              <ArrowDownIcon />
            </span>
            <h3 className="text-[13px] font-bold tracking-premium uppercase text-content-strong">
              {t("landeplaetze")}
            </h3>
            <span className="flex-1 h-px bg-gradient-to-r from-[var(--border-faint)] to-transparent" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {locations.landings.map((loc) => (
              <LocationCard key={loc.lat} {...loc} openLabel={openLabel} />
            ))}
          </div>
        </ScrollReveal>

        {/* ---- Treffpunkte ---- */}
        <ScrollReveal className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500/10 text-accent-400 border border-accent-500/20">
              <PinIcon />
            </span>
            <h3 className="text-[13px] font-bold tracking-premium uppercase text-content-strong">
              {t("treffpunkte")}
            </h3>
            <span className="flex-1 h-px bg-gradient-to-r from-[var(--border-faint)] to-transparent" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {locations.meeting.map((loc) => (
              <LocationCard key={loc.lat} {...loc} openLabel={openLabel} />
            ))}
          </div>
          <p className="mt-5 text-xs text-content-subtle font-light leading-relaxed max-w-lg">
            {t("meetingNote")}
          </p>
        </ScrollReveal>

        {/* ---- Direkt erreichen ---- */}
        <ScrollReveal className="relative glass-card rounded-2xl overflow-hidden">
          {/* Top accent line */}
          <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent" aria-hidden="true" />

          <div className="p-8 sm:p-10">
            <h3 className="text-sm font-semibold tracking-premium uppercase text-accent-400 mb-8">
              {t("contactTitle")}
            </h3>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Contact info */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <a
                  href="tel:+436767293888"
                  className="flex items-center gap-3 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-secondary border border-edge-faint group-hover:border-accent-500/30 transition-colors">
                    <svg className="w-4 h-4 text-content-subtle group-hover:text-accent-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] text-content-subtle font-medium uppercase tracking-wide">{t("phone")}</p>
                    <p className="text-sm font-semibold text-content-strong group-hover:text-accent-400 transition-colors">+43 676 7293888</p>
                  </div>
                </a>

                <a
                  href="mailto:info@Gleitschirm-Tandemflug.com"
                  className="flex items-center gap-3 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-secondary border border-edge-faint group-hover:border-accent-500/30 transition-colors">
                    <svg className="w-4 h-4 text-content-subtle group-hover:text-accent-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] text-content-subtle font-medium uppercase tracking-wide">{t("email")}</p>
                    <p className="text-sm font-semibold text-content-strong group-hover:text-accent-400 transition-colors">info@Gleitschirm-Tandemflug.com</p>
                  </div>
                </a>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/436767293888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-lift inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-[13px] font-bold tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.3)]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("ctaWhatsApp")}
                </a>
                <a
                  href="tel:+436767293888"
                  className="cta-lift inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-edge-secondary hover:border-accent-500/50 text-content-body hover:text-content-primary text-[13px] font-bold tracking-wide uppercase transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t("ctaCall")}
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
