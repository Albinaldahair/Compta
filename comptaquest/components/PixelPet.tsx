"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

/**
 * Compto — the pixel-art comptable cat.
 * Pure SVG, no asset, scales perfectly, tail wags, eyes blink.
 * Mood drives expression + accessory (pencil/coffee/ZZZ).
 */
export function PixelPet({
  size = 120,
  bubble,
}: {
  size?: number;
  bubble?: string | null;
}) {
  const mood = useStore((s) => s.mood);

  // Color palette for fur and accents based on mood
  const palette = {
    happy: { fur: "#f5c518", cheek: "#ff5d8f", eye: "#0b0d12", scarf: "#06d6a0" },
    fire:  { fur: "#ff7a59", cheek: "#fff", eye: "#0b0d12", scarf: "#f5c518" },
    neutral:{ fur: "#cdb6ff", cheek: "#ff5d8f", eye: "#0b0d12", scarf: "#7c3aed" },
    sleepy: { fur: "#9aa3b2", cheek: "#ff5d8f", eye: "#0b0d12", scarf: "#0b0d12" },
    ko:     { fur: "#5d6172", cheek: "#ff5d8f", eye: "#0b0d12", scarf: "#0b0d12" },
  }[mood];

  const eyesClosed = mood === "sleepy" || mood === "ko";

  return (
    <div className="relative flex flex-col items-center select-none">
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="card-paper text-sm mb-2 max-w-[260px] text-center font-medium"
          >
            {bubble}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 64 64" className="pixelated w-full h-full" shapeRendering="crispEdges">
          {/* shadow */}
          <ellipse cx="32" cy="58" rx="18" ry="3" fill="rgba(0,0,0,0.35)" />

          {/* body */}
          <rect x="14" y="28" width="36" height="22" fill={palette.fur} />
          <rect x="12" y="30" width="2"  height="18" fill={palette.fur} />
          <rect x="50" y="30" width="2"  height="18" fill={palette.fur} />
          {/* belly */}
          <rect x="22" y="36" width="20" height="12" fill="#fff7df" opacity="0.85" />

          {/* head */}
          <rect x="16" y="14" width="32" height="20" fill={palette.fur} />
          {/* ears */}
          <polygon points="16,14 22,4 22,14" fill={palette.fur} />
          <polygon points="48,14 42,4 42,14" fill={palette.fur} />
          <polygon points="18,12 21,7 21,12" fill="#ff5d8f" />
          <polygon points="46,12 43,7 43,12" fill="#ff5d8f" />

          {/* cheeks */}
          <rect x="20" y="24" width="3" height="2" fill={palette.cheek} />
          <rect x="41" y="24" width="3" height="2" fill={palette.cheek} />

          {/* eyes */}
          {eyesClosed ? (
            <>
              <rect x="22" y="22" width="6" height="1" fill={palette.eye} />
              <rect x="36" y="22" width="6" height="1" fill={palette.eye} />
            </>
          ) : (
            <>
              <rect x="23" y="20" width="4" height="4" fill={palette.eye} />
              <rect x="37" y="20" width="4" height="4" fill={palette.eye} />
              <rect x="24" y="20" width="1" height="1" fill="#fff" />
              <rect x="38" y="20" width="1" height="1" fill="#fff" />
            </>
          )}

          {/* mouth */}
          {mood === "happy" && (
            <>
              <rect x="30" y="26" width="4" height="1" fill={palette.eye} />
              <rect x="29" y="27" width="1" height="1" fill={palette.eye} />
              <rect x="34" y="27" width="1" height="1" fill={palette.eye} />
            </>
          )}
          {mood === "fire" && (
            <>
              <rect x="29" y="26" width="6" height="2" fill={palette.eye} />
              <rect x="30" y="28" width="4" height="1" fill="#fff" />
            </>
          )}
          {mood === "neutral" && <rect x="30" y="27" width="4" height="1" fill={palette.eye} />}
          {mood === "sleepy" && <rect x="30" y="27" width="3" height="1" fill={palette.eye} />}
          {mood === "ko" && (
            <>
              <rect x="30" y="27" width="4" height="1" fill={palette.eye} />
              <rect x="22" y="20" width="2" height="2" fill="#ff5d8f" />
              <rect x="40" y="20" width="2" height="2" fill="#ff5d8f" />
            </>
          )}

          {/* scarf */}
          <rect x="14" y="32" width="36" height="3" fill={palette.scarf} />
          <rect x="20" y="35" width="3"  height="3" fill={palette.scarf} />

          {/* tail */}
          <motion.g
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50px 40px" }}
          >
            <rect x="50" y="34" width="4" height="3" fill={palette.fur} />
            <rect x="53" y="32" width="4" height="3" fill={palette.fur} />
            <rect x="56" y="30" width="3" height="3" fill={palette.fur} />
          </motion.g>

          {/* sleepy ZZZ */}
          {mood === "sleepy" && (
            <text x="48" y="14" fontSize="6" fill="#fff" fontFamily="monospace">Z</text>
          )}
          {/* fire mode crown */}
          {mood === "fire" && (
            <>
              <rect x="22" y="2" width="20" height="2" fill="#ffd34d" />
              <rect x="24" y="0" width="2" height="2" fill="#ffd34d" />
              <rect x="31" y="0" width="2" height="2" fill="#ffd34d" />
              <rect x="38" y="0" width="2" height="2" fill="#ffd34d" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
