import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "data", "images-config.json");

export interface ImageSlot {
  label: string;
  filename: string | null;
  description: string;
}

interface ImagesConfig {
  slots: Record<string, ImageSlot>;
}

export async function getImagesConfig(): Promise<Record<string, ImageSlot>> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf-8");
    const config: ImagesConfig = JSON.parse(raw);
    return config.slots;
  } catch {
    return {};
  }
}

export async function getImageUrl(slot: string): Promise<string | null> {
  const slots = await getImagesConfig();
  const s = slots[slot];
  if (!s?.filename) return null;
  return `/images/${s.filename}`;
}

export async function updateSlotFilename(
  slot: string,
  filename: string | null
): Promise<void> {
  const raw = await readFile(CONFIG_PATH, "utf-8");
  const config: ImagesConfig = JSON.parse(raw);
  if (config.slots[slot]) {
    config.slots[slot].filename = filename;
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  }
}
