import type { ChapterId } from "../store";

/**
 * Diagnostic Cinglant — based on Casselman & Atwood (Univ. Utah).
 * One question per chapter title. Self-rate confidence in 30 seconds.
 * Output → red flags = priority chapters.
 */

export interface DiagItem {
  chapter: ChapterId;
  title: string;
  /** A meta-question that exposes ignorance fast. */
  testQuestion: string;
  /** What a strong answer would look like (used by AI feedback). */
  expectedKey: string;
  /** Concrete sub-skills checked under this chapter — used to render gaps. */
  subskills: string[];
}

export const DIAGNOSTIC: DiagItem[] = [
  {
    chapter: "tva",
    title: "TVA : collectée, déductible, due, intracom.",
    testQuestion:
      "En 60 secondes : explique le mécanisme de la TVA. Cite les 5 comptes clés (44571, 44566, 44562, 44567, 44551), l'auto-liquidation intracom, et la formule TTC → TVA pour 20%.",
    expectedKey:
      "TVA neutre pour entreprise. Collectée sur ventes (44571), déductible sur achats (44566 ABS, 44562 immo), TVA due = collectée − déductible. Intracom : collectée+déductible neutralisée. TTC × 20/120.",
    subskills: ["taux et comptes", "exigibilité (livraison vs encaissement)", "intracom auto-liquidée", "calcul TTC↔HT", "écriture de déclaration mensuelle"],
  },
  {
    chapter: "achats-ventes",
    title: "Factures : remise, rabais, ristourne, escompte, avoirs",
    testQuestion:
      "Sur une facture : marchandises 1 000 €, remise 5%, rabais 2%, escompte 3%, TVA 20%. Quel est le NET À PAYER TTC et où s'enregistre l'escompte chez le client ?",
    expectedKey:
      "NC1 = 950 ; NC2 = 931 ; Escompte 3% = 27,93 → Net financier 903,07 ; TVA 180,61 → Net à payer 1 083,68. Chez le client l'escompte va au crédit du 765 (produit financier).",
    subskills: ["cascade RRR", "escompte sur dernier NC", "TVA sur net financier", "compte 665 vs 765", "facture d'avoir : retours vs RRR ultérieurs"],
  },
  {
    chapter: "amortissements",
    title: "Amortissements : linéaire, dégressif, unités d'œuvre",
    testQuestion:
      "Une machine 11 000 € HT acquise et mise en service le 15/03/N, durée 5 ans, valeur résiduelle 1 000 €. Donne la 1ère annuité LINÉAIRE et le coefficient dégressif applicable.",
    expectedKey:
      "Base = 11 000 − 1 000 = 10 000. Taux 20%. Prorata 285/360 → 1 583,33 €. Coef dégressif (5-6 ans, France) = 1,75 → td = 35%.",
    subskills: ["base amortissable et valeur résiduelle", "prorata jours linéaire", "prorata mois dégressif", "passage en linéaire", "écriture 681/281"],
  },
  {
    chapter: "organisation",
    title: "Organisation comptable : journal → bilan / compte de résultat",
    testQuestion:
      "Cite la chaîne pièce→bilan, l'égalité fondamentale, et où se range : un emprunt, un dépôt de cautionnement, des actions détenues pour les revendre, des actions d'une filiale.",
    expectedKey:
      "Pièce → journal → grand livre → balance → bilan + résultat. Actifs−Passifs = Produits−Charges = Résultat. Emprunt = passif (164). Cautionnement = immobilisation financière (275). Actions à revendre = VMP (actif circulant). Actions filiale = titres de participation (immo financière).",
    subskills: ["chaîne d'enregistrement", "égalité du bilan", "classement actif vs passif", "VMP vs titres de participation", "report à nouveau & réserves"],
  },
];
