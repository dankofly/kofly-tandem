import { NextResponse } from "next/server";
import {
  getImagesConfig,
  updateSlotFilename,
  saveImageBlob,
  deleteImageBlob,
} from "@/lib/images-config";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get("authorization");
  if (!auth || !ADMIN_PASSWORD) return false;
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

// GET: List all slots with their current images
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slots = await getImagesConfig();
  return NextResponse.json(
    { slots },
    { headers: { "Cache-Control": "no-store" } }
  );
}

// POST: Upload image and assign to slot
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const slot = formData.get("slot") as string | null;

  if (!file || !slot) {
    return NextResponse.json(
      { error: "File and slot are required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Nur JPG, PNG, WebP oder AVIF erlaubt." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Maximale Dateigröße: 5 MB" },
      { status: 400 }
    );
  }

  // Build filename for reference (timestamp used for cache-busting)
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${slot}-${Date.now()}.${ext}`;

  // Delete old blob if exists
  await deleteImageBlob(slot);

  // Convert File to ArrayBuffer for reliable blob storage
  const arrayBuffer = await file.arrayBuffer();
  await saveImageBlob(slot, arrayBuffer, file.type);

  // Update config in Blobs (blobbed = true)
  await updateSlotFilename(slot, filename, true);

  return NextResponse.json({ success: true, filename });
}

// DELETE: Remove image from slot
export async function DELETE(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slot } = await req.json();

  if (!slot) {
    return NextResponse.json({ error: "Slot is required" }, { status: 400 });
  }

  // Delete blob image
  await deleteImageBlob(slot);

  // Reset config (blobbed = false, filename = null)
  await updateSlotFilename(slot, null, false);

  return NextResponse.json({ success: true });
}
