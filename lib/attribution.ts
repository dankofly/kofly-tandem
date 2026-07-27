/**
 * First-Party-Attribution ohne Cookies und ohne Drittanbieter-Scripts.
 *
 * Beim ersten Seitenaufruf mit Kampagnen-Parametern (gclid, utm_*) werden
 * diese in sessionStorage gemerkt und beim Absenden einer Anfrage an
 * /api/lead mitgeschickt. So ist jeder Lead seiner Quelle zuordenbar und
 * Google-Ads-Conversions koennen spaeter per gclid offline hochgeladen
 * werden (Google Ads > Ziele > Conversions > Uploads), ohne dass die
 * Website ein Google-Tag laedt.
 *
 * sessionStorage statt localStorage: lebt nur fuer die Tab-Sitzung,
 * minimaler Speicher-Footprint im Sinne der tracking-armen Site-Doktrin.
 */

export interface Attribution {
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  /** Pfad der Einstiegsseite, z.B. /de/tandemflug-lienz */
  landing?: string;
  /** Zeitpunkt des Einstiegs, ISO-8601 */
  ts?: string;
}

const STORAGE_KEY = "kofly_attr";

const PARAM_KEYS = [
  "gclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** Liest Kampagnen-Parameter aus der aktuellen URL und merkt sie fuer die Tab-Sitzung. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const attr: Attribution = {};
    let found = false;
    for (const key of PARAM_KEYS) {
      const value = params.get(key);
      if (value) {
        attr[key] = value.slice(0, 200);
        found = true;
      }
    }
    if (!found) return;
    attr.landing = window.location.pathname;
    attr.ts = new Date().toISOString();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr));
  } catch {
    // sessionStorage kann fehlen (Private Mode, Storage-Block) — Attribution ist optional
  }
}

/** Gibt die gemerkte Attribution zurueck, oder null wenn keine vorliegt. */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}
