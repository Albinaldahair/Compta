/**
 * Plan Comptable Général — minimal, exam-relevant subset for L2.
 * Source: cours_07_03 + cours_09_03 + cours_decembre + corrige_examen.
 */

export interface Account {
  num: string;
  name: string;
  /** debit | credit | both — typical movement direction. */
  side: "debit" | "credit" | "both";
  chapter:
    | "TVA"
    | "Achats / Ventes"
    | "Tiers"
    | "Trésorerie"
    | "Capitaux"
    | "Charges"
    | "Produits"
    | "Immobilisations"
    | "Amortissements";
  hint?: string;
}

export const PCG: Account[] = [
  // Capitaux
  { num: "101", name: "Capital", side: "credit", chapter: "Capitaux" },
  { num: "106", name: "Réserves", side: "credit", chapter: "Capitaux" },
  { num: "11", name: "Report à nouveau", side: "both", chapter: "Capitaux" },
  { num: "12", name: "Résultat de l'exercice", side: "both", chapter: "Capitaux" },
  { num: "164", name: "Emprunts", side: "credit", chapter: "Capitaux" },
  // Immobilisations
  { num: "2", name: "Immobilisations (classe 2)", side: "debit", chapter: "Immobilisations" },
  { num: "211", name: "Terrains", side: "debit", chapter: "Immobilisations" },
  { num: "213", name: "Constructions", side: "debit", chapter: "Immobilisations" },
  { num: "2154", name: "Matériel industriel", side: "debit", chapter: "Immobilisations" },
  { num: "2182", name: "Matériel de transport", side: "debit", chapter: "Immobilisations" },
  { num: "2183", name: "Matériel informatique", side: "debit", chapter: "Immobilisations" },
  { num: "275", name: "Dépôts et cautionnements versés", side: "debit", chapter: "Immobilisations" },
  // Amortissements
  { num: "28", name: "Amortissements des immobilisations", side: "credit", chapter: "Amortissements" },
  { num: "281", name: "Amortissement d'immobilisation (générique)", side: "credit", chapter: "Amortissements" },
  { num: "2815", name: "Amort. matériel industriel", side: "credit", chapter: "Amortissements" },
  { num: "28182", name: "Amort. matériel de transport", side: "credit", chapter: "Amortissements" },
  // Stocks
  { num: "30", name: "Stocks de marchandises", side: "both", chapter: "Achats / Ventes" },
  { num: "38", name: "Stocks en voie d'acheminement", side: "both", chapter: "Achats / Ventes" },
  // Tiers
  { num: "401", name: "Fournisseurs", side: "credit", chapter: "Tiers" },
  { num: "4091", name: "Fournisseurs - avances et acomptes versés", side: "debit", chapter: "Tiers" },
  { num: "411", name: "Clients", side: "debit", chapter: "Tiers" },
  { num: "4191", name: "Clients - avances et acomptes reçus", side: "credit", chapter: "Tiers" },
  // TVA
  { num: "44551", name: "TVA à décaisser", side: "credit", chapter: "TVA" },
  { num: "44562", name: "TVA déductible sur immobilisations", side: "debit", chapter: "TVA" },
  { num: "44566", name: "TVA déductible sur autres biens et services (ABS)", side: "debit", chapter: "TVA" },
  { num: "44567", name: "Crédit de TVA à reporter", side: "debit", chapter: "TVA" },
  { num: "44571", name: "TVA collectée", side: "credit", chapter: "TVA" },
  { num: "4452", name: "TVA collectée intracommunautaire (auto-liquidation)", side: "credit", chapter: "TVA" },
  { num: "445662", name: "TVA déductible intracommunautaire", side: "debit", chapter: "TVA" },
  { num: "445663", name: "TVA déductible sur importations", side: "debit", chapter: "TVA" },
  { num: "4453", name: "TVA collectée opérations internationales", side: "credit", chapter: "TVA" },
  // Charges
  { num: "601", name: "Achats stockés - Matières premières", side: "debit", chapter: "Charges" },
  { num: "606", name: "Achats non stockés", side: "debit", chapter: "Charges" },
  { num: "607", name: "Achats de marchandises", side: "debit", chapter: "Charges" },
  { num: "609", name: "RRR obtenus sur achats", side: "credit", chapter: "Charges" },
  { num: "613", name: "Locations / loyers", side: "debit", chapter: "Charges" },
  { num: "616", name: "Primes d'assurance", side: "debit", chapter: "Charges" },
  { num: "624", name: "Transports de biens", side: "debit", chapter: "Charges" },
  { num: "641", name: "Salaires et appointements", side: "debit", chapter: "Charges" },
  { num: "665", name: "Escomptes accordés (charge financière)", side: "debit", chapter: "Charges" },
  { num: "681", name: "Dotations aux amortissements et provisions", side: "debit", chapter: "Charges" },
  { num: "600", name: "Achats marchandises (SCF Algérie)", side: "debit", chapter: "Charges" },
  // Produits
  { num: "701", name: "Ventes de produits finis", side: "credit", chapter: "Produits" },
  { num: "706", name: "Prestations de services", side: "credit", chapter: "Produits" },
  { num: "707", name: "Ventes de marchandises", side: "credit", chapter: "Produits" },
  { num: "709", name: "RRR accordés par l'entreprise", side: "debit", chapter: "Produits" },
  { num: "765", name: "Escomptes obtenus (produit financier)", side: "credit", chapter: "Produits" },
  { num: "700", name: "Ventes marchandises (SCF Algérie)", side: "credit", chapter: "Produits" },
  // Trésorerie
  { num: "512", name: "Banque", side: "both", chapter: "Trésorerie" },
  { num: "514", name: "Chèques postaux", side: "both", chapter: "Trésorerie" },
  { num: "530", name: "Caisse", side: "both", chapter: "Trésorerie" },
];

/** Quick lookup. */
export const findAccount = (q: string) =>
  PCG.find((a) => a.num === q.trim()) ||
  PCG.find((a) => a.name.toLowerCase().includes(q.toLowerCase()));
