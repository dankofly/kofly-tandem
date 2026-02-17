"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";

const INPUT_CLS =
  "w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors";
const LABEL_CLS =
  "block text-xs font-medium text-content-body mb-2 tracking-wide";

export default function BookingForm() {
  const t = useTranslations("BookingForm");
  const locale = useLocale();
  const [paket, setPaket] = useState("premium");
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
    if (data.get("website")) {
      setSubmitting(false);
      return;
    }

    const payload = {
      type: "termin",
      vorname: data.get("vorname"),
      nachname: data.get("nachname"),
      telefon: data.get("telefon"),
      whatsapp: data.get("whatsapp"),
      email: data.get("email"),
      wunschtermin: data.get("wunschtermin"),
      anreise: data.get("anreise"),
      abreise: data.get("abreise"),
      personenanzahl: data.get("personenanzahl"),
      paket: data.get("paket"),
      nachricht: data.get("nachricht"),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
        <span className="check-pop block text-accent-500 text-4xl mb-4" style={{ textShadow: "0 0 20px rgba(232, 104, 48, 0.3)" }}>{"\u2713"}</span>
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Vorname + Nachname */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="vorname" className={LABEL_CLS}>
            {t("vorname")}
          </label>
          <input
            type="text"
            id="vorname"
            name="vorname"
            required
            className={INPUT_CLS}
            placeholder={t("vornamePlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="nachname" className={LABEL_CLS}>
            {t("nachname")}
          </label>
          <input
            type="text"
            id="nachname"
            name="nachname"
            required
            className={INPUT_CLS}
            placeholder={t("nachnamePlaceholder")}
          />
        </div>
      </div>

      {/* Telefon + WhatsApp */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="telefon" className={LABEL_CLS}>
            {t("telefon")}
          </label>
          <input
            type="tel"
            id="telefon"
            name="telefon"
            required
            className={INPUT_CLS}
            placeholder={t("telefonPlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className={LABEL_CLS}>
            {t("whatsapp")}
          </label>
          <select id="whatsapp" name="whatsapp" className={INPUT_CLS}>
            <option value="ja">{t("whatsappJa")}</option>
            <option value="nein">{t("whatsappNein")}</option>
          </select>
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={LABEL_CLS}>
          {t("email")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={INPUT_CLS}
          placeholder={t("emailPlaceholder")}
        />
      </div>

      {/* Wunschtermin */}
      <div>
        <label htmlFor="wunschtermin" className={LABEL_CLS}>
          {t("wunschtermin")}
        </label>
        <input
          type="date"
          id="wunschtermin"
          name="wunschtermin"
          className={INPUT_CLS}
        />
      </div>

      {/* Anreise + Abreise */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="anreise" className={LABEL_CLS}>
            {t("anreise")}
          </label>
          <input
            type="date"
            id="anreise"
            name="anreise"
            required
            className={INPUT_CLS}
          />
        </div>
        <div>
          <label htmlFor="abreise" className={LABEL_CLS}>
            {t("abreise")}
          </label>
          <input
            type="date"
            id="abreise"
            name="abreise"
            required
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Personenanzahl */}
      <div>
        <label htmlFor="personenanzahl" className={LABEL_CLS}>
          {t("personenanzahl")}
        </label>
        <input
          type="number"
          id="personenanzahl"
          name="personenanzahl"
          min="1"
          max="10"
          defaultValue="1"
          className={INPUT_CLS}
        />
      </div>

      {/* Flugpaket */}
      <fieldset>
        <legend className={LABEL_CLS}>{t("paketLabel")}</legend>
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
              className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                paket === opt.value
                  ? "border-accent-500 bg-accent-500/5"
                  : "border-edge-input bg-surface-input hover:border-edge-secondary"
              }`}
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
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent-500 text-white px-2 py-0.5 rounded-sm">
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
      </fieldset>

      {/* Anmerkungen & Fragen */}
      <div>
        <label htmlFor="nachricht" className={LABEL_CLS}>
          {t("nachricht")}
        </label>
        <textarea
          id="nachricht"
          name="nachricht"
          rows={3}
          className={`${INPUT_CLS} resize-y`}
          placeholder={t("nachrichtPlaceholder")}
        />
      </div>

      {/* AGB Warning + Checkbox */}
      <div className="bg-accent-500/10 border border-accent-500/30 p-4">
        <p className="text-sm font-medium text-accent-500 mb-3">
          {t("agbWarning")}
        </p>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agb"
            name="agb"
            required
            className="mt-1 w-4 h-4 border-edge-secondary rounded bg-surface-input text-accent-500 focus:ring-accent-500"
          />
          <label htmlFor="agb" className="text-sm text-content-muted">
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
          id="datenschutz"
          name="datenschutz"
          required
          className="mt-1 w-4 h-4 border-edge-secondary rounded bg-surface-input text-accent-500 focus:ring-accent-500"
        />
        <label htmlFor="datenschutz" className="text-sm text-content-muted">
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
        <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/50 px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-glow btn-press w-full px-8 py-4 bg-accent-500 hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium tracking-wide uppercase transition-colors flex items-center justify-center gap-2"
      >
        {submitting && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
