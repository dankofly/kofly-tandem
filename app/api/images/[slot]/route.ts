import { getImageBlob } from "@/lib/images-config";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slot: string }> }
) {
  const { slot } = await params;
  const blob = await getImageBlob(slot);

  if (!blob) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(blob.data, {
    headers: {
      "Content-Type": blob.contentType,
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
