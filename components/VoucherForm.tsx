"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";

const showMediaAddon = (paket: string) =>
  paket === "premium" || paket === "thermik" || paket === "classic";

export default function VoucherForm() {
  const t = useTranslations("VoucherForm");
  const locale = useLocale();
  const [paket, setPaket] = useState("premium");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const paketOptions = [
    { value: "premium", label: t("premiumOption") },
    { value: "thermik", label: t("thermikOption") },
    { value: "classic-media", label: t("classicMediaOption") },
    { value: "classic", label: t("classicOption") },
  ];

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
      paket: data.get("paket"),
      mediaAddon: data.get("media_addon") === "ja",
      versandart: data.get("versandart"),
      rechnungsname: data.get("rechnungsname"),
      rechnungsemail: data.get("rechnungsemail"),
      rechnungstelefon: data.get("rechnungstelefon"),
      empfaengername: data.get("empfaengername"),
      widmung: data.get("widmung"),
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
      <div className="glass-card p-10 text-center">
        <span className="block text-accent-500 text-2xl mb-4">{"\u2713"}</span>
        <h3 className="text-lg font-semibold text-content-primary mb-3">
          {t("successTitle")}
        </h3>
        <p className="text-sm text-content-muted leading-relaxed font-light max-w-md mx-auto">
          {t("successText")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="company">Firma</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Paket */}
      <div>
        <label htmlFor="paket" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
          {t("paketLabel")}
        </label>
        <select
          id="paket"
          name="paket"
          required
          value={paket}
          onChange={(e) => setPaket(e.target.value)}
          className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
        >
          {paketOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Media Addon – shown if not already included */}
      {showMediaAddon(paket) && (
        <div className="bg-accent-500/5 border border-accent-500/20 p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="media_addon"
              name="media_addon"
              value="ja"
              className="mt-1 w-4 h-4 border-edge-secondary rounded bg-surface-input text-accent-500 focus:ring-accent-500"
            />
            <label htmlFor="media_addon" className="text-sm text-content-body">
              <strong>{t("mediaAddon")}</strong> {t("mediaAddonAdd")}
            </label>
          </div>
        </div>
      )}

      {/* Versandart */}
      <div>
        <label htmlFor="versandart" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
          {t("versandart")}
        </label>
        <select
          id="versandart"
          name="versandart"
          required
          className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
        >
          <option value="abholung">{t("abholung")}</option>
          <option value="post">{t("post")}</option>
        </select>
      </div>

      {/* Rechnungsdaten */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-content-strong mb-2">
          {t("rechnungsdaten")}
        </legend>
        <div>
          <label htmlFor="rechnungsname" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("rechnungsname")}
          </label>
          <input
            type="text"
            id="rechnungsname"
            name="rechnungsname"
            required
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
            placeholder={t("rechnungsnamePlaceholder")}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rechnungsemail" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
              {t("rechnungsemail")}
            </label>
            <input
              type="email"
              id="rechnungsemail"
              name="rechnungsemail"
              required
              className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
              placeholder="deine@email.at"
            />
          </div>
          <div>
            <label htmlFor="rechnungstelefon" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
              {t("rechnungstelefon")}
            </label>
            <input
              type="tel"
              id="rechnungstelefon"
              name="rechnungstelefon"
              required
              className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
              placeholder="+43 ..."
            />
          </div>
        </div>
      </fieldset>

      {/* Optional fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="empfaengername" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("empfaengername")}
          </label>
          <input
            type="text"
            id="empfaengername"
            name="empfaengername"
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
            placeholder={t("empfaengerPlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="widmung" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("widmung")}
          </label>
          <input
            type="text"
            id="widmung"
            name="widmung"
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
            placeholder={t("widmungPlaceholder")}
          />
        </div>
      </div>

      {/* Nachricht */}
      <div>
        <label htmlFor="gutschein_nachricht" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
          {t("nachricht")}
        </label>
        <textarea
          id="gutschein_nachricht"
          name="nachricht"
          rows={3}
          className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors resize-y"
          placeholder={t("nachrichtPlaceholder")}
        />
      </div>

      {/* AGB Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="voucher_agb"
          name="agb"
          required
          className="mt-1 w-4 h-4 border-edge-secondary rounded bg-surface-input text-accent-500 focus:ring-accent-500"
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

      {/* Datenschutz Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="voucher_datenschutz"
          name="datenschutz"
          required
          className="mt-1 w-4 h-4 border-edge-secondary rounded bg-surface-input text-accent-500 focus:ring-accent-500"
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
        <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/50 px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-glow w-full px-8 py-4 bg-accent-500 hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium tracking-wide uppercase transition-colors"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>

      <p className="text-xs text-content-subtle text-center font-light">
        {t("paymentNote")}
      </p>
    </form>
  );
}
