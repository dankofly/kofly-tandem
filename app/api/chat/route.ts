import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { getSystemPrompt } from "@/lib/chat-config";
import { weatherTool } from "@/lib/weather";
import {
  CHAT_TIMEOUT_MS,
  pruneRateLimit,
  rateLimitOk,
  validateChatBody,
} from "@/lib/chat-limits";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

function json(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Absender-IP hinter dem Netlify-Edge. Fallback, damit die Drossel nie crasht. */
function absenderIp(req: Request): string {
  const fwd = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unbekannt";
}

export async function POST(req: Request) {
  // Reihenfolge ist Absicht: erst alles pruefen, was nichts kostet, dann
  // erst den Systemprompt laden und das Modell aufrufen.
  const ip = absenderIp(req);
  pruneRateLimit();
  if (!rateLimitOk(ip)) {
    return json(429, "Too many requests");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, "Invalid JSON");
  }

  const geprueft = validateChatBody(body);
  if (!geprueft.ok) {
    return json(geprueft.status, geprueft.error);
  }

  // Timeout gegen den Anbieter: ohne ihn wird eine haengende Antwort zur
  // haengenden Function. Siehe Begruendung in lib/chat-limits.ts.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  try {
    const systemPrompt = await getSystemPrompt();
    // validateChatBody hat Struktur, Anzahl und Laengen geprueft. Die
    // Feinstruktur einer UIMessage prueft das SDK selbst beim Konvertieren.
    const modelMessages = await convertToModelMessages(
      geprueft.messages as Parameters<typeof convertToModelMessages>[0]
    );

    const result = streamText({
      model: openrouter.chat("openai/gpt-4o-mini"),
      system: systemPrompt,
      messages: modelMessages,
      tools: { getWeather: weatherTool },
      stopWhen: stepCountIs(2),
      abortSignal: controller.signal,
      onFinish: () => clearTimeout(timer),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    clearTimeout(timer);
    console.error("Chat API error:", error);
    return json(500, "Chat request failed");
  }
}
