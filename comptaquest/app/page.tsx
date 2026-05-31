"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HUD } from "@/components/HUD";
import { BottomNav } from "@/components/BottomNav";
import { PixelPet } from "@/components/PixelPet";
import { useStore } from "@/lib/store";
import { sfx } from "@/lib/sound";

const PETS_LINES_BY_HOUR = [
  // 0-5 night
  "🌙 Tu m'as réveillé... Mais bon, allez : 5 min de revisions ?",
  "🌙 Tu m'as réveillé... Mais bon, allez : 5 min de revisions ?",
  "🌙 Tu m'as réveillé... Mais bon, allez : 5 min de revisions ?",
  "🌙 Tu m'as réveillé... Mais bon, allez : 5 min de revisions ?",
  "🌙 Tu m'as réveillé... Mais bon, allez : 5 min de revisions ?",
  "🌙 Tu m'as réveillé... Mais bon, allez : 5 min de revisions ?",
  // 6-11 morning
  "☀️ Café + flashcards = combo gagnant. On commence ?",
  "☀️ Café + flashcards = combo gagnant. On commence ?",
  "☀️ Sois discipliné·e 12 min, je m'occupe du fun.",
  "☀️ Sois discipliné·e 12 min, je m'occupe du fun.",
  "☀️ Sois discipliné·e 12 min, je m'occupe du fun.",
  "☀️ Sois discipliné·e 12 min, je m'occupe du fun.",
  // 12-17 afternoon
  "🍱 1 examen blanc cet après-midi = +200 XP !",
  "🍱 1 examen blanc cet après-midi = +200 XP !",
  "🍱 1 examen blanc cet après-midi = +200 XP !",
  "🍱 1 examen blanc cet après-midi = +200 XP !",
  "🍱 1 examen blanc cet après-midi = +200 XP !",
  "🍱 1 examen blanc cet après-midi = +200 XP !",
  // 18-23 evening
  "🌃 Le rituel du soir te ferait gagner 30% de retention. On y va ?",
  "🌃 Le rituel du soir te ferait gagner 30% de retention. On y va ?",
  "🌃 Le rituel du soir te ferait gagner 30% de retention. On y va ?",
  "🌃 Le rituel du soir te ferait gagner 30% de retention. On y va ?",
  "🌃 Le rituel du soir te ferait gagner 30% de retention. On y va ?",
  "🌃 Le rituel du soir te ferait gagner 30% de retention. On y va ?",
];

