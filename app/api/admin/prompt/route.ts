import { NextResponse } from "next/server";
import { getSystemPrompt, saveSystemPrompt } from "@/lib/chat-config";

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

  const prompt = await getSystemPrompt();
  return NextResponse.json({ prompt });
}

export async function PUT(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  await saveSystemPrompt(prompt);
  return NextResponse.json({ success: true });
}
