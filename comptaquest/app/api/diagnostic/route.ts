import { NextRequest, NextResponse } from "next/server";
import { chat, MODELS, safeJSON } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `Tu es un coach pédagogique en comptabilité L2.
Tu reçois 4 réponses libres d'un étudiant aux 4 chapitres :
TVA, Achats/Ventes, Amortissements, Organisation comptable.
Tu compares chaque réponse à la clé attendue, puis tu retournes en JSON :
{
  "scores": { "tva": 0..1, "achats-ventes": 0..1, "amortissements": 0..1, "organisation": 0..1 },
  "gaps":   { "tva": string[], "achats-ventes": string[], "amortissements": string[], "organisation": string[] },
  "priority": "tva"|"achats-ventes"|"amortissements"|"organisation",
  "verdict": string  // une phrase punchy au tutoiement, gentille mais lucide
}
Sois sévère sur les confusions de comptes (665 vs 765, 44567 vs 44551, etc.). Pas de Markdown.`;

export async function POST(req: NextRequest) {
  try {
    const { answers, expected } = await req.json();
    if (!answers) {
      return NextResponse.json({ error: "answers required" }, { status: 400 });
    }
    const r = await chat({
      model: MODELS.reasoning,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `# CLES ATTENDUES\n${JSON.stringify(expected)}\n\n# REPONSES ETUDIANT\n${JSON.stringify(
            answers
          )}\n\nÉvalue.`,
        },
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });
    const json = safeJSON(r.content);
    if (!json) {
      return NextResponse.json(
        {
          scores: { tva: 0.3, "achats-ventes": 0.3, amortissements: 0.3, organisation: 0.3 },
          gaps: {
            tva: ["mécanisme général"],
            "achats-ventes": ["cascade RRR + escompte"],
            amortissements: ["distinction linéaire / dégressif"],
            organisation: ["chaîne pièce→bilan"],
          },
          priority: "tva",
          verdict: "L'IA n'a pas pu te lire correctement. On part en mode renforcé sur la TVA.",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}
