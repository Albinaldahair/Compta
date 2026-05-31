"use client";
import { useEffect, useRef, useState } from "react";
import { Page } from "@/components/Page";
import { useStore } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";

const TOPICS = [
  { id: "tva-mech", chapter: "tva",         prompt: "Explique en 60 secondes le mécanisme de la TVA à un enfant de 10 ans, sans le mot 'taxe'." },
  { id: "intracom", chapter: "tva",         prompt: "Pourquoi l'auto-liquidation intracommunautaire est neutre en trésorerie ?" },
  { id: "rrr-esc",  chapter: "achats-ventes", prompt: "Différence entre RRR et escompte, et comment chacun se comptabilise (665, 765, 609, 709)." },
  { id: "lin-deg",  chapter: "amortissements", prompt: "Compare amortissement linéaire et dégressif : date de départ, base, prorata." },
  { id: "facture",  chapter: "achats-ventes", prompt: "Cascade de calcul d'une facture : remise → rabais → escompte → TVA. Pourquoi cet ordre ?" },
];

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function VoicePage() {
  const { addXP } = useStore();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "fr-FR";
    r.onresult = (e: any) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        final += e.results[i][0].transcript + " ";
      }
      setTranscript((t) => t + final);
    };
    r.onerror = () => setRecording(false);
    r.onend = () => setRecording(false);
    recRef.current = r;
  }, []);

  function toggle() {
    if (!recRef.current) {
      alert(
        "La reconnaissance vocale n'est pas dispo dans ce navigateur. Utilise Chrome/Safari, ou tape ta réponse en texte."
      );
      return;
    }
    if (recording) {
      recRef.current.stop();
      setRecording(false);
    } else {
      setTranscript("");
      try {
        recRef.current.start();
        setRecording(true);
        sfx.click();
      } catch {}
    }
  }

  async function critique() {
    if (!transcript.trim()) return;
    setLoading(true);
    setFeedback("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Tu es un coach pédagogique en compta L2 (français). On te donne (1) un sujet et (2) la réponse à voix haute d'un étudiant transcrite. Tu réponds en 4 lignes max : 1) Note /10 sur la clarté+exactitude, 2) Le mot technique mal défini ou manquant, 3) Une analogie pour ne plus l'oublier, 4) Question piège pour la prochaine fois.",
            },
            { role: "user", content: `SUJET: ${topic.prompt}\n\nREPONSE: ${transcript}` },
          ],
        }),
      }).then((x) => x.json());
      setFeedback(r.content || r.error || "Pas de retour.");
      addXP(20);
      sfx.good();
    } catch (e: any) {
      setFeedback("Erreur : " + (e?.message || "inconnue"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Explique à voix haute" subtitle="Production Effect (+15-20%)">
      <div className="card">
        <div className="text-xs uppercase tracking-wider opacity-70 mb-2">Choisis un sujet</div>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTopic(t)}
              className={`px-3 py-1 rounded-full font-semibold border-2 text-xs ${
                topic.id === t.id ? "bg-gold text-ink border-ink" : "bg-white/5 border-white/15"
              }`}
            >
              {t.chapter}
            </button>
          ))}
        </div>
        <div className="card-paper mt-3">
          <div className="text-xs font-bold uppercase">Mission (60 sec, pas de jargon)</div>
          <div className="text-base font-bold mt-1">{topic.prompt}</div>
        </div>
      </div>

      <div className="card">
        <button onClick={toggle} className={recording ? "btn-rose w-full" : "btn-teal w-full"}>
          {recording ? "● Arrêter l'enregistrement" : "🎙️ Commencer à parler"}
        </button>
        <textarea
          rows={6}
          className="compta mt-3 font-mono text-sm"
          placeholder="Ta transcription apparaît ici (tu peux aussi taper directement)…"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <button
          onClick={critique}
          disabled={loading || !transcript.trim()}
          className="btn-primary w-full mt-3"
        >
          {loading ? "L'IA t'écoute…" : "Évaluer ma performance"}
        </button>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card whitespace-pre-line">
            <div className="text-xs font-bold uppercase opacity-70">Retour IA</div>
            <div className="mt-1 text-sm">{feedback}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
