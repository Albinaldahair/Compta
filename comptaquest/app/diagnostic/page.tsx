"use client";
import { useState } from "react";
import { Page } from "@/components/Page";
import { PixelPet } from "@/components/PixelPet";
import { ConfettiBurst } from "@/components/Confetti";
import { DIAGNOSTIC } from "@/lib/knowledge/diagnostic";
import { useStore } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";

export default function Diagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [confetti, setConfetti] = useState(0);
  const { addXP, setMastery, setGaps, setDiagnosticDone, setMood } = useStore();

  const item = DIAGNOSTIC[step];

  async function submit() {
    setLoading(true);
    const expected: Record<string, string> = {};
    DIAGNOSTIC.forEach((d) => (expected[d.chapter] = d.expectedKey));
    try {
      const r = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, expected }),
      }).then((x) => x.json());
      if (r.error) throw new Error(r.error);
      setResult(r);
      // apply
      Object.entries(r.scores || {}).forEach(([c, v]) => setMastery(c as any, v as number));
      Object.entries(r.gaps || {}).forEach(([c, v]) => setGaps(c as any, (v as string[]) || []));
      setDiagnosticDone(true);
      addXP(60);
      sfx.level();
      setMood("fire");
      setConfetti((n) => n + 1);
    } catch (e: any) {
      alert("Erreur IA : " + (e?.message || "inconnue") + "\nVérifie que DASHSCOPE_API_KEY est bien défini.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <Page title="Diagnostic" subtitle="Carte de tes forces & failles">
        <ConfettiBurst trigger={confetti} />
        <div className="card flex items-center gap-3">
          <PixelPet size={96} bubble={result.verdict || "Bien joué !"} />
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wider opacity-70 mb-2">Priorité absolue</div>
          <div className="title-pixel text-3xl text-rose">{labelFor(result.priority)}</div>
        </div>

        <div className="card space-y-3">
          <div className="text-xs uppercase tracking-wider opacity-70">Détail par chapitre</div>
          {DIAGNOSTIC.map((d) => {
            const score = Math.round((result.scores?.[d.chapter] ?? 0) * 100);
            const gaps: string[] = result.gaps?.[d.chapter] || [];
            const tone = score < 30 ? "text-rose" : score < 70 ? "text-gold" : "text-teal";
            return (
              <div key={d.chapter} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
                <div className="flex items-baseline justify-between">
                  <div className="font-bold">{labelFor(d.chapter)}</div>
                  <div className={`title-pixel text-2xl ${tone}`}>{score}%</div>
                </div>
                {gaps.length > 0 && (
                  <ul className="text-sm mt-1 list-disc pl-5 opacity-90">
                    {gaps.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <a href="/flashcards" className="btn-primary w-full">Aller aux cartes Leitner →</a>
      </Page>
    );
  }

  return (
    <Page title="Diagnostic Cinglant" subtitle="5 min — déclenche le mode enregistrement">
      <div className="card-paper">
        <div className="text-xs font-bold uppercase">Question {step + 1} / {DIAGNOSTIC.length}</div>
        <div className="text-xl font-extrabold mt-1">{item.title}</div>
        <p className="mt-2 text-sm">{item.testQuestion}</p>
        <div className="mt-2 text-xs opacity-70">
          Sous-compétences testées : {item.subskills.join(" · ")}
        </div>
      </div>

      <div className="card">
        <label className="text-xs uppercase tracking-wider opacity-70">
          Écris ta réponse de mémoire (pas de cours ouvert)
        </label>
        <textarea
          rows={7}
          className="compta mt-2"
          placeholder="Tape tout ce que tu sais. Si tu sèches, dis-le franchement — c'est précieux pour l'IA."
          value={answers[item.chapter] || ""}
          onChange={(e) => setAnswers((a) => ({ ...a, [item.chapter]: e.target.value }))}
        />
      </div>

      <div className="flex gap-2">
        {step > 0 && (
          <button className="btn-ghost flex-1" onClick={() => setStep(step - 1)}>← Retour</button>
        )}
        {step < DIAGNOSTIC.length - 1 ? (
          <button
            className="btn-primary flex-1"
            onClick={() => {
              sfx.click();
              setStep(step + 1);
            }}
          >
            Suivant →
          </button>
        ) : (
          <button
            className="btn-rose flex-1"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "L'IA évalue…" : "Évaluer maintenant"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-sm">
            🧠 Comptito (Qwen 3.7) compare tes réponses aux clés. Quelques secondes…
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}

function labelFor(c: string) {
  return (
    {
      tva: "TVA",
      "achats-ventes": "Achats / Ventes",
      amortissements: "Amortissements",
      organisation: "Organisation comptable",
    }[c] || c
  );
}
