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
  if (!token || !chatId) return;

  let text: string;

  if (body.type === "termin") {
    const d = body;
    text = [
      `✈️ *Neue Terminanfrage*`,
      ``,
      `👤 *Name:* ${esc(d.vorname)} ${esc(d.nachname)}`,
      `📞 *Telefon:* ${esc(d.telefon)}`,
      `📱 *WhatsApp:* ${esc(d.whatsapp || "–")}`,
      `📧 *E\\-Mail:* ${esc(d.email)}`,
      d.wunschtermin ? `🎯 *Wunschtermin:* ${esc(d.wunschtermin)}` : "",
      `📅 *Anreise:* ${esc(d.anreise)}`,
      `📅 *Abreise:* ${esc(d.abreise)}`,
      `👥 *Personen:* ${esc(d.personenanzahl || "1")}`,
      d.paket ? `🎒 *Paket:* ${esc(d.paket)}` : "",
      d.nachricht ? `\n💬 *Nachricht:*\n${esc(d.nachricht)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    const d = body;
    text = [
      `🎁 *Neue Gutschein\\-Bestellung*`,
      ``,
      `👤 *Name:* ${esc(d.vorname)} ${esc(d.nachname)}`,
      `📞 *Telefon:* ${esc(d.telefon)}`,
      `📧 *E\\-Mail:* ${esc(d.email)}`,
      `📦 *Paket:* ${esc(d.paket)}`,
      `📮 *Versandart:* ${esc(d.versandart)}`,
      d.postStrasse ? `🏠 *Adresse:* ${esc(d.postStrasse)}, ${esc(d.postPlzOrt || "")}` : "",
      d.empfaengername ? `🎯 *Empfänger:* ${esc(d.empfaengername)}` : "",
      d.widmung ? `✍️ *Widmung:* ${esc(d.widmung)}` : "",
      d.nachricht ? `\n💬 *Nachricht:*\n${esc(d.nachricht)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
      }),
    });
  } catch (err) {
    console.error("[TELEGRAM] Failed to send notification", err);
  }
}

function esc(s: string): string {
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
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

    // --- Telegram notification ---
    await sendTelegram(body);

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
