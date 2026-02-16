import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getSystemPrompt } from "@/lib/chat-config";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const systemPrompt = await getSystemPrompt();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
