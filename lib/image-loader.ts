/**
 * Custom Next.js image loader that uses Netlify Image CDN.
 *
 * In production, images are served via /.netlify/images which handles:
 *   - Format negotiation (WebP / AVIF based on Accept header)
 *   - On-the-fly resizing
 *   - Edge caching
 *
 * This avoids the self-fetch issue where Next.js Image Optimization
 * cannot call /api/images/* on the same Netlify origin.
 */

interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export function getOptimizedUrl(src: string, width: number, quality = 75): string {
  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", String(width));
  params.set("q", String(quality));
  return `/.netlify/images?${params}`;
}

export default function netlifyLoader({ src, width, quality }: LoaderParams): string {
  if (process.env.NODE_ENV === "development") {
    // Dev: pass width as query param so Next.js sees the loader uses it,
    // the image server just ignores the extra param.
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}w=${width}&q=${quality ?? 75}`;
  }
  return getOptimizedUrl(src, width, quality ?? 75);
}
