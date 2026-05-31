"use client";
/** Tiny Web Audio sound effects: zero asset weight, instant, juicy. */
let ctx: AudioContext | null = null;
function ac() {
  if (typeof window === "undefined") return null;
  ctx ||= new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function tone(freq: number, dur = 0.08, type: OscillatorType = "square", vol = 0.05, when = 0) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur);
}

export const sfx = {
  click: () => tone(420, 0.05, "square", 0.04),
  good: () => {
    tone(523, 0.07, "triangle", 0.06);
    tone(659, 0.09, "triangle", 0.06, 0.06);
    tone(784, 0.12, "triangle", 0.06, 0.13);
  },
  bad: () => {
    tone(220, 0.1, "sawtooth", 0.05);
    tone(150, 0.18, "sawtooth", 0.05, 0.08);
  },
  level: () => {
    tone(523, 0.08, "square", 0.06);
    tone(659, 0.08, "square", 0.06, 0.08);
    tone(784, 0.08, "square", 0.06, 0.16);
    tone(1046, 0.18, "square", 0.06, 0.24);
  },
  combo: (n: number) => {
    const f = 440 + Math.min(n, 9) * 60;
    tone(f, 0.06, "square", 0.05);
  },
  pop: () => tone(900, 0.04, "triangle", 0.05),
};
