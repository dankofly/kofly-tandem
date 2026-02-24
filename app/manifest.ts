import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KOFLY – Gleitschirm Tandemflug Osttirol",
    short_name: "KOFLY",
    description: "Tandem-Paragliding in Osttirol – Buche jetzt deinen Tandemflug!",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1a22",
    theme_color: "#F56300",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
