import { NextRequest, NextResponse } from "next/server";
import type { Attribution } from "@/lib/attribution";

interface TerminPayload {
  type: "termin";
  vorname: string;
  nachname: string;
  telefon: string;
  whatsapp?: string;
  email?: string;
  wunschtermin?: string;
  anreise: string;
  abreise: string;
  personenanzahl?: string;
  paket?: string;
  nachricht?: string;
  attribution?: Attribution | null;
}

interface GutscheinPayload {
  type: "gutschein";
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
  nachricht?: string;
  empfaengername?: string;
  widmung?: string;
  paket: string;
  versandart: string;
  postStrasse?: string;
  postPlzOrt?: string;
  attribution?: Attribution | null;
}

type LeadPayload = TerminPayload | GutscheinPayload;

/**
 * Pflichtfelder der Terminanfrage: Name, Telefon, Anreise, Abreise.
 *
 * Nachname und E-Mail sind seit 2026-07-27 optional. Das Formular hat nur noch
 * EIN Namensfeld und splittet es clientseitig, ein Gast ohne Leerzeichen im
 * Namen liefert also einen leeren Nachnamen. Kontaktkanal ist Telefon/WhatsApp,
 * die E-Mail war reine Reibung (Konkurrenz bucht mit Sofortbestaetigung).
 */
/**
 * Maximallaengen der eingehenden Felder.
 *
 * Vorher gab es keine. Die Route nahm beliebig lange Strings entgegen und
 * schob sie in ein Telegram-Kommando, einen Log-Eintrag und eine
 * Fremd-API weiter.
 *
 * Herkunft der Zahlen:
 *  - EMAIL 254: RFC 5321, Abschnitt 4.5.3.1.3, maximale Laenge eines
 *    Reverse-Path bzw. einer Adresse. Veroeffentlichter Standard.
 *  - NACHRICHT 2000: Telegram begrenzt sendMessage auf 4096 Zeichen
 *    (dokumentiertes Anbieterlimit). Der Rest des Textbausteins mit
 *    Name, Telefon, Datum und Attribution braucht Platz, deshalb rund
 *    die Haelfte fuer das freie Feld.
 *  - Die uebrigen Werte haben keine normative Quelle. Sie sind bewusst
 *    grosszuegig gewaehlt. Entscheidend ist nicht der genaue Wert,
 *    sondern dass eine Grenze existiert: das Risiko war unbegrenzte
 *    Eingabe, und das behebt jede vernuenftige Schranke.
 *    Praezedenzfall im Projekt: lib/attribution.ts kappt Kampagnenwerte
 *    auf 200 Zeichen.
 */
const FELD_MAX: Record<string, number> = {
  vorname: 100,
  nachname: 100,
  telefon: 32,
  email: 254,
  paket: 120,
  anreise: 32,
  abreise: 32,
  nachricht: 2000,
  personen: 16,
  gewicht: 16,
  anlass: 120,
  lieferung: 60,
};

/** Kappt alle bekannten String-Felder und meldet, was zu lang war. */
function pruefeLaengen(body: Record<string, unknown>): string | null {
  for (const [feld, max] of Object.entries(FELD_MAX)) {
    const wert = body[feld];
    if (typeof wert === "string" && wert.length > max) {
      return `Feld "${feld}" ist zu lang (maximal ${max} Zeichen).`;
    }
  }
  return null;
}

function validateTermin(data: TerminPayload): string | null {
  if (!data.vorname?.trim()) return "Name ist erforderlich.";
  if (!data.telefon?.trim()) return "Telefon ist erforderlich.";
  if (!data.anreise) return "Anreise ist erforderlich.";
  if (!data.abreise) return "Abreise ist erforderlich.";
  return null;
}

function validateGutschein(data: GutscheinPayload): string | null {
  if (!data.vorname?.trim()) return "Vorname ist erforderlich.";
  if (!data.nachname?.trim()) return "Nachname ist erforderlich.";
  if (!data.telefon?.trim()) return "Telefon ist erforderlich.";
  if (!data.email?.trim()) return "E-Mail ist erforderlich.";
  if (!data.paket?.trim()) return "Paket ist erforderlich.";
  return null;
}

