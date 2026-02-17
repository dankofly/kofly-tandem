import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { SYSTEM_PROMPT } from "./system-prompt";

const CONFIG_PATH = join(process.cwd(), "data", "chat-config.json");

interface ChatConfig {
  systemPrompt: string;
}

export async function getSystemPrompt(): Promise<string> {
  try {
    // Try filesystem read first (works in dev, supports admin edits)
    const raw = await readFile(CONFIG_PATH, "utf-8");
    const config: ChatConfig = JSON.parse(raw);
    return config.systemPrompt;
  } catch {
    // Fallback to build-time constant (works on Netlify serverless)
    return SYSTEM_PROMPT;
  }
}

export async function saveSystemPrompt(prompt: string): Promise<void> {
  const config: ChatConfig = { systemPrompt: prompt };
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}
