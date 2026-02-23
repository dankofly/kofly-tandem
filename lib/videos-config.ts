import { getStore } from "@netlify/blobs";

const CONFIG_KEY = "videos-config";

export interface VideoSlot {
  label: string;
  url: string | null; // YouTube Shorts URL
  description: string;
}

interface VideosConfig {
  slots: Record<string, VideoSlot>;
}

const DEFAULT_SLOTS: Record<string, VideoSlot> = {
  "ueber-video-1": {
    label: "Video 1",
    url: null,
    description: "YouTube Shorts URL (z.B. https://youtube.com/shorts/ABC123)",
  },
  "ueber-video-2": {
    label: "Video 2",
    url: null,
    description: "YouTube Shorts URL (z.B. https://youtube.com/shorts/ABC123)",
  },
  "ueber-video-3": {
    label: "Video 3",
    url: null,
    description: "YouTube Shorts URL (z.B. https://youtube.com/shorts/ABC123)",
  },
  "ueber-video-4": {
    label: "Video 4",
    url: null,
    description: "YouTube Shorts URL (z.B. https://youtube.com/shorts/ABC123)",
  },
};

function getVideosStore() {
  return getStore({ name: "videos", consistency: "strong" });
}

export async function getVideosConfig(): Promise<Record<string, VideoSlot>> {
  try {
    const store = getVideosStore();
    const raw = await store.get(CONFIG_KEY, { type: "text" });
    if (raw) {
      const config: VideosConfig = JSON.parse(raw);
      return { ...DEFAULT_SLOTS, ...config.slots };
    }
  } catch {
    // Blob store not available (local dev or first deploy)
  }
  return { ...DEFAULT_SLOTS };
}

export async function saveVideosConfig(
  slots: Record<string, VideoSlot>
): Promise<void> {
  const store = getVideosStore();
  await store.set(CONFIG_KEY, JSON.stringify({ slots }));
}

/**
 * Extract the YouTube video ID from various URL formats:
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
