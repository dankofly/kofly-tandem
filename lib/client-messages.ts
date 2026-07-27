/**
 * Nur die Namespaces, die Client-Komponenten wirklich brauchen.
 *
 * Hintergrund (Audit 2026-07-27): der NextIntlClientProvider bekam bisher das
 * komplette Message-Objekt (messages/de.json = 189 KB). Next.js serialisiert
 * das in den RSC-Flight-Payload UND in die Provider-Props, deshalb wog jede
 * Seite 400 bis 645 KB HTML. Gebraucht werden davon rund 28 KB.
 *
 * Server-Komponenten holen ihre Texte über getTranslations() und sind von
 * dieser Liste nicht betroffen. Ein fehlender Eintrag hier laesst die
 * betroffene Client-Komponente zur Laufzeit mit MISSING_MESSAGE scheitern,
 * deshalb prueft scripts/seo-verify/consistency-check.mjs die Liste gegen die
 * tatsaechlichen useTranslations()-Aufrufe aller "use client"-Dateien.
 */
export const CLIENT_NAMESPACES = [
  "BookingForm",
  "Buchen",
  "ChatBot",
  "CookieBanner",
  "FAQ",
  "Instagram",
  "MobileCTA",
  "Navigation",
  "NotFound",
  "Reviews",
  "StatsBar",
  "VoucherForm",
] as const;

type Messages = Record<string, unknown>;

export function pickClientMessages(messages: Messages): Messages {
  const picked: Messages = {};
  for (const ns of CLIENT_NAMESPACES) {
    if (ns in messages) picked[ns] = messages[ns];
  }
  return picked;
}
