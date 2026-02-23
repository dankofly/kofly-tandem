import { NextResponse } from "next/server";
import { getVideosConfig, saveVideosConfig } from "@/lib/videos-config";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get("authorization");
  if (!auth || !ADMIN_PASSWORD) return false;
  return auth === `Bearer ${ADMIN_PASSWORD}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slots = await getVideosConfig();
  return NextResponse.json({ slots });
}

export async function PUT(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slots } = await req.json();

  if (!slots || typeof slots !== "object") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await saveVideosConfig(slots);
  return NextResponse.json({ success: true });
}
