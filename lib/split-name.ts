/**
 * Ein sichtbares Namensfeld im Buchungsformular, zwei Felder im Payload.
 * Getrennt wird am LETZTEN Leerzeichen: "Anna Maria Huber" ergibt
 * "Anna Maria" + "Huber", nicht "Anna" + "Maria Huber".
 * Ohne Leerzeichen bleibt der Nachname leer, das ist erlaubt (siehe
 * validateTermin in app/api/lead/route.ts).
 */
export function splitName(full: string): { vorname: string; nachname: string } {
  const s = full.trim().replace(/\s+/g, " ");
  const cut = s.lastIndexOf(" ");
  return cut > 0
    ? { vorname: s.slice(0, cut), nachname: s.slice(cut + 1) }
    : { vorname: s, nachname: "" };
}
