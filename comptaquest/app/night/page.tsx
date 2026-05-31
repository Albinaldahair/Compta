"use client";
import { useEffect, useState } from "react";
import { Page } from "@/components/Page";
import { PixelPet } from "@/components/PixelPet";
import { useStore } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { motion } from "framer-motion";

export default function NightPage() {
  const { addXP, setMood } = useStore();
  const [step, setStep] = useState(0);
  const [recall, setRecall] = useState("");
  const [question, setQuestion] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setMood("sleepy");
  }, [setMood]);

  function next() {
    sfx.pop();
    setStep((s) => s + 1);
  }

  function save() {
    const data = { recall, question, ts: new Date().toISOString() };
    try {
      const list = JSON.parse(localStorage.getItem("comptaquest-night-log") || "[]");
      list.push(data);
      localStorage.setItem("comptaquest-night-log", JSON.stringify(list));
      setSavedAt(data.ts);
      addXP(40);
      sfx.level();
    } catch {}
    next();
  }

  return (
    <Page title="Rituel du soir" subtitle="Consolidation nocturne">
      <div className="card flex items-center gap-3">
        <PixelPet size={96} bubble="Aucun écran après ça. Promis ?" />
      </div>

      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-3">
          <div className="title-pixel text-2xl text-gold">1. Récup libre</div>
          <p className="text-sm opacity-90">
            Sans rouvrir le cours, écris pendant 10 minutes <b>tout</b> ce dont tu te souviens de ta journée
            (concepts, formules, comptes, écritures-types). Erreurs autorisées : on les corrigera demain.
          </p>
          <textarea
            rows={10}
            className="compta font-mono"
            placeholder="TVA collectée 44571…  RRR sur facture d'avoir = 609 / 709…  Linéaire prorata jours, dégressif prorata mois…"
            value={recall}
            onChange={(e) => setRecall(e.target.value)}
          />
          <button className="btn-primary w-full" onClick={next}>
            J'ai fini, étape suivante →
          </button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-3">
          <div className="title-pixel text-2xl text-gold">2. Question pour la nuit</div>
          <p className="text-sm opacity-90">
            Formule UNE seule question précise — ton point de blocage. Ton hippocampe va y travailler en boucle.
          </p>
          <input
            className="compta"
            placeholder="Ex : pourquoi l'escompte se calcule sur le dernier net commercial et pas sur le brut ?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="btn-primary w-full" onClick={save} disabled={!question.trim()}>
            Sauvegarder + dormir
          </button>
        </motion.div>
      )}

      {step >= 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-2">
          <div className="title-pixel text-2xl text-teal">3. Au réveil</div>
          <p className="text-sm">
            Ouvre l'app AVANT ton téléphone. Regarde ta question, écris la première chose qui te vient. C'est
            souvent juste.
          </p>
          {savedAt && <div className="text-xs opacity-60">Sauvegardé à {new Date(savedAt).toLocaleTimeString()}.</div>}
          <a href="/" className="btn-ghost w-full text-center mt-2">Retour au hub</a>
        </motion.div>
      )}

      <div className="card text-xs opacity-80 leading-relaxed">
        <b>Pourquoi ça marche</b> : pendant le sommeil, ton hippocampe transfère les souvenirs vers le
        néocortex. Une question précise <i>amorce</i> ce travail. Étude Wagner et al., Nature 2004 :
        +33% de résolution de problèmes après 8h de sommeil vs veille équivalente.
      </div>
    </Page>
  );
}
