import { NextRequest, NextResponse } from "next/server";
import { chat, MODELS, safeJSON } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `Tu es un correcteur de comptabilité L2 français RIGOUREUX MAIS BIENVEILLANT.
Tu reçois (1) l'énoncé d'un exercice, (2) la solution officielle, (3) la réponse de l'étudiant (texte libre OU JSON d'écritures).
Tu compares les MONTANTS (tolérance d'arrondi : ±0,02 €) et les COMPTES (les variantes 607/600 = OK, 707/700 = OK, mais pas 607 vs 707).
Tu rédiges un retour sec, en 2 parties :
1) "Score" /20 (entier).
2) "Erreurs" : liste des points faux avec correction express ET principe sous-jacent (1 ligne max chacun).
3) "Bravo" : ce qui est juste.
4) "Prochaine étape" : la SEULE chose à reviser maintenant pour gagner +5 points la prochaine fois.
Tu réponds en JSON {score:number, erreurs:string[], bravo:string[], next:string}. PAS de Markdown.`;

export async function POST(req: NextRequest) {
  try {
    const { enonce, solution, reponse } = await req.json();
    if (!enonce || !reponse) {
      return NextResponse.json({ error: "enonce + reponse required" }, { status: 400 });
    }
    const r = await chat({
      model: MODELS.reasoning,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `# ENONCE\n${typeof enonce === "string" ? enonce : JSON.stringify(enonce)}\n\n# SOLUTION OFFICIELLE\n${
            solution ? (typeof solution === "string" ? solution : JSON.stringify(solution)) : "(non fournie)"
          }\n\n# REPONSE ETUDIANT\n${typeof reponse === "string" ? reponse : JSON.stringify(reponse)}\n\nÉvalue.`,
        },
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });
    const json = safeJSON(r.content);
    if (!json) {
      return NextResponse.json({ score: 0, erreurs: ["AI invalide"], bravo: [], next: "Recommence." }, { status: 200 });
    }
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}
