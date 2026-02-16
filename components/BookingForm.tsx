"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

const weightRanges = [
  "40\u201350 kg",
  "50\u201360 kg",
  "60\u201370 kg",
  "70\u201380 kg",
  "80\u201390 kg",
  "90\u2013100 kg",
  "100\u2013110 kg",
];

export default function BookingForm() {
  const t = useTranslations("BookingForm");
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
      name: data.get("name"),
      telefon: data.get("telefon"),
      email: data.get("email"),
      zeitraumVon: data.get("zeitraum_von"),
      zeitraumBis: data.get("zeitraum_bis"),
      flexibilitaet: data.get("flexibilitaet"),
      personenanzahl: data.get("personenanzahl"),
      gewicht: data.get("gewicht"),
      fotoVideo: data.get("foto_video"),
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
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
          {t("name")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
          placeholder={t("namePlaceholder")}
        />
      </div>

      {/* Telefon + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="telefon" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("telefon")}
          </label>
          <input
            type="tel"
            id="telefon"
            name="telefon"
            required
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
            placeholder="+43 ..."
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("email")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
            placeholder={t("emailPlaceholder")}
          />
        </div>
      </div>

      {/* Zeitraum */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="zeitraum_von" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("zeitraumVon")}
          </label>
          <input
            type="date"
            id="zeitraum_von"
            name="zeitraum_von"
            required
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="zeitraum_bis" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("zeitraumBis")}
          </label>
          <input
            type="date"
            id="zeitraum_bis"
            name="zeitraum_bis"
            required
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Flexibilität + Personenanzahl */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="flexibilitaet" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("flexibilitaet")}
          </label>
          <select
            id="flexibilitaet"
            name="flexibilitaet"
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
          >
            <option value="hoch">{t("flexHoch")}</option>
            <option value="mittel">{t("flexMittel")}</option>
            <option value="gering">{t("flexGering")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="personenanzahl" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("personenanzahl")}
          </label>
          <input
            type="number"
            id="personenanzahl"
            name="personenanzahl"
            min="1"
            max="10"
            defaultValue="1"
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Gewicht + Foto/Video */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="gewicht" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("gewicht")}
          </label>
          <select
            id="gewicht"
            name="gewicht"
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
          >
            <option value="">{t("gewichtPlaceholder")}</option>
            {weightRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
            <option value="110–120 kg">{t("gewichtOnRequest")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="foto_video" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
            {t("fotoVideo")}
          </label>
          <select
            id="foto_video"
            name="foto_video"
            className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors"
          >
            <option value="ja">{t("fotoJa")}</option>
            <option value="nein">{t("fotoNein")}</option>
          </select>
        </div>
      </div>

      {/* Nachricht */}
      <div>
        <label htmlFor="nachricht" className="block text-xs font-medium text-content-body mb-2 tracking-wide">
          {t("nachricht")}
        </label>
        <textarea
          id="nachricht"
          name="nachricht"
          rows={3}
          className="w-full px-4 py-3 border border-edge-input bg-surface-input text-content-strong placeholder:text-content-placeholder focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-colors resize-y"
          placeholder={t("nachrichtPlaceholder")}
        />
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="voraussetzungen"
          name="voraussetzungen"
          required
          className="mt-1 w-4 h-4 border-edge-secondary rounded bg-surface-input text-accent-500 focus:ring-accent-500"
        />
        <label htmlFor="voraussetzungen" className="text-sm text-content-muted">
          {t("voraussetzungen")}
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
    </form>
  );
}
