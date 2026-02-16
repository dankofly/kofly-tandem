import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getSystemPrompt } from "@/lib/chat-config";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const systemPrompt = await getSystemPrompt();

  const result = streamText({
    model: openrouter("openai/gpt-4o-mini"),
    system: systemPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
