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

    // --- Server-side logging (placeholder) ---
    // In production, replace with email notification, CRM write, or database insert.
    console.log(
      `[LEAD] ${new Date().toISOString()} | type=${body.type}`,
      JSON.stringify(body, null, 2)
    );

    // TODO: Send confirmation email to customer
    // TODO: Send notification to team (email / WhatsApp Business API)
    // TODO: Store in database or CRM

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
