import { getStore } from "@netlify/blobs";

/**
 * Ticker-Eintraege.
 *
 * Bis 2026-08-08 schrieb diese Datei per writeFile nach
 * process.cwd() + "/data/ticker-config.json". Auf Netlify-Functions ist das
 * Dateisystem zur Laufzeit schreibgeschuetzt, ausser /tmp. Das Speichern
 * ueber /api/admin/ticker konnte in der Produktion also gar nicht
 * funktionieren, und der Fehler waere still gewesen: die Route meldete
 * Erfolg, der Wert war beim naechsten Aufruf wieder der alte.
 *
 * Jetzt Netlify Blobs, exakt nach dem Muster von lib/videos-config.ts.
 * consistency "strong", weil ein Admin unmittelbar nach dem Speichern die
 * Liste neu laedt und dann den neuen Stand sehen muss, nicht den alten.
 */
const STORE_NAME = "ticker";
const CONFIG_KEY = "ticker-config";

const DEFAULT_ITEMS = ["Tandemflug ab 150 €", "Airpark Lienzer Dolomiten"];

interface TickerConfig {
  items: string[];
}

function getTickerStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function getTickerItems(): Promise<string[]> {
  try {
    const raw = await getTickerStore().get(CONFIG_KEY, { type: "text" });
    if (raw) {
      const config: TickerConfig = JSON.parse(raw);
      if (Array.isArray(config.items) && config.items.length) return config.items;
    }
  } catch {
    // Store nicht verfuegbar (lokale Entwicklung, erster Deploy).
    // Der Ticker ist Dekoration, ein Fallback ist hier richtig.
  }
  return [...DEFAULT_ITEMS];
}

export async function saveTickerItems(items: string[]): Promise<void> {
  await getTickerStore().set(CONFIG_KEY, JSON.stringify({ items }));
}
