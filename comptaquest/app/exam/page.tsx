"use client";
import { useEffect, useState } from "react";
import { Page } from "@/components/Page";
import { ConfettiBurst } from "@/components/Confetti";
import { useStore } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";

interface Exam {
  title: string;
  story: string;
  operations: { date: string; label: string }[];
  questions: { id: string; points: number; prompt: string }[];
  solution: any;
}

export default function ExamPage() {
  const { addXP } = useStore();
  const [style, setStyle] = useState<"delta" | "turpin" | "mix">("delta");
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [grading, setGrading] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [confetti, setConfetti] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  async function generate() {
    setLoading(true);
    setReport(null);
    setAnswer("");
    setSeconds(0);
    setRunning(false);
    try {
      const r = await fetch("/api/generate-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style, difficulty: "normal" }),
      }).then((x) => x.json());
      if (r.error) throw new Error(r.error);
      setExam(r);
      setRunning(true);
    } catch (e: any) {
      alert("Erreur : " + (e?.message || "inconnue"));
    } finally {
      setLoading(false);
    }
  }

  async function grade() {
    if (!exam) return;
    setGrading(true);
    try {
      const r = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enonce: { story: exam.story, operations: exam.operations, questions: exam.questions },
          solution: exam.solution,
          reponse: answer,
        }),
      }).then((x) => x.json());
      if (r.error) throw new Error(r.error);
      setReport(r);
      setRunning(false);
      addXP(50 + (r.score || 0) * 5);
      sfx.level();
      setConfetti((n) => n + 1);
    } catch (e: any) {
      alert("Erreur : " + (e?.message || "inconnue"));
    } finally {
      setGrading(false);
    }
  }

  return (
    <Page title="Examen Blanc" subtitle="Style L2 — généré par l'IA">
      <ConfettiBurst trigger={confetti} />

      {!exam && (
        <div className="card space-y-3">
          <div className="text-xs uppercase tracking-wider opacity-70">Style de sujet</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "delta", l: "Delta SARL" },
              { v: "turpin", l: "Turpin / Déon" },
              { v: "mix", l: "Mix complet" },
            ].map((o) => (
              <button
                key={o.v}
                className={`py-2 rounded-xl border-2 font-bold ${
                  style === (o.v as any)
                    ? "bg-gold text-ink border-ink"
                    : "bg-white/5 border-white/15"
                }`}
                onClick={() => setStyle(o.v as any)}
              >
                {o.l}
              </button>
            ))}
          </div>
          <button className="btn-primary w-full" onClick={generate} disabled={loading}>
            {loading ? "L'IA prépare le sujet…" : "Générer un examen"}
          </button>
          <p className="text-xs opacity-70">
            Conseil : 45 min chrono, calculatrice + PCG ouverts (tu y as droit). Tu reponds dans le champ
            ci-dessous, en clair (pas de format imposé). L'IA corrige et donne /20.
          </p>
        </div>
      )}

      {exam && (
        <>
          <div className="card flex justify-between items-center">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-70">Chrono</div>
              <div className="title-pixel text-3xl text-gold">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </div>
            </div>
            <button
              className="btn-ghost"
              onClick={() => {
                setExam(null);
                setReport(null);
                setRunning(false);
              }}
            >
              Nouveau sujet
            </button>
          </div>

          <div className="card-paper">
            <div className="text-xs font-bold uppercase">Sujet</div>
            <div className="text-xl font-extrabold mt-1">{exam.title}</div>
            <p className="mt-2 text-sm whitespace-pre-line">{exam.story}</p>
            <div className="mt-3">
              <div className="text-xs font-bold uppercase opacity-70 mb-1">Opérations</div>
              <ol className="list-decimal pl-5 text-sm space-y-1">
                {exam.operations?.map((o, i) => (
                  <li key={i}>
                    <span className="font-mono mr-2">{o.date}</span>
                    {o.label}
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold uppercase opacity-70 mb-1">Travail à faire</div>
              <ol className="list-decimal pl-5 text-sm space-y-1">
                {exam.questions?.map((q) => (
                  <li key={q.id}>
                    <b>({q.points} pts)</b> {q.prompt}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="card">
            <label className="text-xs uppercase tracking-wider opacity-70">
              Tes écritures et calculs (texte libre)
            </label>
            <textarea
              rows={12}
              className="compta mt-2 font-mono"
              placeholder={`Exemple :
1) TVA collectée = 13500*0,2 + 24000*0,055 + 51000*0,2 = 14 220 €
2) Journal :
   D 607 4500 / D 44566 900 / C 401 5400 (Facture n°258)
   ...`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button
              className="btn-rose w-full mt-3"
              onClick={grade}
              disabled={grading || answer.trim().length < 20}
            >
              {grading ? "Correction par l'IA…" : "Soumettre pour correction"}
            </button>
          </div>

          <AnimatePresence>
            {report && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="text-xs uppercase tracking-wider opacity-70">Note IA</div>
                <div className="title-pixel text-5xl text-gold">{report.score}/20</div>
                {report.bravo?.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-bold uppercase text-teal">Bravo</div>
                    <ul className="text-sm list-disc pl-5">
                      {report.bravo.map((b: string, i: number) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                )}
                {report.erreurs?.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-bold uppercase text-rose">À corriger</div>
                    <ul className="text-sm list-disc pl-5">
                      {report.erreurs.map((b: string, i: number) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                )}
                {report.next && (
                  <div className="mt-3 card-paper">
                    <div className="text-xs font-bold uppercase">Prochaine étape (UNE seule)</div>
                    <div className="text-sm font-bold mt-1">{report.next}</div>
                  </div>
                )}

                <details className="mt-4 text-xs">
                  <summary className="cursor-pointer opacity-70">Voir la solution officielle (générée)</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-[11px] bg-white/5 p-3 rounded-xl border border-white/10 overflow-auto">
                    {JSON.stringify(exam.solution, null, 2)}
                  </pre>
                </details>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Page>
  );
}
