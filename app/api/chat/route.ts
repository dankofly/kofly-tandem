import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { getSystemPrompt } from "@/lib/chat-config";
import { weatherTool } from "@/lib/weather";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const systemPrompt = await getSystemPrompt();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openrouter.chat("openai/gpt-4o-mini"),
      system: systemPrompt,
      messages: modelMessages,
      tools: { getWeather: weatherTool },
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Chat request failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