async function sendTelegram(body: LeadPayload): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[TELEGRAM] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  let text: string;

  if (body.type === "termin") {
    const d = body;
    text = [
      `✈️ <b>Neue Terminanfrage</b>`,
      ``,
      `👤 <b>Name:</b> ${esc(`${d.vorname} ${d.nachname || ""}`.trim())}`,
      `📞 <b>Telefon:</b> ${esc(d.telefon)}`,
      `📱 <b>WhatsApp:</b> ${esc(d.whatsapp || "–")}`,
      `📧 <b>E-Mail:</b> ${esc(d.email || "–")}`,
      d.wunschtermin ? `🎯 <b>Wunschtermin:</b> ${esc(d.wunschtermin)}` : "",
      `📅 <b>Anreise:</b> ${esc(d.anreise)}`,
      `📅 <b>Abreise:</b> ${esc(d.abreise)}`,
      `👥 <b>Personen:</b> ${esc(d.personenanzahl || "1")}`,
      d.paket ? `🎒 <b>Paket:</b> ${esc(d.paket)}` : "",
      d.nachricht ? `\n💬 <b>Nachricht:</b>\n${esc(d.nachricht)}` : "",
      formatAttribution(d.attribution),
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    const d = body;
    text = [
      `🎁 <b>Neue Gutschein-Bestellung</b>`,
      ``,
      `👤 <b>Name:</b> ${esc(d.vorname)} ${esc(d.nachname)}`,
      `📞 <b>Telefon:</b> ${esc(d.telefon)}`,
      `📧 <b>E-Mail:</b> ${esc(d.email)}`,
      `📦 <b>Paket:</b> ${esc(d.paket)}`,
      `📮 <b>Versandart:</b> ${esc(d.versandart)}`,
      d.postStrasse ? `🏠 <b>Adresse:</b> ${esc(d.postStrasse)}, ${esc(d.postPlzOrt || "")}` : "",
      d.empfaengername ? `🎯 <b>Empfänger:</b> ${esc(d.empfaengername)}` : "",
      d.widmung ? `✍️ <b>Widmung:</b> ${esc(d.widmung)}` : "",
      d.nachricht ? `\n💬 <b>Nachricht:</b>\n${esc(d.nachricht)}` : "",
      formatAttribution(d.attribution),
    ]
      .filter(Boolean)
      .join("\n");
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    const result = await res.json();
    if (!result.ok) {
      console.error("[TELEGRAM] API error:", JSON.stringify(result));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[TELEGRAM] Failed to send notification", err);
    return false;
  }
}

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] || c);
}

/**
 * Kampagnen-Herkunft fuer die Telegram-Nachricht. Der gclid wird vollstaendig
 * mitgeschickt: er ist der Schluessel fuer den Offline-Conversion-Upload in
 * Google Ads (siehe ops/google-ads/RESTART-PLAN.md).
 */
function formatAttribution(attr?: Attribution | null): string {
  if (!attr || typeof attr !== "object") return "";
  const source = [attr.utm_source, attr.utm_medium, attr.utm_campaign]
    .filter(Boolean)
    .join(" / ");
  const lines = [
    source ? `📈 <b>Quelle:</b> ${esc(source)}` : "",
    attr.utm_content ? `🏷 <b>Content:</b> ${esc(attr.utm_content)}` : "",
    attr.landing ? `🛬 <b>Einstieg:</b> ${esc(attr.landing)}` : "",
    attr.gclid ? `🔑 <b>gclid:</b> <code>${esc(attr.gclid)}</code>` : "",
  ].filter(Boolean);
  return lines.length ? `\n${lines.join("\n")}` : "";
}

