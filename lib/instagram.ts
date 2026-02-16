export interface InstagramReel {
  id: string;
  caption: string;
  permalink: string;
  thumbnailUrl: string;
  timestamp: string;
}

const FALLBACK_REELS: InstagramReel[] = [
  {
    id: "DGENbLNtMKo",
    caption: "Tandemflug über die Lienzer Dolomiten",
    permalink: "https://www.instagram.com/reel/DGENbLNtMKo/",
    thumbnailUrl: "",
    timestamp: "",
  },
  {
    id: "DFv0oIKN-Md",
    caption: "Freiheit über Osttirol",
    permalink: "https://www.instagram.com/reel/DFv0oIKN-Md/",
    thumbnailUrl: "",
    timestamp: "",
  },
  {
    id: "DFYSmvgtJOi",
    caption: "Gleitschirm-Tandemflug",
    permalink: "https://www.instagram.com/reel/DFYSmvgtJOi/",
    thumbnailUrl: "",
    timestamp: "",
  },
  {
    id: "DEzSMxit2Uo",
    caption: "Paragleiten in Osttirol",
    permalink: "https://www.instagram.com/reel/DEzSMxit2Uo/",
    thumbnailUrl: "",
    timestamp: "",
  },
  {
    id: "DEu6M2Wtyoy",
    caption: "Tandemflug Erlebnis",
    permalink: "https://www.instagram.com/reel/DEu6M2Wtyoy/",
    thumbnailUrl: "",
    timestamp: "",
  },
  {
    id: "DEcZ-Fat4Xg",
    caption: "Airpark Lienzer Dolomiten",
    permalink: "https://www.instagram.com/reel/DEcZ-Fat4Xg/",
    thumbnailUrl: "",
    timestamp: "",
  },
];

/**
 * Fetch latest reels from Instagram Graph API.
 * Falls back to static reel list if token is missing or API fails.
 */
export async function getInstagramReels(
  limit = 6
): Promise<InstagramReel[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    return FALLBACK_REELS.slice(0, limit);
  }

  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=50&access_token=${token}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error("Instagram API error:", res.status);
      return FALLBACK_REELS.slice(0, limit);
    }

    const data = await res.json();

    // Filter to video/reels only
    const reels: InstagramReel[] = data.data
      .filter(
        (m: Record<string, string>) =>
          m.media_type === "VIDEO"
      )
      .slice(0, limit)
      .map((m: Record<string, string>) => ({
        id: m.id,
        caption: m.caption || "",
        permalink: m.permalink,
        thumbnailUrl: m.thumbnail_url || "",
        timestamp: m.timestamp,
      }));

    return reels.length > 0 ? reels : FALLBACK_REELS.slice(0, limit);
  } catch (e) {
    console.error("Instagram fetch failed:", e);
    return FALLBACK_REELS.slice(0, limit);
  }
}
