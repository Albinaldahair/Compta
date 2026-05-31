import { NextRequest, NextResponse } from "next/server";
import { chat, MODELS } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST { imageDataUrl: "data:image/png;base64,..." , task: "ocr"|"explain"|"grade", context?: string }
 * Uses qwen-vl-ocr for OCR, qwen3-vl for reasoning over the image.
 */
export async function POST(req: NextRequest) {
  try {
    const { imageDataUrl, task, context } = await req.json();
    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json({ error: "imageDataUrl required" }, { status: 400 });
    }

    const isOCR = task === "ocr";
    const model = isOCR ? MODELS.ocr : MODELS.vision;

    const sys =
      task === "explain"
        ? "Tu expliques en français, simple et imagé, ce qui est demandé sur la photo d'un sujet d'examen de comptabilité. Donne ensuite UNE stratégie en 5 étapes pour le résoudre. Pas de Markdown, juste du texte clair."
        : task === "grade"
          ? "Tu lis la photo d'un brouillon d'étudiant en compta L2. Tu corriges chaque écriture (montants, comptes, sens débit/crédit), puis donnes une note /20 et 3 priorités."
          : "Tu fais l'OCR le plus fidèle possible de cette feuille en français, en conservant la structure (listes, tableaux) en texte brut.";

    const userText =
      task === "explain"
        ? `Voici une photo de l'énoncé. ${context ? "Contexte : " + context : ""}`
        : task === "grade"
          ? `Voici la copie de l'étudiant. ${context ? "Sujet : " + context : ""}`
          : "OCR fidèle s'il te plaît.";

    const r = await chat({
      model,
      messages: [
        { role: "system", content: sys },
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    return NextResponse.json({ content: r.content });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}