function isISODate(s?: string): boolean {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/**
 * Bridge zu Tandemify (booking.kofly.at): legt die Terminanfrage zusaetzlich
 * als echte Inquiry an, damit sie die volle Customer Journey bekommt (Hub,
 * Briefing, Status). Server-zu-Server mit geteiltem Secret, best-effort:
 * Fehler/Timeout brechen NIE den Telegram-Flow oder die User-Response.
 */
async function forwardToTandemify(d: TerminPayload): Promise<boolean> {
  const url = process.env.TANDEMIFY_INTAKE_URL;
  const secret = process.env.INQUIRY_INTAKE_SECRET;
  if (!url || !secret) {
    console.warn("[BRIDGE] TANDEMIFY_INTAKE_URL/INQUIRY_INTAKE_SECRET fehlt, skip");
    return false;
  }

  // wishDate robust: gueltiges ISO-Datum aus wunschtermin, sonst anreise.
  // Freitext-Wunschtermin wandert in die Nachricht statt das Datum zu brechen.
  const wishDate = isISODate(d.wunschtermin) ? d.wunschtermin! : d.anreise;
  const noteParts: string[] = [];
  if (d.wunschtermin && !isISODate(d.wunschtermin)) {
    noteParts.push(`Wunschtermin: ${d.wunschtermin}`);
  }
  if (d.whatsapp) noteParts.push(`WhatsApp: ${d.whatsapp}`);
  if (d.nachricht) noteParts.push(d.nachricht);

  const payload = {
    passengerName: `${d.vorname} ${d.nachname}`.trim(),
    passengerPhone: d.telefon,
    passengerEmail: d.email || null,
    wishDate,
    arrivalDate: d.anreise || null,
    departureDate: d.abreise || null,
    passengerCount: d.personenanzahl ? parseInt(d.personenanzahl, 10) || 1 : 1,
    passengerLanguage: "de",
    flightPackageLabel: d.paket || null,
    message: noteParts.length ? noteParts.join(" · ") : null,
    source: "gleitschirm-tandemflug.com",
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-intake-secret": secret,
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("[BRIDGE] Tandemify intake non-OK:", res.status, txt);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[BRIDGE] Tandemify intake failed:", err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadPayload = await request.json();

    // Validate type
    if (body.type !== "termin" && body.type !== "gutschein") {
      return NextResponse.json(
        { error: "Ungültiger Anfragetyp." },
        { status: 400 }
      );
    }

    // Laengen vor allem anderen: begrenzt, was ueberhaupt weiterverarbeitet wird
    const laengenFehler = pruefeLaengen(body as unknown as Record<string, unknown>);
    if (laengenFehler) {
      return NextResponse.json({ error: laengenFehler }, { status: 413 });
    }

    // Validate based on type
    const validationError =
      body.type === "termin"
        ? validateTermin(body as TerminPayload)
        : validateGutschein(body as GutscheinPayload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // --- Server-side logging ---
    console.log(
      `[LEAD] ${new Date().toISOString()} | type=${body.type}`,
      JSON.stringify(body, null, 2)
    );

    // --- Zustellung: Telegram primaer, Bruecke zusaetzlich ---
    // Beide laufen, auch wenn eine fehlschlaegt. Erfolg wird nur gemeldet,
    // wenn mindestens ein Empfaenger den Lead tatsaechlich angenommen hat.
    // Vorher meldete die Route immer success, auch wenn beide still
    // fehlschlugen: der Gast glaubte dann, seine Anfrage sei angekommen.
    const [telegramOk, brueckeOk] = await Promise.all([
      sendTelegram(body),
      body.type === "termin"
        ? forwardToTandemify(body as TerminPayload)
        : Promise.resolve(false),
    ]);

    if (!telegramOk && !brueckeOk) {
      console.error("[LEAD] Kein Empfaenger hat den Lead angenommen");
      return NextResponse.json(
        {
          error:
            "Deine Anfrage konnte gerade nicht zugestellt werden. Bitte schreib uns kurz per WhatsApp an +43 676 7293888.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        body.type === "termin"
          ? "Deine Terminanfrage wurde erfolgreich gesendet."
          : "Deine Gutschein-Bestellung wurde erfolgreich gesendet.",
    });
  } catch (err) {
    console.error("[LEAD] Error processing request", err);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
