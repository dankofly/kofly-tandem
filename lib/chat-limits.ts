/**
 * Serverseitige Grenzen fuer /api/chat.
 *
 * Hintergrund: Bis 2026-08-08 standen die Grenzen ausschliesslich in
 * components/ChatBot.tsx, also im Client. Der Endpunkt selbst nahm beliebig
 * viele, beliebig lange Nachrichten entgegen und reichte sie an einen
 * kostenpflichtigen LLM-Anbieter weiter. Eine curl-Zeile umging die Limits.
 *
 * Quellen der Zahlen (Regel: keine erfundenen Werte):
 *  - MAX_MESSAGES und MAX_INPUT_LENGTH sind die bereits im Projekt
 *    dokumentierten Werte aus components/ChatBot.tsx, Zeile 8 und 9.
 *    Der Server spiegelt hier bewusst das Clientverhalten, statt eine
 *    zweite, abweichende Zahl zu erfinden.
 *  - MAX_TOTAL_CHARS ist daraus abgeleitet: MAX_MESSAGES * MAX_INPUT_LENGTH.
 *    Kein eigener Erfahrungswert, sondern die Obergrenze dessen, was ein
 *    regulaerer Client ueberhaupt senden kann.
 */
export const MAX_MESSAGES = 20;
export const MAX_INPUT_LENGTH = 500;
export const MAX_TOTAL_CHARS = MAX_MESSAGES * MAX_INPUT_LENGTH;

/**
 * Zeitgrenze fuer den Aufruf gegen OpenRouter.
 *
 * INSUFFICIENT DATA TO VERIFY: Es liegen keine Antwortzeit-Messungen vor.
 * Der Wert ist bewusst als Umgebungsvariable ausgelagert, damit er ohne
 * Deploy korrigierbar ist, sobald p95 und p99 aus den Netlify-Function-Logs
 * bekannt sind. Der Fallback ist keine gemessene Groesse, sondern nur die
 * Entscheidung, dass "irgendwann abbrechen" besser ist als "nie abbrechen":
 * ohne Timeout wird eine haengende Antwort des Anbieters zur haengenden
 * Function und damit zu Kosten ohne Gegenwert.
 */
export const CHAT_TIMEOUT_MS = Number(process.env.CHAT_TIMEOUT_MS ?? 30_000);

export type ChatValidation =
  | { ok: true; messages: unknown[] }
  | { ok: false; status: number; error: string };

/**
 * Prueft den eingehenden Body, bevor irgendetwas Geld kostet.
 * Bewusst vor jedem Aufruf an getSystemPrompt() oder das Modell.
 */
export function validateChatBody(body: unknown): ChatValidation {
  if (typeof body !== "object" || body === null) {
    return { ok: false, status: 400, error: "Invalid body" };
  }

  const { messages } = body as { messages?: unknown };

  if (!Array.isArray(messages)) {
    return { ok: false, status: 400, error: "messages must be an array" };
  }
  if (messages.length === 0) {
    return { ok: false, status: 400, error: "messages must not be empty" };
  }
  if (messages.length > MAX_MESSAGES) {
    return {
      ok: false,
      status: 413,
      error: `Too many messages (max ${MAX_MESSAGES})`,
    };
  }

  // Textlaenge pro Nachricht und in Summe. Die Struktur der AI-SDK-Nachricht
  // kann "content" als String oder "parts" als Array tragen, deshalb beides.
  let gesamt = 0;
  for (const m of messages) {
    if (typeof m !== "object" || m === null) {
      return { ok: false, status: 400, error: "Malformed message" };
    }
    const msg = m as { content?: unknown; parts?: unknown };
    let text = "";
    if (typeof msg.content === "string") {
      text = msg.content;
    } else if (Array.isArray(msg.parts)) {
      text = msg.parts
        .map((p) =>
          typeof p === "object" && p !== null && typeof (p as { text?: unknown }).text === "string"
            ? (p as { text: string }).text
            : ""
        )
        .join("");
    }
    if (text.length > MAX_INPUT_LENGTH) {
      return {
        ok: false,
        status: 413,
        error: `Message too long (max ${MAX_INPUT_LENGTH} characters)`,
      };
    }
    gesamt += text.length;
  }

  if (gesamt > MAX_TOTAL_CHARS) {
    return {
      ok: false,
      status: 413,
      error: `Conversation too long (max ${MAX_TOTAL_CHARS} characters)`,
    };
  }

  return { ok: true, messages };
}

/**
 * Sehr einfache Drossel pro Absender-IP.
 *
 * EHRLICHE EINORDNUNG: Der Zaehler lebt im Arbeitsspeicher einer einzelnen
 * Function-Instanz. Netlify kann mehrere Instanzen parallel starten und
 * beendet sie wieder, der Zaehler ist damit weder geteilt noch dauerhaft.
 * Das ist eine Bremsschwelle gegen naives Skripten, keine Garantie.
 *
 * Eine echte Garantie braucht geteilten Zustand (Netlify Blobs mit
 * bedingtem Write oder die Rate-Limiting-Funktion der Plattform). Beides
 * ist eine Entscheidung mit Kosten- und Latenzfolgen und wurde bewusst
 * nicht ohne Messdaten getroffen. Die Eingabegrenzen oben begrenzen
 * unabhaengig davon die Kosten *pro Anfrage*, und das war das eigentliche
 * Loch.
 *
 * REQUESTS_PER_WINDOW und WINDOW_MS: INSUFFICIENT DATA TO VERIFY. Es gibt
 * keine Verteilung der Requests pro IP aus den Function-Logs. Beide Werte
 * sind ueber Umgebungsvariablen korrigierbar.
 */
const WINDOW_MS = Number(process.env.CHAT_RATE_WINDOW_MS ?? 60_000);
const REQUESTS_PER_WINDOW = Number(process.env.CHAT_RATE_MAX ?? 12);

const fenster = new Map<string, { count: number; reset: number }>();

export function rateLimitOk(ip: string, now = Date.now()): boolean {
  const eintrag = fenster.get(ip);
  if (!eintrag || now > eintrag.reset) {
    fenster.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  eintrag.count += 1;
  if (eintrag.count > REQUESTS_PER_WINDOW) return false;
  return true;
}

/** Haelt die Map klein, falls eine Instanz lange lebt. */
export function pruneRateLimit(now = Date.now()): void {
  for (const [ip, e] of fenster) if (now > e.reset) fenster.delete(ip);
}
