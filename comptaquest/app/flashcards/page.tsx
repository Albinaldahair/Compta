"use client";
import { useEffect, useMemo, useState } from "react";
import { Page } from "@/components/Page";
import { ConfettiBurst } from "@/components/Confetti";
import { useStore, type FlashCard, type ChapterId } from "@/lib/store";
import { SEED_CARDS } from "@/lib/knowledge/flashcards";
import { sfx } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";

const CHAPTER_LABEL: Record<ChapterId, string> = {
  tva: "TVA",
  "achats-ventes": "Achats / Ventes",
  amortissements: "Amortissements",
  organisation: "Organisation",
};

/** Interleaving: take from the chapter with the lowest mastery first, then mix. */
function pickQueue(cards: FlashCard[], gapsByChapter: Record<ChapterId, string[]>) {
  const due = cards.filter((c) => new Date(c.due) <= new Date());
  if (due.length === 0) return [];
  // weight chapters by gap presence
  const weight = (c: FlashCard) => 1 + (gapsByChapter[c.chapter]?.length ? 0.6 : 0);
  return [...due].sort((a, b) => weight(b) - weight(a));
}

export default function Flashcards() {
  const { flashcards, setCards, reviewCard, addXP, bumpCombo, resetCombo, combo, gaps } = useStore();
  const [revealed, setRevealed] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const [filter, setFilter] = useState<ChapterId | "all">("all");

  // Seed if empty
  useEffect(() => {
    if (flashcards.length === 0) {
      const now = new Date().toISOString();
      const seeded: FlashCard[] = SEED_CARDS.map((s) => ({ ...s, box: 1, due: now }));
      setCards(seeded);
    }
  }, [flashcards.length, setCards]);

  const queue = useMemo(() => {
    const q = pickQueue(flashcards, gaps);
    if (filter === "all") return q;
    return q.filter((c) => c.chapter === filter);
  }, [flashcards, gaps, filter]);

  const current = queue[0];

  function handle(ok: boolean) {
    if (!current) return;
    reviewCard(current.id, ok);
    if (ok) {
      bumpCombo();
      addXP(8 + combo * 2);
      sfx.good();
      sfx.combo(combo + 1);
      setConfetti((n) => n + 1);
    } else {
      resetCombo();
      addXP(2);
      sfx.bad();
    }
    setRevealed(false);
  }

  const total = flashcards.length;
  const mastered = flashcards.filter((c) => c.box >= 4).length;
  const dueAll = flashcards.filter((c) => new Date(c.due) <= new Date()).length;

  return (
    <Page title="Cartes Leitner" subtitle={`Dues : ${dueAll}/${total} · Maîtrisées : ${mastered}`}>
      <ConfettiBurst trigger={confetti} />
      <div className="card flex flex-wrap gap-2 text-sm">
        <FilterBtn label="Tout" active={filter === "all"} onClick={() => setFilter("all")} />
        {(Object.keys(CHAPTER_LABEL) as ChapterId[]).map((c) => (
          <FilterBtn
            key={c}
            label={CHAPTER_LABEL[c]}
            active={filter === c}
            onClick={() => setFilter(c)}
          />
        ))}
      </div>

      {!current ? (
        <div className="card text-center">
          <div className="text-3xl">🌟</div>
          <div className="title-pixel text-2xl text-gold mt-2">Boîte vidée !</div>
          <p className="text-sm mt-2 opacity-80">
            Plus de cartes dues maintenant. Reviens dans quelques heures, ou change le filtre.
          </p>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + (revealed ? "-r" : "-q")}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="card-paper min-h-[220px] flex flex-col"
              onClick={() => {
                if (!revealed) {
                  setRevealed(true);
                  sfx.pop();
                }
              }}
            >
              <div className="text-xs font-bold uppercase opacity-60">
                {CHAPTER_LABEL[current.chapter]} · Boîte {current.box}/5
              </div>
              <div className="text-lg font-bold mt-2">{current.q}</div>
              {revealed ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm leading-relaxed"
                >
                  <div className="font-bold text-rose">Réponse :</div>
                  {current.a}
                </motion.div>
              ) : (
                <div className="mt-auto text-center text-sm opacity-70 pt-4">
                  Tape sur la carte pour révéler
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {revealed && (
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-rose" onClick={() => handle(false)}>
                Raté ↻
              </button>
              <button className="btn-teal" onClick={() => handle(true)}>
                Réussi ✓
              </button>
            </div>
          )}

          <div className="card text-xs opacity-80">
            <b>Comment ça marche</b> : tu réponds <b>de tête</b>, puis tu tapes la carte. Si tu réussis, la carte
            monte d'un niveau (revue de plus en plus tard). Si tu rates, elle redescend en boîte 1.
          </div>
        </>
      )}
    </Page>
  );
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full font-semibold border-2 ${
        active ? "bg-gold text-ink border-ink" : "bg-white/5 text-paper border-white/15"
      }`}
    >
      {label}
    </button>
  );
}
