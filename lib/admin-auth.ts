import { timingSafeEqual } from "crypto";

/**
 * Eine Stelle fuer die Admin-Autorisierung.
 *
 * Vorher stand dieselbe Funktion wortgleich in vier Routen
 * (images, prompt, ticker, videos). Eine Verschaerfung haette an vier
 * Stellen nachgezogen werden muessen, was in der Praxis heisst: an einer
 * wird sie vergessen.
 *
 * Was hier bewusst NICHT behauptet wird: Das ist kein starkes
 * Authentifizierungsverfahren. Es bleibt ein geteiltes statisches
 * Passwort, das bei jedem Request mitlaeuft, ohne Ablauf und ohne
 * Rotation. Es schuetzt einen Bildupload-Bereich, keine Kundendaten.
 * Ein Wechsel auf echte Sitzungen oder einen Identitaetsanbieter waere
 * die richtige Loesung, ist aber eine Entscheidung mit eigenem Aufwand.
 *
 * Verbessert wurden gegenueber vorher drei Dinge:
 *  1. Vergleich in konstanter Zeit statt mit ===
 *  2. Drossel gegen Rateversuche
 *  3. eine Stelle statt vier
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Fehlversuche pro IP.
 *
 * EHRLICHE EINORDNUNG, wie bei der Chat-Drossel: Der Zaehler lebt im
 * Arbeitsspeicher einer Function-Instanz und ist deshalb weder geteilt
 * noch dauerhaft. Gegen ein verteiltes Rateskript hilft er nicht. Gegen
 * das, was realistisch passiert, hilft er.
 *
 * MAX_FEHLVERSUCHE und SPERRE_MS: INSUFFICIENT DATA TO VERIFY.
 * NIST SP 800-63B Abschnitt 5.2.2 verlangt eine Drosselung, nennt aber
 * keine feste Zahl, sondern hoechstens 100 Fehlversuche pro Konto und
 * Zeitraum als Obergrenze fuer die dortige Betrachtung. Die Werte hier
 * liegen bewusst darunter und sind ueber Umgebungsvariablen aenderbar.
 */
const MAX_FEHLVERSUCHE = Number(process.env.ADMIN_MAX_FAILED_ATTEMPTS ?? 10);
const SPERRE_MS = Number(process.env.ADMIN_LOCKOUT_MS ?? 15 * 60_000);

const fehlversuche = new Map<string, { count: number; reset: number }>();

function absenderIp(req: Request): string {
  const fwd =
    req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unbekannt";
}

/** Vergleich in konstanter Zeit. Laengenunterschiede leaken nichts Nutzbares. */
function gleich(a: string, b: string): boolean {
  const pa = Buffer.from(a, "utf8");
  const pb = Buffer.from(b, "utf8");
  if (pa.length !== pb.length) {
    // Trotzdem einmal vergleichen, damit der Zeitverlauf nicht von der
    // Laenge abhaengt. Ergebnis wird verworfen.
    timingSafeEqual(pa, pa);
    return false;
  }
  return timingSafeEqual(pa, pb);
}

export type AdminCheck = { ok: true } | { ok: false; status: number; error: string };

export function checkAdmin(req: Request, now = Date.now()): AdminCheck {
  const ip = absenderIp(req);

  for (const [k, v] of fehlversuche) if (now > v.reset) fehlversuche.delete(k);

  const gesperrt = fehlversuche.get(ip);
  if (gesperrt && gesperrt.count >= MAX_FEHLVERSUCHE && now <= gesperrt.reset) {
    return { ok: false, status: 429, error: "Too many failed attempts" };
  }

  // Ohne gesetztes Passwort ist der Bereich zu, nicht offen.
  if (!ADMIN_PASSWORD) {
    return { ok: false, status: 503, error: "Admin access not configured" };
  }

  const auth = req.headers.get("authorization");
  const erwartet = `Bearer ${ADMIN_PASSWORD}`;

  if (auth && gleich(auth, erwartet)) {
    fehlversuche.delete(ip);
    return { ok: true };
  }

  const e = fehlversuche.get(ip);
  if (!e || now > e.reset) {
    fehlversuche.set(ip, { count: 1, reset: now + SPERRE_MS });
  } else {
    e.count += 1;
  }
  return { ok: false, status: 401, error: "Unauthorized" };
}

/** Bequemer Wrapper fuer die Routen: gibt bei Ablehnung direkt die Response. */
export function adminGuard(req: Request): Response | null {
  const r = checkAdmin(req);
  if (r.ok) return null;
  return new Response(JSON.stringify({ error: r.error }), {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
