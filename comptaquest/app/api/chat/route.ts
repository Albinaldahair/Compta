import { NextRequest, NextResponse } from "next/server";
import { chat, MODELS } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const model = body.model || MODELS.reasoning;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }
    const r = await chat({
      model,
      messages,
      temperature: body.temperature ?? 0.4,
      max_tokens: body.max_tokens ?? 1500,
      response_format: body.response_format,
    });
    return NextResponse.json({ content: r.content });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "AI error" },
      { status: 500 }
    );
  }
}
