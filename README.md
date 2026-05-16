# Recomp Lean Tracker

Tracker personnel de recomposition corporelle sur 11 mois (98kg → 79kg).
Stack : Next.js 15 (App Router) · React 19 · Vercel Postgres · Auth JWT cookie · Recharts.

## Fonctionnalités

- **Aperçu** : poids, phase, progression globale, séance du jour, heatmap de constance
- **Jour** : tracking quotidien (sommeil, protéines, cardio, mood/énergie/faim, notes), heatmaps
- **Entraînement** : 4 séances Upper/Lower, mode séance plein écran avec timer de repos
- **Charges** : graphes de progression par exercice (poids max + volume)
- **Timeline** : roadmap des 6 phases, courbe cible
- **Nutrition** : macros, sources protéiques, journée type
- **Savoir** : base de connaissances (sommeil, nutrition, training, récup, mental)
- **Sécurité** : exercices interdits + checklist santé
- **Export JSON** : backup complet en un clic

## Déploiement Vercel (étape par étape)

### 1. Pousser le code sur GitHub

```bash
git init
git add -A
git commit -m "Initial commit"
gh repo create recomp-lean-tracker --private --source=. --push
```

(ou via l'UI GitHub si tu n'as pas `gh`)

### 2. Importer dans Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Importe le repo
3. Framework : `Next.js` (auto-détecté). Ne lance pas encore le déploiement.

### 3. Créer la base Postgres

1. Onglet **Storage** du projet Vercel → **Create Database** → **Postgres**
2. Région : `Frankfurt` (le plus proche de la France)
3. Connecte-la au projet → Vercel injecte automatiquement les variables `POSTGRES_*`

### 4. Ajouter les variables d'environnement

Dans **Settings → Environment Variables**, ajoute :

| Nom | Valeur |
|---|---|
| `APP_PASSWORD` | ton mot de passe (min 8 caractères) |
| `JWT_SECRET` | une chaîne aléatoire ≥ 32 caractères (ex : `openssl rand -base64 32`) |

Coche les 3 environnements : Production, Preview, Development.

### 5. Initialiser le schéma DB

Une seule fois, en local :

```bash
# Dans ton terminal local
cp .env.example .env
# Copie les valeurs POSTGRES_* depuis Vercel Dashboard > Storage > .env.local tab
# Mets aussi APP_PASSWORD et JWT_SECRET

npm install
npm run db:init
```

Tu verras `Schema ready.` quand c'est fini.

### 6. Déployer

```bash
git push
```

Vercel build et déploie automatiquement. Va sur l'URL générée, login avec `APP_PASSWORD`, c'est en place.

### 7. (Optionnel) Installer en PWA sur mobile

Sur Safari iOS / Chrome Android : `Partager → Ajouter à l'écran d'accueil`. L'app s'ouvre en plein écran comme une vraie app.

## Développement local

```bash
npm install
cp .env.example .env  # remplir les valeurs
npm run db:init       # une fois
npm run dev           # http://localhost:3000
```

## Backup des données

À tout moment : clique sur `[ EXPORT JSON ]` en bas de page. Ça télécharge un fichier `recomp-export-YYYY-MM-DD.json` avec toutes tes données (poids, séances, tracking quotidien, sets individuels).

Recommandation : 1 export par mois, stocké quelque part (cloud, USB, etc.).

## Structure

```
app/
  api/                    # Routes API (POST/GET/DELETE)
    auth/login            # Login par mot de passe
    state                 # GET initial state en 1 round-trip
    weights               # CRUD poids quotidien
    sessions              # Persiste séance terminée + sets individuels
    daily                 # Tracking quotidien sommeil/proté/cardio/ressenti
    exercises             # Historique par exercice (graphes)
    export                # Dump JSON complet
  login/                  # Page login
  page.tsx                # Server-rendered page → <Tracker>
components/
  Tracker.tsx             # Hub client : tabs + state + sync API
  Header.tsx              # Header dayN/J-X
  tabs/                   # Une vue par onglet
  session/                # Mode séance plein écran (3 sous-vues)
  ui/                     # Heatmap, StatCard, InfoBlock, Slider
lib/
  db.ts                   # Client Postgres
  auth.ts                 # JWT cookie helpers
  helpers.ts              # Date utils + audio
  program.ts              # Programme (séances, phases, diet)
  knowledge.ts            # Base de connaissances
scripts/
  init-db.ts              # Crée le schéma SQL
middleware.ts             # Protège toutes les routes sauf /login
archive/                  # Ancien fichier monolithique pour référence
```

## Sécurité

- Single-user : un seul mot de passe (`APP_PASSWORD`).
- JWT signé HS256 stocké en cookie httpOnly, SameSite=Lax, durée 60 jours.
- Toutes les routes (sauf `/login` et `/api/auth/login`) sont protégées par middleware.
- Pas d'inscription publique. Pour ajouter un 2e user, il faudrait étendre le schéma.

## Tech debt / améliorations futures

- Photos de progression (upload S3 ou Vercel Blob)
- Mensurations (taille/bras/cuisses) - schéma simple à ajouter
- Notifications push sur jour de séance manqué (Vercel Cron)
- Mode hors-ligne avec service worker (PWA installable mais pas offline)
