import { NextResponse } from "next/server";
import { getSystemPrompt, saveSystemPrompt } from "@/lib/chat-config";
import { adminGuard } from "@/lib/admin-auth";



export async function GET(req: Request) {
  const abgelehnt = adminGuard(req);
  if (abgelehnt) return abgelehnt;

  const prompt = await getSystemPrompt();
  return NextResponse.json({ prompt });
}

export async function PUT(req: Request) {
  const abgelehnt = adminGuard(req);
  if (abgelehnt) return abgelehnt;

  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  await saveSystemPrompt(prompt);
  return NextResponse.json({ success: true });
}
