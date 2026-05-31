"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChapterId = "tva" | "achats-ventes" | "amortissements" | "organisation";

export type Mood = "happy" | "neutral" | "sleepy" | "ko" | "fire";

export interface FlashCard {
  id: string;
  chapter: ChapterId;
  q: string;
  a: string;
  /** Leitner box (1..5). Higher = better mastered. */
  box: number;
  /** Next review date in ISO string. */
  due: string;
  lastResult?: "ok" | "ko";
}

export interface UserState {
  name: string;
  xp: number;
  level: number;
  streak: number;
  combo: number;
  lastActiveDay: string; // YYYY-MM-DD
  mood: Mood;
  /** chapter -> 0..1 mastery */
  mastery: Record<ChapterId, number>;
  /** chapter -> array of weakness strings detected by diagnostic / AI */
  gaps: Record<ChapterId, string[]>;
  flashcards: FlashCard[];
  diagnosticDone: boolean;
  // ---- actions
  hydrateDefaults: () => void;
  addXP: (n: number) => void;
  resetCombo: () => void;
  bumpCombo: () => void;
  tickStreak: () => void;
  setMood: (m: Mood) => void;
  setMastery: (c: ChapterId, v: number) => void;
  setGaps: (c: ChapterId, gaps: string[]) => void;
  setDiagnosticDone: (b: boolean) => void;
  upsertCard: (c: FlashCard) => void;
  setCards: (cards: FlashCard[]) => void;
  reviewCard: (id: string, ok: boolean) => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
/** Leitner intervals in days, indexed by box number. */
const LEITNER_DAYS: Record<number, number> = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 };

const xpForLevel = (lvl: number) => 60 + lvl * 40; // gentle curve

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: "",
      xp: 0,
      level: 1,
      streak: 0,
      combo: 0,
      lastActiveDay: "",
      mood: "neutral",
      mastery: { tva: 0, "achats-ventes": 0, amortissements: 0, organisation: 0 },
      gaps: { tva: [], "achats-ventes": [], amortissements: [], organisation: [] },
      flashcards: [],
      diagnosticDone: false,

      hydrateDefaults: () => {
        const t = todayISO();
        const last = get().lastActiveDay;
        if (last !== t) {
          // streak: increment if last was yesterday, else reset to 1
          const y = addDays(new Date(t), -1).toISOString().slice(0, 10);
          set((s) => ({
            streak: last === y ? s.streak + 1 : 1,
            lastActiveDay: t,
            combo: 0,
          }));
        }
      },

      addXP: (n) => {
        const { xp, level } = get();
        let newXP = xp + n;
        let newLevel = level;
        while (newXP >= xpForLevel(newLevel)) {
          newXP -= xpForLevel(newLevel);
          newLevel += 1;
        }
        set({ xp: newXP, level: newLevel });
      },
      resetCombo: () => set({ combo: 0 }),
      bumpCombo: () => set((s) => ({ combo: s.combo + 1 })),
      tickStreak: () => {
        // called manually if needed — usually handled by hydrateDefaults
        const t = todayISO();
        if (get().lastActiveDay !== t) set({ streak: get().streak + 1, lastActiveDay: t });
      },
      setMood: (m) => set({ mood: m }),
      setMastery: (c, v) =>
        set((s) => ({ mastery: { ...s.mastery, [c]: Math.max(0, Math.min(1, v)) } })),
      setGaps: (c, gaps) => set((s) => ({ gaps: { ...s.gaps, [c]: gaps } })),
      setDiagnosticDone: (b) => set({ diagnosticDone: b }),

      upsertCard: (c) =>
        set((s) => {
          const i = s.flashcards.findIndex((x) => x.id === c.id);
          const next = [...s.flashcards];
          if (i >= 0) next[i] = c;
          else next.push(c);
          return { flashcards: next };
        }),
      setCards: (cards) => set({ flashcards: cards }),
      reviewCard: (id, ok) =>
        set((s) => {
          const next = s.flashcards.map((c) => {
            if (c.id !== id) return c;
            const newBox = ok ? Math.min(5, c.box + 1) : 1;
            const days = LEITNER_DAYS[newBox] ?? 1;
            return {
              ...c,
              box: newBox,
              lastResult: ok ? ("ok" as const) : ("ko" as const),
              due: addDays(new Date(), days).toISOString(),
            };
          });
          return { flashcards: next };
        }),
    }),
    { name: "comptaquest-state" }
  )
);

/** Helper exposed for components that don't want to touch the store directly. */
export function xpToNext(level: number) {
  return xpForLevel(level);
}
