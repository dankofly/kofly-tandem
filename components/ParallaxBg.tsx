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
        className="object-cover"
        loading="lazy"
        sizes="100vw"
        quality={80}
      />
    </div>
  );
}
