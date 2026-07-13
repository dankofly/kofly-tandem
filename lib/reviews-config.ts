/**
 * Single Source of Truth für Bewertungszahlen.
 *
 * Jede Stelle, die eine Bewertungszahl zeigt (Schema, UI, Meta-Texte,
 * llms.txt, pricing.md), muss mit diesen Werten übereinstimmen.
 * scripts/seo-verify prüft das automatisch.
 *
 * Zahlenbasis (Stand 2026-07): Google Business Profile 41 Bewertungen,
 * Tripadvisor 262 Bewertungen, beide 5,0. Sichtbar kommuniziert wird
 * "300+" mit dem Quell-Label, nie eine Summe ohne Label.
 */
export const REVIEWS = {
  ratingValue: "5.0",
  /** Exakte Zahl für Schema ratingCount/reviewCount (Google + Tripadvisor). */
  countExact: 303,
  /** Sichtbare Angabe in UI und Meta-Texten. */
  displayLabel: "300+",
  /** Gehört überall neben die Zahl, sonst ist sie irreführend. */
  sourceLabel: {
    de: "auf Google & Tripadvisor",
    en: "on Google & Tripadvisor",
    nl: "op Google & Tripadvisor",
  },
  /** Zahl für die Countup-Animation im Reviews-Widget. */
  countUpTarget: 300,
  asOf: "2026-07",
} as const;