export default function Hub() {
  const { hydrateDefaults, mastery, diagnosticDone, setMood, flashcards } = useStore();

  useEffect(() => {
    hydrateDefaults();
  }, [hydrateDefaults]);

  // Choose mood based on activity
  useEffect(() => {
    const dueCount = flashcards.filter((c) => new Date(c.due) <= new Date()).length;
    if (!diagnosticDone) setMood("neutral");
    else if (dueCount > 10) setMood("ko");
    else if (dueCount > 5) setMood("sleepy");
    else if (dueCount > 0) setMood("happy");
    else setMood("fire");
  }, [diagnosticDone, flashcards, setMood]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return PETS_LINES_BY_HOUR[h] || "Allez, on s'y met ?";
  }, []);

  const overall = useMemo(() => {
    const vals = Object.values(mastery);
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
  }, [mastery]);

  const dueCount = flashcards.filter((c) => new Date(c.due) <= new Date()).length;

  return (
    <>
      <HUD />

      <section className="mt-4 grid grid-cols-1 gap-4">
        <div className="card flex items-center gap-4">
          <PixelPet size={120} bubble={greeting} />
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider opacity-70">Maîtrise globale</div>
            <div className="title-pixel text-3xl text-gold">{overall}%</div>
            <div className="mt-2 text-xs opacity-80">Cartes dues : {dueCount}</div>
          </div>
        </div>

        {!diagnosticDone && (
          <Link href="/diagnostic" onClick={() => sfx.click()}>
            <motion.div whileTap={{ scale: 0.98 }} className="card-paper">
              <div className="text-xs font-bold uppercase">Étape 1 — 5 min</div>
              <div className="text-xl font-extrabold mt-1">Diagnostic Cinglant</div>
              <p className="text-sm opacity-80 mt-1">
                On teste ton ignorance AVANT de relire. Le piège #1, c'est l'illusion de compétence.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-bold">
                Commencer →
              </div>
            </motion.div>
          </Link>
        )}

        <div className="grid grid-cols-2 gap-3">
          <QuestCard
            href="/flashcards"
            emoji="🧠"
            title="Cartes Leitner"
            sub="Répétition espacée"
            badge={dueCount ? `${dueCount} dues` : "Aucune"}
            color="from-violet to-rose"
          />
          <QuestCard
            href="/exam"
            emoji="📝"
            title="Examen Blanc"
            sub="Style Delta SARL"
            badge="IA"
            color="from-rose to-gold"
          />
          <QuestCard
            href="/voice"
            emoji="🎙️"
            title="Explique à voix haute"
            sub="Production Effect"
            badge="+15%"
            color="from-teal to-violet"
          />
          <QuestCard
            href="/night"
            emoji="🌙"
            title="Rituel du soir"
            sub="Consolidation sommeil"
            badge="-1h écran"
            color="from-violet to-ink"
          />
          <QuestCard
            href="/pcg"
            emoji="📒"
            title="Plan comptable"
            sub="Cheat sheet exam"
            badge="Autorisé"
            color="from-gold to-rose"
          />
          <QuestCard
            href="/diagnostic"
            emoji="🎯"
            title="Re-diagnostic"
            sub="Mesure tes progrès"
            badge="2 min"
            color="from-teal to-gold"
          />
        </div>

        <div className="card">
          <div className="text-xs uppercase tracking-wider opacity-70 mb-2">Maîtrise par chapitre</div>
          <ChapterBar label="TVA" v={mastery.tva} />
          <ChapterBar label="Achats / Ventes" v={mastery["achats-ventes"]} />
          <ChapterBar label="Amortissements" v={mastery.amortissements} />
          <ChapterBar label="Organisation comptable" v={mastery.organisation} />
        </div>

        <div className="card text-sm leading-relaxed">
          <div className="title-pixel text-gold text-lg mb-1">Ton plan d'attaque pour demain</div>
          <ol className="list-decimal pl-5 space-y-1">
            <li><b>Maintenant</b> : Diagnostic Cinglant (5 min) → on cible les zones rouges.</li>
            <li>40 min de Cartes Leitner sur ton chapitre rouge, puis 10 min de pause (sans écran).</li>
            <li>1 Examen Blanc complet (45 min) → corrigé par l'IA → tu connais ta note avant l'épreuve.</li>
            <li>Avant de dormir : Rituel du Soir (récup libre + question pour le sommeil).</li>
            <li>Au réveil : 1 ré-écoute des 5 cartes ratées + revue rapide du PCG.</li>
          </ol>
        </div>
      </section>

      <BottomNav />
    </>
  );
}

function QuestCard({
  href, emoji, title, sub, badge, color,
}: {
  href: string; emoji: string; title: string; sub: string; badge: string; color: string;
}) {
  return (
    <Link href={href} onClick={() => sfx.click()}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -2 }}
        className="card relative overflow-hidden h-full"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30`} />
        <div className="relative">
          <div className="text-3xl">{emoji}</div>
          <div className="font-extrabold mt-2">{title}</div>
          <div className="text-xs opacity-80">{sub}</div>
          <div className="mt-2 inline-block text-[10px] font-bold bg-ink/60 border border-white/10 px-2 py-0.5 rounded">
            {badge}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function ChapterBar({ label, v }: { label: string; v: number }) {
  const pct = Math.round(v * 100);
  const tone = pct < 30 ? "from-rose to-rose" : pct < 70 ? "from-gold to-rose" : "from-teal to-gold";
  return (
    <div className="my-1">
      <div className="flex justify-between text-xs">
        <span className="opacity-80">{label}</span>
        <span className="font-bold">{pct}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${tone}`}
          initial={false}
          animate={{ width: pct + "%" }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
      </div>
    </div>
  );
}
