import { NextRequest, NextResponse } from "next/server";
import { chat, MODELS, safeJSON } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `Tu es un correcteur de comptabilité L2 (université française). Tu génères des SUJETS d'examen NUMÉRIQUEMENT cohérents et 100% solubles, dans le style suivant (basé sur les sujets réels de l'enseignant) :
- Style "Delta SARL" : 6 opérations courantes datées (achat, vente, acquisition intracom, retour, export, déclaration TVA mensuelle) + plan d'amortissement linéaire ET dégressif.
- Style "Turpin/Déon" : liquidation TVA mensuelle multi-taux + factures de doit/avoir avec remise/rabais/escompte/retours/acompte.
- Plan comptable français (PCG). Devise : €. Comptes utilisés (44571, 44566, 44562, 44567, 44551, 401, 411, 4091, 4191, 607, 707, 609, 709, 665, 765, 681, 281, 512).
- Toutes les valeurs sont VÉRIFIABLES : tu calcules les sommes correctes en interne avant d'écrire.
Réponds UNIQUEMENT en JSON valide, sans texte avant/après, suivant le schéma demandé.`;

const SCHEMA_HINT = `Schéma JSON attendu :
{
  "title": string,
  "story": string,                  // contexte de l'entreprise
  "operations": [{ "date": "JJ/MM/N", "label": string }],
  "questions": [{ "id": "q1", "points": number, "prompt": string }],
  "solution": {
    "tva_calc": string,             // détail du calcul TVA (libre)
    "journal": [
      { "date": "JJ/MM/N", "lines": [
        { "compte": "607", "libelle": "Achats marchandises", "debit": 4500, "credit": 0 },
        { "compte": "44566", "libelle": "TVA déd. ABS",       "debit": 900,  "credit": 0 },
        { "compte": "401",   "libelle": "Fournisseurs",        "debit": 0,    "credit": 5400 }
      ]}
    ],
    "amort_plans": [
      { "label": "Linéaire 5 ans", "rows": [
        { "annee": "N", "base": 75000, "annuite": 12500, "cumul": 12500, "vnc": 67500 }
      ]}
    ]
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const style: "delta" | "turpin" | "mix" = body.style || "delta";
    const difficulty: "easy" | "normal" | "hard" = body.difficulty || "normal";

    const userPrompt = `Génère un sujet d'examen complet (style="${style}", difficulté="${difficulty}").
Contraintes :
- Au moins 5 opérations datées si style "delta" ou "mix".
- Inclure une opération intracommunautaire dans le sujet.
- Inclure au moins une facture avec remise + escompte si style "turpin" ou "mix".
- Inclure un plan d'amortissement linéaire 5 ans + dégressif (coef France 1,75) sur la même immobilisation si style "delta" ou "mix".
- Total de points = 20.
- Donne aussi la solution détaillée (journal et plans) PARFAITEMENT exacte.

${SCHEMA_HINT}`;

    const r = await chat({
      model: MODELS.reasoning,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 3500,
      response_format: { type: "json_object" },
    });

    const json = safeJSON(r.content);
    if (!json) {
      return NextResponse.json(
        { error: "AI did not return valid JSON", raw: r.content.slice(0, 800) },
        { status: 502 }
      );
    }
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}
