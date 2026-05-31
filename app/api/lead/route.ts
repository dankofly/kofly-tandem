import { NextRequest, NextResponse } from "next/server";

interface TerminPayload {
  type: "termin";
  vorname: string;
  nachname: string;
  telefon: string;
  whatsapp?: string;
  email: string;
  wunschtermin?: string;
  anreise: string;
  abreise: string;
  personenanzahl?: string;
  paket?: string;
  nachricht?: string;
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
}

type LeadPayload = TerminPayload | GutscheinPayload;

function validateTermin(data: TerminPayload): string | null {
  if (!data.vorname?.trim()) return "Vorname ist erforderlich.";
  if (!data.nachname?.trim()) return "Nachname ist erforderlich.";
  if (!data.telefon?.trim()) return "Telefon ist erforderlich.";
  if (!data.email?.trim()) return "E-Mail ist erforderlich.";
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

async function sendTelegram(body: LeadPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[TELEGRAM] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return;
  }

  let text: string;

  if (body.type === "termin") {
    const d = body;
    text = [
      `✈️ <b>Neue Terminanfrage</b>`,
      ``,
      `👤 <b>Name:</b> ${esc(d.vorname)} ${esc(d.nachname)}`,
      `📞 <b>Telefon:</b> ${esc(d.telefon)}`,
      `📱 <b>WhatsApp:</b> ${esc(d.whatsapp || "–")}`,
      `📧 <b>E-Mail:</b> ${esc(d.email)}`,
      d.wunschtermin ? `🎯 <b>Wunschtermin:</b> ${esc(d.wunschtermin)}` : "",
      `📅 <b>Anreise:</b> ${esc(d.anreise)}`,
      `📅 <b>Abreise:</b> ${esc(d.abreise)}`,
      `👥 <b>Personen:</b> ${esc(d.personenanzahl || "1")}`,
      d.paket ? `🎒 <b>Paket:</b> ${esc(d.paket)}` : "",
      d.nachricht ? `\n💬 <b>Nachricht:</b>\n${esc(d.nachricht)}` : "",
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
    }
  } catch (err) {
    console.error("[TELEGRAM] Failed to send notification", err);
  }
}

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] || c);
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
async function forwardToTandemify(d: TerminPayload): Promise<void> {
  const url = process.env.TANDEMIFY_INTAKE_URL;
  const secret = process.env.INQUIRY_INTAKE_SECRET;
  if (!url || !secret) {
    console.warn("[BRIDGE] TANDEMIFY_INTAKE_URL/INQUIRY_INTAKE_SECRET fehlt, skip");
    return;
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
    }
  } catch (err) {
    console.error("[BRIDGE] Tandemify intake failed:", err);
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

    // --- Telegram notification (primaer) ---
    await sendTelegram(body);

    // --- Bridge: Terminanfragen zusaetzlich als Inquiry in Tandemify ---
    if (body.type === "termin") {
      await forwardToTandemify(body as TerminPayload);
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
