import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function ParallaxBg({ src, alt }: Props) {
  return (
    <div className="fixed inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-cover"
        loading="lazy"
        sizes="100vw"
      />
    </div>
  );
}
