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

async function sendTelegram(body: LeadPayload): Promise<{ sent: boolean; debug?: string; chatId?: string; token?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { sent: false, debug: `missing env: token=${!!token} chatId=${!!chatId}` };
  }
  // Temporary debug: show masked env values
  const tokenPreview = token.slice(0, 6) + "..." + token.slice(-4);
  const chatIdFull = chatId;

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
      return { sent: false, debug: JSON.stringify(result), chatId: chatIdFull, token: tokenPreview };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, debug: String(err) };
  }
}

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] || c);
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
    const tg = await sendTelegram(body);

    return NextResponse.json({
      success: true,
      message:
        body.type === "termin"
          ? "Deine Terminanfrage wurde erfolgreich gesendet."
          : "Deine Gutschein-Bestellung wurde erfolgreich gesendet.",
      _tg: tg, // TODO: remove after debugging
    });
  } catch (err) {
    console.error("[LEAD] Error processing request", err);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
