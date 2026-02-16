import { getInstagramReels } from "@/lib/instagram";
import InstagramCarousel from "./InstagramCarousel";

export default async function InstagramReels() {
  const reels = await getInstagramReels(6);

  return <InstagramCarousel reels={reels} />;
}
