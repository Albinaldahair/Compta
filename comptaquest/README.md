# ComptaQuest 🐱📒

Une web-app gamifiée pour réussir l'examen de **Comptabilité L2** demain matin, sans douleur. Pensée pour les gens qui n'aiment pas étudier et qui aiment bien dopaminer.

> Construit à partir des cours du repo `Albinaldahair/Compta` (TVA, achats/ventes, amortissements, organisation comptable) et du style des examens du prof (Delta SARL, Turpin/Déon).

---

## Ce que tu obtiens

- **🐱 Compto**, un chat pixel-art qui te coache (humeurs : neutre, content, en feu, somnolent, KO).
- **🎯 Diagnostic Cinglant** (5 min) qui mesure ton ignorance AVANT que tu relises (Casselman & Atwood, Univ. Utah).
- **🧠 Cartes Leitner** (répétition espacée, Hack #2) avec interleaving (Hack #3) sur les chapitres.
- **📝 Examen Blanc** : l'IA génère des sujets dans le **style exact** de tes profs et corrige sur 20.
- **🎙️ Production Effect** : tu expliques à voix haute, l'IA te corrige (+15 à 20% de rétention selon les études).
- **🌙 Rituel du soir** : récup libre + question pour le sommeil (Hack #5, Wagner et al. 2004).
- **📒 Plan comptable** intégré, recherchable, autorisé à l'examen.
- **XP / niveau / streak / combo** pour la dopamine. Sons rétro Web Audio (zéro asset).
- **Mobile-first** : ouvre-le sur ton iPhone, ajoute-le à l'écran d'accueil, c'est une PWA standalone.

---

## Lancer en local (5 min)

```bash
cd Compta/comptaquest
npm install
cp .env.example .env.local
# Édite .env.local et colle ta clé DashScope (jamais commitée)
npm run dev
# → http://localhost:3000
```

> Tu DOIS coller ta clé `DASHSCOPE_API_KEY` dans `.env.local`. Si tu as un message d'erreur "DASHSCOPE_API_KEY missing", c'est que ce fichier n'existe pas ou que la valeur est vide.

---

## Déployer sur Vercel (gratuit, 3 min)

1. **Pousse ton repo sur GitHub** (déjà fait ici, c'est `Albinaldahair/Compta`).
2. Va sur [vercel.com/new](https://vercel.com/new) → "Import Git Repository" → choisis `Compta`.
3. **Root Directory** : `comptaquest`.
4. Framework : Next.js (détection auto).
5. Section **Environment Variables**, ajoute :

| Nom | Valeur |
|---|---|
| `DASHSCOPE_API_KEY` | ta nouvelle clé `sk-...` |
| `DASHSCOPE_BASE_URL` | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| `MODEL_REASONING` | `qwen3.7-max-preview` |
| `MODEL_VISION` | `qwen3-vl-235b-a22b-thinking` |
| `MODEL_OCR` | `qwen-vl-ocr` |
| `MODEL_FAST` | `qwen-flash` |

6. **Deploy**. En 60 secondes tu auras une URL `https://comptaquest-xxx.vercel.app` que tu peux ouvrir sur ton iPhone et "Ajouter à l'écran d'accueil".

> ⚠️ La clé que tu m'as collée dans le chat est désormais publique. **Révoque-la** sur la console DashScope et génère une nouvelle clé pour Vercel.

---

## Modèles utilisés (Alibaba Cloud Model Studio, OpenAI-compatible)

| Usage | Modèle | Pourquoi |
|---|---|---|
| Diagnostic, génération d'examens, correction | `qwen3.7-max-preview` | Le plus fort en raisonnement disponible dans ton quota. |
| Vision (lire ton brouillon, expliquer une photo) | `qwen3-vl-235b-a22b-thinking` | VL premium avec raisonnement. |
| OCR pur | `qwen-vl-ocr` | Spécialisé, plus rapide. |
| Réponses rapides | `qwen-flash` | Latence basse pour les coups vite. |

L'endpoint utilisé est `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` (Singapour, OpenAI-compatible — il suffit de changer la `base_url`, l'`api_key`, et le `model`).

Pour basculer sur DeepSeek, change `MODEL_REASONING=deepseek-v4-pro` dans tes variables d'env.

---

## Architecture techniques en une page

```
comptaquest/
├─ app/
│  ├─ page.tsx               # Hub (Compto + quêtes + maîtrise)
│  ├─ diagnostic/page.tsx    # Diagnostic Cinglant (Hack #1, #6)
│  ├─ flashcards/page.tsx    # Leitner + interleaving (Hack #2, #3)
│  ├─ exam/page.tsx          # Génération + correction d'examens (Hack #1)
│  ├─ voice/page.tsx         # Production Effect (Hack #7)
│  ├─ night/page.tsx         # Rituel du soir (Hack #5)
│  ├─ pcg/page.tsx           # Plan comptable cheat sheet
│  └─ api/
│     ├─ chat/route.ts          # Proxy server-side
│     ├─ diagnostic/route.ts    # Eval gaps via JSON
│     ├─ generate-exam/route.ts # Sujet style Delta/Turpin
│     ├─ grade/route.ts         # Note /20 + erreurs + next
│     └─ vision/route.ts        # OCR + explication d'une photo
├─ components/
│  ├─ HUD.tsx                # Niveau, XP, streak, combo
│  ├─ PixelPet.tsx           # Compto (SVG pixel)
│  ├─ Confetti.tsx           # Bursts dopaminiques
│  ├─ Page.tsx, BottomNav.tsx
├─ lib/
│  ├─ ai.ts                  # Client OpenAI-compatible DashScope
│  ├─ store.ts               # Zustand + persist localStorage
│  ├─ sound.ts               # SFX Web Audio
│  └─ knowledge/
│     ├─ pcg.ts              # Plan comptable
│     ├─ flashcards.ts       # 30+ cartes seed extraites du cours
│     └─ diagnostic.ts       # 4 questions cinglantes
└─ .env.example              # Modèle de variables d'env (jamais committe .env.local)
```

---

## Plan d'attaque pour ton examen demain (12h max)

| Heure | Action | Hack appliqué |
|---|---|---|
| Maintenant | Diagnostic Cinglant (5 min) | Metacognitive training |
| +5 min | Cartes Leitner sur ton chapitre rouge (40 min) | Retrieval + spaced rep |
| +45 min | Pause SANS écran (10 min) | Macro-spacing 40/10 |
| +55 min | Voix : explique 3 sujets à voix haute (15 min) | Production effect |
| +1h10 | Examen blanc complet (45 min) chrono | Practice testing |
| +2h    | Pause + dîner | Sommeil |
| +3h | Rituel du soir + dodo | Consolidation |
| Au réveil | 5 cartes ratées + PCG flash | Récence |

---

## Sécurité

- La clé API est lue **côté serveur uniquement** (`process.env.DASHSCOPE_API_KEY`), jamais exposée au navigateur.
- `.env.local` est gitignored.
- Si tu déploies sur Vercel, mets la clé dans **Project → Settings → Environment Variables** (pas dans le code).

Bonne chance demain. Tu vas l'avoir.
