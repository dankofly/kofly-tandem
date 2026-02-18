import { getStore } from "@netlify/blobs";

const CONFIG_KEY = "images-config";
const IMAGE_KEY_PREFIX = "image-";

export interface ImageSlot {
  label: string;
  filename: string | null;
  description: string;
  blobbed?: boolean; // true if image is stored in Blobs
}

interface ImagesConfig {
  slots: Record<string, ImageSlot>;
}

// Default slots definition (used as fallback if no blob config exists)
const DEFAULT_SLOTS: Record<string, ImageSlot> = {
  hero: {
    label: "Hero Hintergrund (Desktop)",
    filename: "hero-1771273007982.webp",
    description: "Hauptbild oben auf der Startseite – Desktop/Tablet (empfohlen: 1920x1080, Querformat 16:9)",
  },
  "hero-mobile": {
    label: "Hero Hintergrund (Mobile)",
    filename: null,
    description: "Hauptbild oben auf der Startseite – Handy (empfohlen: 1080x1920, Hochformat 9:16)",
  },
  about: {
    label: "Über uns / Warum wir",
    filename: null,
    description: "Bild in der Warum-wir-Sektion (empfohlen: 800x600)",
  },
  "ablauf-hero": {
    label: "Ablauf Hero",
    filename: null,
    description: "Bild oben auf der Ablauf-Seite (empfohlen: 1920x800)",
  },
  "ablauf-flug": {
    label: "Ablauf: Der Flug",
    filename: null,
    description: "Bild bei Schritt 08 – Der Flug (empfohlen: 800x600)",
  },
  "ablauf-landing": {
    label: "Ablauf: Landung",
    filename: null,
    description: "Bild bei Schritt 09 – Landung (empfohlen: 800x600)",
  },
  packages: {
    label: "Flugpakete",
    filename: null,
    description: "Bild in der Pakete-Sektion (empfohlen: 800x600)",
  },
  "whyus-bg": {
    label: "Wir garantieren: Hintergrund",
    filename: "whyus-bg-1771151717063.jpg",
    description: "Parallax-Hintergrundbild für die Sektion 'Ein Flugerlebnis' (empfohlen: 1920x1080)",
  },
  "tile-einfach": {
    label: "Kachel: Einfach",
    filename: "tile-einfach-1771271518971.jpg",
    description: "Bildkachel für EINFACH (empfohlen: 600x800, Hochformat 3:4)",
  },
  "tile-sicher": {
    label: "Kachel: Sicher",
    filename: "tile-sicher-1771271876468.jpg",
    description: "Bildkachel für SICHER (empfohlen: 600x800, Hochformat 3:4)",
  },
  "tile-unvergesslich": {
    label: "Kachel: Unvergesslich",
    filename: "tile-unvergesslich-1771152470076.jpg",
    description: "Bildkachel für UNVERGESSLICH (empfohlen: 600x800, Hochformat 3:4)",
  },
};

function getImagesStore() {
  return getStore({ name: "images", consistency: "strong" });
}

export async function getImagesConfig(): Promise<Record<string, ImageSlot>> {
  try {
    const store = getImagesStore();
    const raw = await store.get(CONFIG_KEY, { type: "text" });
    if (raw) {
      const config: ImagesConfig = JSON.parse(raw);
      return config.slots;
    }
  } catch {
    // Blob store not available (local dev or first deploy)
  }
  return { ...DEFAULT_SLOTS };
}

export async function getImageUrl(slot: string): Promise<string | null> {
  const slots = await getImagesConfig();
  const s = slots[slot];
  if (!s?.filename) return null;

  // If image was uploaded to Blobs, serve via API route with cache-busting
  if (s.blobbed) {
    const ts = s.filename?.match(/-(\d+)\./)?.[1] || "";
    return `/api/images/${slot}?v=${ts}`;
  }

  // Otherwise use build-time static image
  return `/images/${s.filename}`;
}

export async function updateSlotFilename(
  slot: string,
  filename: string | null,
  blobbed = false
): Promise<void> {
  const slots = await getImagesConfig();
  if (slots[slot]) {
    slots[slot].filename = filename;
    slots[slot].blobbed = blobbed;
    const store = getImagesStore();
    await store.set(CONFIG_KEY, JSON.stringify({ slots }));
  }
}

export async function saveImageBlob(
  slot: string,
  data: ArrayBuffer,
  contentType: string
): Promise<void> {
  const store = getImagesStore();
  await store.set(`${IMAGE_KEY_PREFIX}${slot}`, new Blob([data], { type: contentType }), {
    metadata: { contentType },
  });
}

export async function getImageBlob(
  slot: string
): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  try {
    const store = getImagesStore();
    const result = await store.getWithMetadata(`${IMAGE_KEY_PREFIX}${slot}`, {
      type: "arrayBuffer",
    });
    if (!result) return null;
    return {
      data: result.data,
      contentType: (result.metadata as { contentType?: string })?.contentType || "image/jpeg",
    };
  } catch {
    return null;
  }
}

export async function deleteImageBlob(slot: string): Promise<void> {
  try {
    const store = getImagesStore();
    await store.delete(`${IMAGE_KEY_PREFIX}${slot}`);
  } catch {
    // Blob may not exist
  }
}
