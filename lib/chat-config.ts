import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "data", "chat-config.json");

interface ChatConfig {
  systemPrompt: string;
}

export async function getSystemPrompt(): Promise<string> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf-8");
    const config: ChatConfig = JSON.parse(raw);
    return config.systemPrompt;
  } catch {
    return "Du bist ein freundlicher Assistent.";
  }
}

export async function saveSystemPrompt(prompt: string): Promise<void> {
  const config: ChatConfig = { systemPrompt: prompt };
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}
