import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { getImagesConfig, updateSlotFilename } from "@/lib/images-config";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const IMAGES_DIR = join(process.cwd(), "public", "images");
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
  return NextResponse.json({ slots });
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

  // Build filename: slot-timestamp.ext
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${slot}-${Date.now()}.${ext}`;
  const filepath = join(IMAGES_DIR, filename);

  // Delete old image if exists
  const slots = await getImagesConfig();
  const oldFilename = slots[slot]?.filename;
  if (oldFilename) {
    try {
      await unlink(join(IMAGES_DIR, oldFilename));
    } catch {
      // Old file may not exist
    }
  }

  // Save new image
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  // Update config
  await updateSlotFilename(slot, filename);

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

  const slots = await getImagesConfig();
  const filename = slots[slot]?.filename;

  if (filename) {
    try {
      await unlink(join(IMAGES_DIR, filename));
    } catch {
      // File may not exist
    }
    await updateSlotFilename(slot, null);
  }

  return NextResponse.json({ success: true });
}
