import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "data", "ticker-config.json");

interface TickerConfig {
  items: string[];
}

export async function getTickerItems(): Promise<string[]> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf-8");
    const config: TickerConfig = JSON.parse(raw);
    return config.items;
  } catch {
    return ["Tandemflug ab 150\u00A0\u20AC", "Airpark Lienzer Dolomiten"];
  }
}

export async function saveTickerItems(items: string[]): Promise<void> {
  const config: TickerConfig = { items };
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}
