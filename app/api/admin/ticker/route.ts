import { NextResponse } from "next/server";
import { getTickerItems, saveTickerItems } from "@/lib/ticker-config";

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

  const items = await getTickerItems();
  return NextResponse.json({ items });
}

export async function PUT(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();

  if (!Array.isArray(items) || items.some((i: unknown) => typeof i !== "string")) {
    return NextResponse.json({ error: "Items must be an array of strings" }, { status: 400 });
  }

  await saveTickerItems(items);
  return NextResponse.json({ success: true });
}
