/**
 * Minimal OpenAI-compatible client for Alibaba Cloud DashScope (International).
 * Endpoint verified: https://dashscope-intl.aliyuncs.com/compatible-mode/v1
 *
 * The API key is read from process.env.DASHSCOPE_API_KEY at request time on the
 * server. We never expose it to the browser. Set it in .env.local locally and
 * in Vercel's project Environment Variables when deploying.
 */

export type ChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "user";
      content: Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
    };

export interface ChatOpts {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" } | { type: "text" };
  stream?: false;
}

const BASE_URL =
  process.env.DASHSCOPE_BASE_URL ||
  "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

export const MODELS = {
  reasoning: process.env.MODEL_REASONING || "qwen3.7-max-preview",
  fast: process.env.MODEL_FAST || "qwen-flash",
  vision: process.env.MODEL_VISION || "qwen3-vl-235b-a22b-thinking",
  ocr: process.env.MODEL_OCR || "qwen-vl-ocr",
};

export async function chat(opts: ChatOpts): Promise<{
  content: string;
  raw: any;
}> {
  const key = process.env.DASHSCOPE_API_KEY;
  if (!key) {
    throw new Error(
      "DASHSCOPE_API_KEY missing. Add it to .env.local or your hosting provider's env vars."
    );
  }

  const body = {
    model: opts.model || MODELS.reasoning,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.4,
    top_p: opts.top_p ?? 0.9,
    max_tokens: opts.max_tokens ?? 2048,
    ...(opts.response_format ? { response_format: opts.response_format } : {}),
    stream: false,
  };

  const r = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
    // 60s timeout via AbortSignal
    signal: AbortSignal.timeout(120_000),
  });

  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`DashScope ${r.status}: ${text.slice(0, 500)}`);
  }
  const json = await r.json();
  const content: string = json?.choices?.[0]?.message?.content ?? "";
  return { content, raw: json };
}

/** Parse a JSON object out of a possibly markdown-wrapped string. */
export function safeJSON<T = any>(s: string): T | null {
  if (!s) return null;
  // strip ```json fences
  const cleaned = s
    .replace(/^[\s\S]*?```(?:json)?\s*/i, "")
    .replace(/\s*```[\s\S]*$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // try to find first {...} balanced
    const i = cleaned.indexOf("{");
    const j = cleaned.lastIndexOf("}");
    if (i >= 0 && j > i) {
      try {
        return JSON.parse(cleaned.slice(i, j + 1));
      } catch {}
    }
    return null;
  }
}
