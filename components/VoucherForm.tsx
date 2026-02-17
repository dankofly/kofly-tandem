"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";

const INPUT_CLS =
  "w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 input-glow transition-colors";
const LABEL_CLS =
  "block text-xs font-medium text-content-body mb-2 tracking-wide";

export default function VoucherForm() {
  const t = useTranslations("VoucherForm");
  const locale = useLocale();
  const [paket, setPaket] = useState("premium");
  const [versand, setVersand] = useState("abholung");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot check
    if (data.get("company")) {
      setSubmitting(false);
      return;
    }

    const payload = {
      type: "gutschein",
      vorname: data.get("vorname"),
      nachname: data.get("nachname"),
      telefon: data.get("telefon"),
      email: data.get("email"),
      nachricht: data.get("nachricht"),
      empfaengername: data.get("empfaengername"),
      widmung: data.get("widmung"),
      paket: data.get("paket"),
      versandart: data.get("versandart"),
      postStrasse: data.get("post_strasse"),
      postPlzOrt: data.get("post_plz_ort"),
    };

    try {
      // Submit to Telegram API + Netlify Forms in parallel
      const [res] = await Promise.all([
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        // Netlify form submission (fire-and-forget)
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
        }).catch(() => {}),
      ]);
      if (!res.ok) throw new Error("Request failed");
      setSuccess(true);
    } catch {
      setError(t("errorText"));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card p-10 text-center hero-enter hero-enter-1">
        <span className="check-pop check-glow block text-accent-500 text-4xl mb-4">{"\u2713"}</span>
        <h3 className="hero-enter hero-enter-2 text-lg font-semibold text-content-primary mb-3">
          {t("successTitle")}
        </h3>
        <p className="hero-enter hero-enter-3 text-sm text-content-muted leading-relaxed font-light max-w-md mx-auto">
          {t("successText")}
        </p>
      </div>
    );
  }

  return (
    <form name="gutschein" onSubmit={handleSubmit} className="space-y-6" noValidate data-netlify="true" netlify-honeypot="company">
      <input type="hidden" name="form-name" value="gutschein" />
      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="company">Firma</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Vorname + Nachname */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="v_vorname" className={LABEL_CLS}>
            {t("vorname")}
          </label>
          <input
            type="text"
            id="v_vorname"
            name="vorname"
            required
            className={INPUT_CLS}
            placeholder={t("vornamePlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="v_nachname" className={LABEL_CLS}>
            {t("nachname")}
          </label>
          <input
            type="text"
            id="v_nachname"
            name="nachname"
            required
            className={INPUT_CLS}
            placeholder={t("nachnamePlaceholder")}
          />
        </div>
      </div>

      {/* Telefon + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="v_telefon" className={LABEL_CLS}>
            {t("telefon")}
          </label>
          <input
            type="tel"
            id="v_telefon"
            name="telefon"
            required
            className={INPUT_CLS}
            placeholder={t("telefonPlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="v_email" className={LABEL_CLS}>
            {t("email")}
          </label>
          <input
            type="email"
            id="v_email"
            name="email"
            required
            className={INPUT_CLS}
            placeholder={t("emailPlaceholder")}
          />
        </div>
      </div>

      {/* Anmerkung */}
      <div>
        <label htmlFor="v_nachricht" className={LABEL_CLS}>
          {t("nachricht")}
        </label>
        <textarea
          id="v_nachricht"
          name="nachricht"
          rows={3}
          className={`${INPUT_CLS} resize-y`}
          placeholder={t("nachrichtPlaceholder")}
        />
      </div>

      {/* === Gutschein-Optionen Section === */}
      <fieldset className="space-y-6 border-t border-edge-subtle pt-8">
        <legend className="text-sm font-semibold text-content-primary uppercase tracking-wide">
          {t("sectionGutschein")}
        </legend>

        {/* Empfängername */}
        <div>
          <label htmlFor="v_empfaengername" className={LABEL_CLS}>
            {t("empfaengername")}
          </label>
          <input
            type="text"
            id="v_empfaengername"
            name="empfaengername"
            className={INPUT_CLS}
            placeholder={t("empfaengerPlaceholder")}
          />
        </div>

        {/* Widmung */}
        <div>
          <label htmlFor="v_widmung" className={LABEL_CLS}>
            {t("widmung")}
          </label>
          <textarea
            id="v_widmung"
            name="widmung"
            rows={2}
            maxLength={200}
            className={`${INPUT_CLS} resize-y`}
            placeholder={t("widmungPlaceholder")}
          />
          <p className="mt-1 text-xs text-content-subtle font-light">{t("widmungHint")}</p>
        </div>

        {/* Flugpaket Radio Cards */}
        <div>
          <span className={LABEL_CLS}>{t("paketLabel")}</span>
          <input type="hidden" name="paket" value={paket} />
          <div className="space-y-2">
            {([
              { value: "classic", name: "classicName", detail: "classicDetail", price: "classicPrice", popular: false },
              { value: "classic-media", name: "classicMediaName", detail: "classicMediaDetail", price: "classicMediaPrice", popular: false },
              { value: "premium", name: "premiumName", detail: "premiumDetail", price: "premiumPrice", popular: true },
              { value: "thermik", name: "thermikName", detail: "thermikDetail", price: "thermikPrice", popular: false },
              { value: "individuell", name: "individuellName", detail: "individuellDetail", price: "individuellPrice", popular: false },
            ] as const).map((opt) => (
              <label
                key={opt.value}
                className={`radio-card flex items-center gap-4 p-4 border cursor-pointer ${
                  paket === opt.value
                    ? "selected border-accent-500 bg-accent-500/5"
                    : "border-edge-input bg-surface-input hover:border-edge-secondary"
                }${paket === opt.value && opt.value === "premium" ? " premium-shimmer" : ""}`}
              >
                <input
                  type="radio"
                  name="paket_radio"
                  value={opt.value}
                  checked={paket === opt.value}
                  onChange={() => setPaket(opt.value)}
                  className="w-4 h-4 text-accent-500 border-edge-secondary focus:ring-accent-500 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${paket === opt.value ? "text-content-primary" : "text-content-strong"}`}>
                      {t(opt.name)}
                    </span>
                    {opt.popular && (
                      <span className="badge-shimmer text-[10px] font-semibold uppercase tracking-wider text-white px-2 py-0.5 rounded-sm">
                        {t("popularBadge")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-content-muted font-light">{t(opt.detail)}</span>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${paket === opt.value ? "text-accent-500" : "text-content-strong"}`}>
                  {t(opt.price)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* === Zustellung Section === */}
      <fieldset className="space-y-4 border-t border-edge-subtle pt-8">
        <legend className="text-sm font-semibold text-content-primary uppercase tracking-wide">
          {t("sectionZustellung")}
        </legend>

        {/* Zustellung Radio */}
        <div className="flex gap-4">
          {([
            { value: "abholung", label: "abholung" },
            { value: "post", label: "post" },
          ] as const).map((opt) => (
            <label
              key={opt.value}
              className={`radio-card flex-1 flex items-center gap-3 p-4 border cursor-pointer ${
                versand === opt.value
                  ? "selected border-accent-500 bg-accent-500/5"
                  : "border-edge-input bg-surface-input hover:border-edge-secondary"
              }`}
            >
              <input
                type="radio"
                name="versandart"
                value={opt.value}
                checked={versand === opt.value}
                onChange={() => setVersand(opt.value)}
                className="w-4 h-4 text-accent-500 border-edge-secondary focus:ring-accent-500 shrink-0"
              />
              <span className={`text-sm font-medium ${versand === opt.value ? "text-content-primary" : "text-content-strong"}`}>
                {t(opt.label)}
              </span>
            </label>
          ))}
        </div>

        {/* Postadresse – conditional */}
        <div className={`accordion-content ${versand === "post" ? "open" : ""}`}>
          <div>
            <div className="space-y-4 pt-2">
              <div>
                <label htmlFor="v_post_strasse" className={LABEL_CLS}>
                  {t("postStrasse")}
                </label>
                <input
                  type="text"
                  id="v_post_strasse"
                  name="post_strasse"
                  className={INPUT_CLS}
                  placeholder={t("postStrassePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="v_post_plz_ort" className={LABEL_CLS}>
                  {t("postPlzOrt")}
                </label>
                <input
                  type="text"
                  id="v_post_plz_ort"
                  name="post_plz_ort"
                  className={INPUT_CLS}
                  placeholder={t("postPlzOrtPlaceholder")}
                />
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      {/* AGB Warning + Checkbox */}
      <div className="highlight-glow bg-accent-500/10 border border-accent-500/30 p-4">
        <p className="text-sm font-medium text-accent-500 mb-3">
          {t("agbWarning")}
        </p>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="voucher_agb"
            name="agb"
            required
            className="checkbox-pop mt-1 w-4 h-4 border-edge-secondary rounded bg-surface-input text-accent-500 focus:ring-accent-500"
          />
          <label htmlFor="voucher_agb" className="text-sm text-content-muted">
            {t.rich("agbConsent", {
              link: (chunks) => (
                <a href={`/${locale}/agb`} target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-400 underline underline-offset-2">
                  {chunks}
                </a>
              ),
            })}
          </label>
        </div>
      </div>

      {/* Datenschutz Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="voucher_datenschutz"
          name="datenschutz"
          required
          className="checkbox-pop mt-1 w-4 h-4 border-edge-secondary rounded bg-surface-input text-accent-500 focus:ring-accent-500"
        />
        <label htmlFor="voucher_datenschutz" className="text-sm text-content-muted">
          {t.rich("datenschutzConsent", {
            link: (chunks) => (
              <a href={`/${locale}/datenschutz`} target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-400 underline underline-offset-2">
                {chunks}
              </a>
            ),
          })}
        </label>
      </div>

      {error && (
        <p className="error-shake text-sm text-red-400 bg-red-900/20 border border-red-800/50 px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-glow btn-press cta-lift w-full px-8 py-4 bg-accent-500 hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium tracking-wide uppercase transition-colors flex items-center justify-center gap-2"
      >
        {submitting && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {submitting ? t("submitting") : t("submit")}
      </button>

      {/* Payment Note with Bank Details */}
      <div className="text-xs text-content-subtle text-center font-light space-y-1">
        <p>{t("paymentNote")}</p>
        <p className="font-mono text-content-muted">{t("bankDetails")}</p>
      </div>
    </form>
  );
}
