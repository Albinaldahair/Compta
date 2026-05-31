"use client";
import { motion } from "framer-motion";
import { useStore, xpToNext } from "@/lib/store";
import { useEffect } from "react";

/** Top heads-up display: level, XP bar, streak, combo. */
export function HUD() {
  const { xp, level, streak, combo, hydrateDefaults } = useStore();

  useEffect(() => {
    hydrateDefaults();
  }, [hydrateDefaults]);

  const next = xpToNext(level);
  const pct = Math.min(100, Math.round((xp / next) * 100));

  return (
    <div className="card flex items-center gap-3 p-3">
      <div className="flex items-center gap-2 shrink-0">
        <div className="title-pixel text-2xl text-gold leading-none">Lv {level}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-3 rounded-full bg-white/10 border border-white/15 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-violet via-rose to-gold stripes"
            initial={false}
            animate={{ width: pct + "%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <div className="text-xs opacity-70 mt-1">{xp} / {next} XP</div>
      </div>
      <div className="flex flex-col items-end shrink-0 text-right">
        <div className="text-xs opacity-70">Série</div>
        <div className="title-pixel text-xl text-rose leading-none">🔥 {streak}j</div>
      </div>
      {combo >= 2 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ml-2 px-2 py-1 rounded-lg bg-teal text-ink font-extrabold"
        >
          x{combo}
        </motion.div>
      )}
    </div>
  );
}
