# Happy Hour

App mobile + site web de découverte des happy hours et événements à Doha, Qatar. Voir `CLAUDE.md` pour la spécification complète du produit et du design system "Golden Hour".

## Structure du monorepo

```
happyhour/
├── apps/
│   ├── mobile/     Expo (React Native) + Expo Router — iOS + Android
│   └── web/        Next.js App Router — landing page marketing
├── packages/
│   ├── ui/         Design tokens Golden Hour (RN + Tailwind preset)
│   ├── types/      Types TypeScript partagés (Venue, HappyHour, Event…)
│   └── api/        Client Supabase typé + requêtes partagées
└── supabase/       Migrations SQL, policies RLS, seed de 18 lieux à Doha
```

## Prérequis

- Node.js 18+
- Un projet Supabase (gratuit) pour l'auth, la base de données et le temps réel

## Installation

```bash
npm install
```

## Configuration

Copiez `.env.example` en `.env` dans `apps/web` et `apps/mobile`, puis renseignez les clés de votre projet Supabase :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

Sans ces variables, les deux apps se lancent normalement mais affichent un état "Supabase non configuré" à la place des données.

## Base de données

Avec la [CLI Supabase](https://supabase.com/docs/guides/cli) :

```bash
supabase link --project-ref <votre-projet>
supabase db push          # applique supabase/migrations
psql < supabase/seed.sql   # ou "supabase db reset" en local, qui charge le seed automatiquement
```

## Développement

```bash
npm run dev          # lance le site web et l'app mobile en parallèle (Turborepo)
npm run dev:web       # site web seul → http://localhost:3000
npm run dev:mobile    # app mobile seule → Expo Go / simulateur
```

## Build & vérifications

```bash
npm run build        # build de production du site web
npm run typecheck     # vérifie tous les packages et apps en TypeScript strict
```

## Statut des fonctionnalités (Phase 1 — MVP)

- ✅ Site web : hero, problème/solution, fonctionnalités, comment ça marche, formulaire partenaires, liste d'attente
- ✅ App mobile : Explorer (happy hours en direct + événements), Carte, détail lieu, onboarding, auth email + Apple, favoris, profil
- ⏳ Réservations (tables/billets) — Phase 2
- ⏳ Abonnement Club + portail partenaires — Phase 3

## Notes techniques

- Google Sign-In sur mobile nécessite un client OAuth configuré côté Supabase Auth ; le bouton est présent mais non branché tant que ces identifiants ne sont pas fournis.
- Sign in with Apple nécessite un provider Apple configuré côté Supabase Auth pour fonctionner en production.
