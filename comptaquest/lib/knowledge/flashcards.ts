import type { ChapterId } from "../store";

export interface SeedCard {
  id: string;
  chapter: ChapterId;
  q: string;
  a: string;
}

/**
 * High-yield questions for the night-before-exam crash review.
 * Pulled directly from the corpus (TVA / achats-ventes / amortissements / organisation).
 */
export const SEED_CARDS: SeedCard[] = [
  // ===== TVA =====
  { id: "tva-01", chapter: "tva", q: "Quels sont les 4 taux de TVA en France depuis 2014 ?",
    a: "20% (normal), 10% (intermédiaire), 5,5% (réduit), 2,1% (super-réduit). En Algérie : 19% et 9%." },
  { id: "tva-02", chapter: "tva", q: "Compte de la TVA collectée ? TVA déductible sur ABS ? TVA déductible sur immobilisations ?",
    a: "44571 / 44566 / 44562." },
  { id: "tva-03", chapter: "tva", q: "Compte du crédit de TVA à reporter ? De la TVA à décaisser ?",
    a: "44567 (débit, créance) / 44551 (crédit, dette)." },
  { id: "tva-04", chapter: "tva", q: "Fait générateur et exigibilité de la TVA pour une livraison de bien ?",
    a: "Délivrance du bien (fait générateur = exigibilité)." },
  { id: "tva-05", chapter: "tva", q: "Fait générateur et exigibilité pour une prestation de service ?",
    a: "Fait générateur = exécution ; exigibilité = encaissement du prix." },
  { id: "tva-06", chapter: "tva", q: "Acquisition intracommunautaire : que devient la TVA ?",
    a: "TVA auto-liquidée : collectée ET déductible sur la même déclaration => impact NEUTRE en trésorerie." },
  { id: "tva-07", chapter: "tva", q: "Vente intracommunautaire et exportation hors UE : régime TVA ?",
    a: "Exonérées de TVA (livraison intracom + export)." },
  { id: "tva-08", chapter: "tva", q: "Formule pour passer du TTC à la TVA (taux 20%) ?",
    a: "TVA = TTC × 20% / 120% = TTC × 0,2 / 1,2." },
  { id: "tva-09", chapter: "tva", q: "Quand on a TVA collectée 14 220 € + TVA collectée intracom 4 000 €, TVA déductible 12 630 € et un crédit antérieur de 1 560 €, combien à payer ?",
    a: "(14 220 + 4 000) − 12 630 − 1 560 = 4 030 € (TVA à décaisser, compte 44551)." },
  { id: "tva-10", chapter: "tva", q: "TVA déductible doit-elle être déclarée même si la facture n'est pas payée ?",
    a: "OUI. Pour la TVA déductible sur achats de biens, l'exigibilité est la livraison, indépendamment du paiement." },

  // ===== Achats / Ventes =====
  { id: "av-01", chapter: "achats-ventes", q: "Ordre de calcul des réductions sur une facture ?",
    a: "1) Remise, 2) Rabais, 3) Ristourne (en cascade) → Net commercial. 4) Escompte sur le DERNIER NC. 5) TVA sur le NET FINANCIER." },
  { id: "av-02", chapter: "achats-ventes", q: "Les RRR figurent-ils sur la facture de doit ?",
    a: "Oui en présentation, mais ils ne sont JAMAIS comptabilisés ; on enregistre directement le net commercial dans 607/707." },
  { id: "av-03", chapter: "achats-ventes", q: "Compte de l'escompte chez le client ? Chez le fournisseur ?",
    a: "Client : 765 'Escomptes obtenus' (produit financier, crédit). Fournisseur : 665 'Escomptes accordés' (charge financière, débit)." },
  { id: "av-04", chapter: "achats-ventes", q: "Différence entre remise, rabais et ristourne ?",
    a: "Remise = quantité/qualité du client. Rabais = compense défaut/retard. Ristourne = fidélité, sur CA HT d'une période." },
  { id: "av-05", chapter: "achats-ventes", q: "Compte des RRR obtenus / accordés (facture d'avoir uniquement) ?",
    a: "Obtenus (chez l'acheteur) : 609. Accordés (chez le vendeur) : 709." },
  { id: "av-06", chapter: "achats-ventes", q: "Ecriture type d'un achat de marchandises 1 000 € HT, TVA 20%, à crédit, chez le client ?",
    a: "DEBIT 607 1000 + 44566 200 ; CREDIT 401 1200." },
  { id: "av-07", chapter: "achats-ventes", q: "Ecriture type d'une vente de marchandises 2 000 € HT, TVA 20%, 50% comptant et 50% crédit ?",
    a: "DEBIT 411 1200 + 512 1200 ; CREDIT 707 2000 + 44571 400." },
  { id: "av-08", chapter: "achats-ventes", q: "Comptes des avances/acomptes sur commande ?",
    a: "4091 'Fournisseurs - avances et acomptes versés' (débit chez nous quand on verse). 4191 'Clients - avances et acomptes reçus' (crédit chez nous quand on reçoit)." },
  { id: "av-09", chapter: "achats-ventes", q: "Port forfaitaire vs port débours : quelle TVA ?",
    a: "Forfaitaire : même taux que les marchandises. Débours en conditions DÉPART : 20% (FR) quel que soit le taux des biens. En conditions ARRIVÉE : taux des biens." },
  { id: "av-10", chapter: "achats-ventes", q: "Méthodes inventaire : permanent vs intermittent ?",
    a: "Permanent (Algérie/SCF) : stocks mouvementés à chaque entrée/sortie (compte 30). Intermittent (France/PCG) : régularisation en fin d'exercice (variation de stock)." },

  // ===== Amortissements =====
  { id: "am-01", chapter: "amortissements", q: "Compte de la dotation aux amortissements ? Compte des amortissements cumulés au bilan ?",
    a: "Charge : 681 (dotation). Bilan (passif sous l'actif net) : 28x (amort. cumulés)." },
  { id: "am-02", chapter: "amortissements", q: "Formule de l'annuité linéaire ?",
    a: "a = (V0 − valeur résiduelle) / N, ou a = base × t où t = 100/N." },
  { id: "am-03", chapter: "amortissements", q: "Amortissement linéaire : date de départ ? Calcul de la 1ère annuité ?",
    a: "Date de MISE EN SERVICE. Prorata en JOURS (mois de 30, année de 360). Une 1ère annuité incomplète => ligne supplémentaire en fin de plan." },
  { id: "am-04", chapter: "amortissements", q: "Coefficients dégressifs en France après 1/1/2001 ?",
    a: "3-4 ans → 1,25 ; 5-6 ans → 1,75 ; >6 ans → 2,25." },
  { id: "am-05", chapter: "amortissements", q: "Amortissement dégressif : date de départ ? Prorata ? Base ?",
    a: "Mois d'ACQUISITION (entier). Prorata en MOIS entiers. Base = VNC du début d'année (≠ V0 − valeur résiduelle)." },
  { id: "am-06", chapter: "amortissements", q: "Quand bascule-t-on en linéaire dans un plan dégressif ?",
    a: "Lorsque le taux linéaire calculé sur le nombre d'années restantes (100 / années restantes) devient supérieur au taux dégressif." },
  { id: "am-07", chapter: "amortissements", q: "Amortissement en unités d'œuvre : formule ?",
    a: "Annuité = Base amortissable × (UO consommées dans l'année / UO totales prévues)." },
  { id: "am-08", chapter: "amortissements", q: "Quels biens peuvent être amortis en dégressif (France) ?",
    a: "Matériel industriel, matériel roulant (sauf véhicules de tourisme), immeubles industriels, matériel de bureau ; ACQUIS NEUFS, durée > 3 ans. Facultatif." },
  { id: "am-09", chapter: "amortissements", q: "Valeur amortissable vs valeur résiduelle ?",
    a: "Valeur amortissable = V0 (HT, frais inclus) − valeur résiduelle (si SIGNIFICATIVE et MESURABLE)." },
  { id: "am-10", chapter: "amortissements", q: "Ecriture d'inventaire pour une dotation linéaire de 12 500 € ?",
    a: "31/12/N : DEBIT 681 12 500 ; CREDIT 281 12 500. Libellé : 'D'après plan d'amortissement linéaire'." },

  // ===== Organisation comptable =====
  { id: "or-01", chapter: "organisation", q: "Chaîne d'enregistrement comptable ?",
    a: "Pièce → Journal → Grand livre → Balance → Bilan + Compte de résultat." },
  { id: "or-02", chapter: "organisation", q: "Que contient le bilan ? Le compte de résultat ?",
    a: "Bilan = patrimoine (Actif/Passif). Compte de résultat = performance (Charges/Produits)." },
  { id: "or-03", chapter: "organisation", q: "Egalité fondamentale en fin d'exercice ?",
    a: "Actifs − Passifs = Produits − Charges = Résultat de l'exercice." },
  { id: "or-04", chapter: "organisation", q: "VMP vs titres de participation ?",
    a: "VMP : actions/obligations destinées à la revente (actif circulant). Titres de participation : contrôle d'autres entreprises (immobilisations financières)." },
  { id: "or-05", chapter: "organisation", q: "Report à nouveau : qu'est-ce que c'est ?",
    a: "Le résultat de l'exercice non encore affecté par l'AG, automatiquement reporté au 1/1 suivant. Une fois affecté, il devient réserves et/ou dividendes." },
];
