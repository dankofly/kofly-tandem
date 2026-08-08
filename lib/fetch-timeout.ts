/**
 * fetch mit harter Zeitgrenze.
 *
 * Hintergrund: Drei serverseitige Aufrufe an fremde Systeme liefen ohne
 * Timeout (OpenRouter, Instagram Graph, Flyability). Ohne Timeout wird eine
 * haengende Gegenstelle zur haengenden Netlify-Function. Das Muster stand
 * bereits einmal inline in app/api/lead/route.ts und ist jetzt an einer
 * Stelle.
 *
 * Zur Zahl: Es gibt fuer dieses Projekt keine Antwortzeit-Messungen der
 * betroffenen Dienste. Der Standardwert ist deshalb NICHT als "richtig"
 * behauptet, sondern nur als "besser als unendlich". Jede Aufrufstelle
 * kann ihn setzen, und jede sollte ihn korrigieren, sobald p95 und p99 aus
 * den Netlify-Function-Logs vorliegen.
 *
 * INSUFFICIENT DATA TO VERIFY fuer den Defaultwert.
 */
export const DEFAULT_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS ?? 5000);

export async function fetchMitTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
