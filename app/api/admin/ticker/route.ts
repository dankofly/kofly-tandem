import { NextResponse } from "next/server";
import { getTickerItems, saveTickerItems } from "@/lib/ticker-config";
import { adminGuard } from "@/lib/admin-auth";



export async function GET(req: Request) {
  const abgelehnt = adminGuard(req);
  if (abgelehnt) return abgelehnt;

  const items = await getTickerItems();
  return NextResponse.json({ items });
}

export async function PUT(req: Request) {
  const abgelehnt = adminGuard(req);
  if (abgelehnt) return abgelehnt;

  const { items } = await req.json();

  if (!Array.isArray(items) || items.some((i: unknown) => typeof i !== "string")) {
    return NextResponse.json({ error: "Items must be an array of strings" }, { status: 400 });
  }

  await saveTickerItems(items);
  return NextResponse.json({ success: true });
}
