"use client";
import { useMemo, useState } from "react";
import { Page } from "@/components/Page";
import { PCG } from "@/lib/knowledge/pcg";

export default function PCGPage() {
  const [q, setQ] = useState("");
  const [chapter, setChapter] = useState<string>("Tous");

  const chapters = useMemo(
    () => ["Tous", ...Array.from(new Set(PCG.map((a) => a.chapter)))],
    []
  );

  const filtered = useMemo(() => {
    return PCG.filter((a) => {
      if (chapter !== "Tous" && a.chapter !== chapter) return false;
      const t = q.trim().toLowerCase();
      if (!t) return true;
      return a.num.includes(t) || a.name.toLowerCase().includes(t);
    });
  }, [q, chapter]);

  return (
    <Page title="Plan comptable" subtitle="Cheat sheet — autorisée à l'examen">
      <div className="card">
        <input
          className="compta"
          placeholder="🔎 Rechercher (ex : 44571, escompte, immobilisation…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {chapters.map((c) => (
            <button
              key={c}
              onClick={() => setChapter(c)}
              className={`text-xs px-2 py-1 rounded-full border-2 ${
                chapter === c ? "bg-gold text-ink border-ink" : "bg-white/5 border-white/15"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="card divide-y divide-white/10">
        {filtered.length === 0 && <div className="text-sm opacity-70">Aucun compte.</div>}
        {filtered.map((a) => (
          <div key={a.num} className="py-2 flex items-baseline gap-3">
            <div className="font-mono font-extrabold text-gold w-20 shrink-0">{a.num}</div>
            <div className="flex-1">
              <div className="font-semibold">{a.name}</div>
              <div className="text-xs opacity-70">
                {a.chapter} · sens habituel : <b>{a.side}</b>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card text-xs leading-relaxed">
        <b>Pense-bête éclair</b> :
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>TVA : 44571 (collectée), 44566 (déd. ABS), 44562 (déd. immo), 44567 (crédit), 44551 (à payer).</li>
          <li>Escompte : 765 chez le client (produit), 665 chez le fournisseur (charge).</li>
          <li>RRR sur facture d'avoir : 609 obtenus / 709 accordés.</li>
          <li>Avances : 4091 versées (créance), 4191 reçues (dette).</li>
          <li>Amort : DEBIT 681 / CREDIT 28x à l'inventaire.</li>
        </ul>
      </div>
    </Page>
  );
}
