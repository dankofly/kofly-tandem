import Image from "next/image";
import { getImageUrl } from "@/lib/images-config";

const GALLERY_SLOTS = Array.from({ length: 10 }, (_, i) => `gallery-${i + 1}`);

export default async function Gallery() {
  const urls = await Promise.all(GALLERY_SLOTS.map((s) => getImageUrl(s)));
  const images = urls
    .map((url, i) => (url ? { url, slot: GALLERY_SLOTS[i] } : null))
    .filter(Boolean) as { url: string; slot: string }[];

  if (images.length === 0) return null;

  return (
    <section className="bg-surface-elevated/20">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[1px]">
        {images.map(({ url, slot }) => (
          <div key={slot} className="relative aspect-square overflow-hidden img-skeleton">
            <Image
              src={url}
              alt=""
              fill
              sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
