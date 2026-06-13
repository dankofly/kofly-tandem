import { tool } from "ai";
import { z } from "zod";

/**
 * getWeather-Tool für die Kofly KI auf gleitschirm-tandemflug.com.
 *
 * EINE Wahrheit: holt die offizielle Flyability-Bewertung vom Tandemify-
 * Endpoint (booking.kofly.at), exakt dieselbe, die Gast und Pilot in der
 * persönlichen Flugseite sehen. Keine eigene Wetter-Heuristik mehr, damit
 * Website-Chat und App-Bewertung nie widersprechen. Schwellen liegen
 * zentral in Tandemify (Nordwind 5/10, Südwind 16/20, Nordföhn 3/4 hPa).
 */
const FLYABILITY_URL =
  process.env.TANDEMIFY_FLYABILITY_URL ??
  "https://booking.kofly.at/api/public/flyability";

export const weatherTool = tool({
  description:
    "Ruft die offizielle Flugwetter-Bewertung für das Tandem-Fluggebiet Lienzer Dolomiten ab (Startplatz Zettersfeld 2.200 m). Liefert aktuelle Bedingungen plus Fliegbarkeit heute und die nächsten Tage mit Begründung. Nutze dieses Tool IMMER, wenn der Gast nach Wetter, Flugbedingungen oder Terminen fragt.",
  inputSchema: z.object({
    type: z
      .enum(["current", "forecast"])
      .default("current")
      .describe("current = Fokus auf jetzt/heute, forecast = nächste Tage"),
  }),
  execute: async () => {
    try {
      const res = await fetch(FLYABILITY_URL, {
        cache: "no-store",
        headers: { origin: "https://gleitschirm-tandemflug.com" },
      });
      if (!res.ok) throw new Error(`flyability ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error("Weather fetch error:", e);
      return {
        error:
          "Wetterdaten konnten leider nicht abgerufen werden. Bitte den Gast auf den WhatsApp-Wetterkanal verweisen (https://whatsapp.com/channel/0029VaEUt2uG8l5KLeLcuF3W).",
      };
    }
  },
});
