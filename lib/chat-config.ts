import { getStore } from "@netlify/blobs";
import { SYSTEM_PROMPT } from "./system-prompt";

const CONFIG_KEY = "system-prompt";

function getChatStore() {
  return getStore({ name: "chat-config", consistency: "strong" });
}

export async function getSystemPrompt(): Promise<string> {
  try {
    const store = getChatStore();
    const raw = await store.get(CONFIG_KEY, { type: "text" });
    if (raw) return raw;
  } catch {
    // Blob store not available (local dev or first deploy)
  }
  return SYSTEM_PROMPT;
}

export async function saveSystemPrompt(prompt: string): Promise<void> {
  const store = getChatStore();
  await store.set(CONFIG_KEY, prompt);
}
