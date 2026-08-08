import { NextResponse } from "next/server";
import { getVideosConfig, saveVideosConfig } from "@/lib/videos-config";
import { adminGuard } from "@/lib/admin-auth";



export async function GET(req: Request) {
  const abgelehnt = adminGuard(req);
  if (abgelehnt) return abgelehnt;

  const slots = await getVideosConfig();
  return NextResponse.json({ slots });
}

export async function PUT(req: Request) {
  const abgelehnt = adminGuard(req);
  if (abgelehnt) return abgelehnt;

  const { slots } = await req.json();

  if (!slots || typeof slots !== "object") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await saveVideosConfig(slots);
  return NextResponse.json({ success: true });
}
