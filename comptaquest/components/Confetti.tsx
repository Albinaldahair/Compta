"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#f5c518", "#ff5d8f", "#06d6a0", "#7c3aed", "#fff"];

export function ConfettiBurst({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<{ id: number; x: number; r: number; c: string }[]>([]);
  useEffect(() => {
    if (!trigger) return;
    const arr = Array.from({ length: 32 }, (_, i) => ({
      id: trigger * 100 + i,
      x: (Math.random() - 0.5) * 360,
      r: Math.random() * 360,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 1100);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            className="confetti-dot"
            style={{ background: p.c }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: 320 + Math.random() * 80,
              opacity: 0,
              rotate: p.r,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
