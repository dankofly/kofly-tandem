import { NextRequest, NextResponse } from "next/server";

// TODO: Wire up email sending (e.g. Resend, Nodemailer) or CRM integration
// TODO: Add rate limiting for production

interface TerminPayload {
  type: "termin";
  name: string;
  telefon: string;
  email: string;
  zeitraumVon: string;
  zeitraumBis: string;
  flexibilitaet?: string;
  personenanzahl?: string;
  gewicht?: string;
  fotoVideo?: string;
  nachricht?: string;
}

interface GutscheinPayload {
  type: "gutschein";
  paket: string;
  mediaAddon?: boolean;
  versandart: string;
  rechnungsname: string;
  rechnungsemail: string;
  rechnungstelefon: string;
  empfaengername?: string;
  widmung?: string;
  nachricht?: string;
}

type LeadPayload = TerminPayload | GutscheinPayload;

function validateTermin(data: TerminPayload): string | null {
  if (!data.name?.trim()) return "Name ist erforderlich.";
  if (!data.telefon?.trim()) return "Telefon ist erforderlich.";
  if (!data.email?.trim()) return "E-Mail ist erforderlich.";
  if (!data.zeitraumVon) return "Zeitraum (von) ist erforderlich.";
  if (!data.zeitraumBis) return "Zeitraum (bis) ist erforderlich.";
  return null;
}

function validateGutschein(data: GutscheinPayload): string | null {
  if (!data.paket?.trim()) return "Paket ist erforderlich.";
  if (!data.versandart?.trim()) return "Versandart ist erforderlich.";
  if (!data.rechnungsname?.trim()) return "Rechnungsname ist erforderlich.";
  if (!data.rechnungsemail?.trim()) return "Rechnungs-E-Mail ist erforderlich.";
  if (!data.rechnungstelefon?.trim())
    return "Rechnungstelefon ist erforderlich.";
  return null;
}

async function sendTelegram(body: LeadPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  let text: string;

  if (body.type === "termin") {
    const d = body as TerminPayload;
    text = [
      `✈️ *Neue Terminanfrage*`,
      ``,
      `👤 *Name:* ${esc(d.name)}`,
      `📞 *Telefon:* ${esc(d.telefon)}`,
      `📧 *E-Mail:* ${esc(d.email)}`,
      `📅 *Zeitraum:* ${esc(d.zeitraumVon)} – ${esc(d.zeitraumBis)}`,
      `🔄 *Flexibilität:* ${esc(d.flexibilitaet || "–")}`,
      `👥 *Personen:* ${esc(d.personenanzahl || "1")}`,
      `⚖️ *Gewicht:* ${esc(d.gewicht || "–")}`,
      `📸 *Foto/Video:* ${esc(d.fotoVideo || "–")}`,
      d.nachricht ? `\n💬 *Nachricht:*\n${esc(d.nachricht)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    const d = body as GutscheinPayload;
    text = [
      `🎁 *Neue Gutschein-Bestellung*`,
      ``,
      `📦 *Paket:* ${esc(d.paket)}`,
      `🎬 *Media-Addon:* ${d.mediaAddon ? "Ja" : "Nein"}`,
      `📮 *Versandart:* ${esc(d.versandart)}`,
      `👤 *Rechnungsname:* ${esc(d.rechnungsname)}`,
      `📧 *E-Mail:* ${esc(d.rechnungsemail)}`,
      `📞 *Telefon:* ${esc(d.rechnungstelefon)}`,
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
        parse_mode: "Markdown",
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
  } catch {
    console.error("[LEAD] Error processing request");
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." },
      { status: 500 }
    );
  }
}
