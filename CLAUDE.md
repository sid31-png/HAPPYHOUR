# HAPPY HOUR — Dossier de démarrage Claude Code
## App mobile + Site web · Tout ce qu'il faut pour commencer

> **Comment utiliser ce fichier** : crée un dossier `happyhour/`, copie ce fichier dedans sous le nom `CLAUDE.md`, ouvre Claude Code dans ce dossier, et lance les prompts de la section 9 dans l'ordre. Claude Code lira automatiquement ce fichier et connaîtra tout le projet.

---

# 1. VISION DU PRODUIT

Happy Hour est une app de découverte et de réservation de lieux et d'événements (bars, cafés, rooftops, concerts, expériences) lancée à Doha, Qatar.

**Tagline** : Find your next happy hour — from cafés and bars to events and live experiences.

**Différenciateur clé** : les happy hours EN DIRECT — l'app montre en temps réel les offres en cours près de l'utilisateur avec un compte à rebours ("Se termine dans 42 min"). Personne ne fait ça bien.

**Marché** : Doha d'abord (expats + jeunes actifs, forte culture after-work), puis Golfe (Dubaï, Riyadh).

---

# 2. MODÈLE ÉCONOMIQUE (3 couches)

| Couche | Quoi | Revenu | Quand |
|---|---|---|---|
| 1. Découverte | Carte + flux des lieux et événements, happy hours en direct | Gratuit (acquisition) | MVP |
| 2. Réservation | Tables, billets, expériences réservables dans l'app | Commission 8-12 % | Phase 2 |
| 3. Club | Abonnement (~40 QAR/mois) : 1 drink offert/semaine, réductions, accès prioritaire | Récurrent | Phase 3 (après 30-50 partenaires) |

Boucle de données : chaque réservation améliore les recommandations → plus de réservations → à terme, création de nos propres événements (modèle Fever).

---

# 3. PÉRIMÈTRE

## 3.1 App mobile (iOS + Android) — le produit principal
**MVP (Phase 1)** :
- Onboarding (localisation, préférences : bars / cafés / événements / expériences)
- Écran Explorer : happy hours en cours (avec compte à rebours), lieux recommandés, événements ce soir
- Écran Carte : lieux autour de moi avec badges "en direct"
- Page détail d'un lieu : photos, offre happy hour, horaires, localisation, favoris
- Auth (email + Google + Apple)
- Favoris

**Phase 2** : réservations (tables + billets), paiement, écran Résas
**Phase 3** : Club (abonnement), portail partenaires (les lieux gèrent leurs offres)

## 3.2 Site web — 2 rôles
1. **Landing marketing** (happyhour.app) : présentation, screenshots, liste d'attente email, section partenaires "Ajoutez votre établissement"
2. **Web app** (plus tard) : version navigateur de l'app + dashboard partenaires

---

# 4. STACK TECHNIQUE

Monorepo unique pour tout partager (types, logique, design tokens) :

```
happyhour/
├── CLAUDE.md                  ← ce fichier
├── apps/
│   ├── mobile/                ← Expo (React Native) — iOS + Android
│   └── web/                   ← Next.js — landing + future web app
├── packages/
│   ├── ui/                    ← design tokens + composants partagés
│   ├── types/                 ← types TypeScript partagés (Venue, Event, Booking…)
│   └── api/                   ← client Supabase + requêtes partagées
├── supabase/                  ← migrations SQL, seed data, edge functions
├── package.json               ← workspaces
└── turbo.json
```

**Choix techniques** :
- **Mobile** : Expo (React Native) + Expo Router + TypeScript. Un seul code pour iOS et Android.
- **Web** : Next.js 14+ (App Router) + Tailwind CSS + TypeScript.
- **Backend** : Supabase (Postgres + Auth + Storage + Realtime). Le Realtime est parfait pour les comptes à rebours des happy hours en direct.
- **Cartes** : react-native-maps (mobile), Mapbox ou Google Maps (web).
- **Paiement (Phase 2)** : Stripe.
- **Monorepo** : npm workspaces + Turborepo.

---

# 5. MODÈLE DE DONNÉES (Supabase / Postgres)

```sql
-- Utilisateurs (étend auth.users de Supabase)
profiles (
  id uuid PK references auth.users,
  display_name text,
  avatar_url text,
  preferences text[],          -- ['bars','cafes','events','experiences']
  club_member boolean default false,
  created_at timestamptz
)

-- Lieux
venues (
  id uuid PK,
  name text,
  slug text unique,
  category text,               -- 'bar' | 'cafe' | 'rooftop' | 'restaurant'
  description text,
  address text,
  lat double precision,
  lng double precision,
  photos text[],
  price_level int,             -- 1 à 4
  rating numeric,
  is_partner boolean default false,
  created_at timestamptz
)

-- Happy hours (le cœur de l'app)
happy_hours (
  id uuid PK,
  venue_id uuid FK -> venues,
  title text,                  -- "-50% cocktails"
  description text,
  days_of_week int[],          -- [1..7]
  start_time time,
  end_time time,
  is_active boolean default true
)
-- "En cours" = calculé : jour courant ∈ days_of_week ET start_time <= now() <= end_time

-- Événements
events (
  id uuid PK,
  venue_id uuid FK -> venues,
  title text,
  description text,
  category text,               -- 'live_music' | 'party' | 'experience' | 'other'
  starts_at timestamptz,
  ends_at timestamptz,
  price_from numeric,          -- en QAR
  capacity int,
  photos text[]
)

-- Favoris
favorites (
  user_id uuid FK -> profiles,
  venue_id uuid FK -> venues,
  created_at timestamptz,
  PK (user_id, venue_id)
)

-- Réservations (Phase 2)
bookings (
  id uuid PK,
  user_id uuid FK -> profiles,
  venue_id uuid FK -> venues,
  event_id uuid FK -> events NULL,   -- null = réservation de table
  booking_type text,            -- 'table' | 'ticket'
  party_size int,
  scheduled_at timestamptz,
  status text,                  -- 'pending' | 'confirmed' | 'cancelled' | 'completed'
  amount numeric,
  commission numeric,
  created_at timestamptz
)

-- Abonnements Club (Phase 3)
subscriptions (
  id uuid PK,
  user_id uuid FK -> profiles,
  stripe_subscription_id text,
  status text,
  current_period_end timestamptz
)
```

Activer RLS (Row Level Security) sur toutes les tables. Seed : 15-20 lieux fictifs de Doha (West Bay, The Pearl, Msheireb, Katara) avec happy hours variés pour le développement.

---

# 6. DESIGN SYSTEM — "GOLDEN HOUR"

Concept : l'interface est un ciel de golden hour. Toutes les surfaces sont des panneaux de verre translucide (Apple liquid glass) qui laissent passer la lumière dorée. Doré, premium, vivant. Jamais de néon, jamais de blanc/noir pur, jamais de gris froid.

## Ciels (fond des écrans, dégradés verticaux)
- **Light (fin d'après-midi)** : `#FDEBD2 → #FBD9A8 → #F6B26B → #EE8C4E → #E2703F`
- **Dark (crépuscule)** : `#1A1030 → #33184A → #7A2E4A → #C25A2E → #E8842F`
- Halo solaire radial : blanc chaud → ambre → transparent. Haut (26 %) en light, bas (42 %) en dark.

## Couleurs
| Token | Hex |
|---|---|
| gold | #F5A623 |
| goldDeep | #E07B1F |
| sunset | #E8642E |
| amberLight | #FFC864 |
| burgundy (accent secondaire, 1 usage max/écran) | #8E2157 |
| textLight (mode light) | #3A2110 |
| textDark (mode dark) | #FFF6E8 |
| liveGreen (point "en direct") | #6EF09A |

CTA : `linear-gradient(135deg, #FFAE3D, #E8642E)` + ombre `rgba(232,100,46,0.5)`. Un seul CTA plein par écran.

## Verre (toutes les surfaces : cartes, recherche, dock)
- Light : `background rgba(255,251,244,0.42); border 1px solid rgba(255,255,255,0.65); backdrop-filter blur(26px) saturate(170%); inset 0 1px 0 rgba(255,255,255,0.85)`
- Dark : `background rgba(255,240,220,0.08); border 1px solid rgba(255,220,180,0.18); même blur; inset 0 1px 0 rgba(255,230,190,0.16)`
- Radius : 24px cartes, 100px (pilule) pour recherche/dock/badges/boutons.
- Sur mobile (React Native) : utiliser expo-blur (BlurView) pour l'effet verre.

## Typographie
- Titres : **Alegreya Sans** (Google Fonts) 500/700/800 — équivalent libre de Jotia (Qatar Airways)
- Texte : **Hanken Grotesk** (Google Fonts) 400-700 — équivalent libre de Graphik
- Wordmark : `happyhour` minuscules, Alegreya Sans 800, "hour" en dégradé doré
- Tailles : wordmark 27, H2 19, titre carte 15, corps 14, méta 11.5, nav 10. Minimum absolu 10px.

## Composant signature : badge compte à rebours
Pilule de verre sur chaque vignette de lieu en happy hour : point vert pulsant (#6EF09A, 1.6s) + temps restant ("42 min"). Mis à jour en temps réel.

## Navigation mobile
Dock flottant en pilule de verre (détaché du bas, marge 22px), 4 onglets : **Explorer · Carte · Résas · Club**. Icônes outline 2px uniquement, jamais d'emoji. Onglet actif : accent doré + glow.

## Divers
- Langue UI : français. Devise : QAR.
- Transitions : cubic-bezier(0.22,1,0.36,1) ; respecter prefers-reduced-motion.
- Accessibilité : contraste AA, cibles 44px min, jamais d'info portée par la couleur seule.

---

# 7. SITE WEB (LANDING) — SPÉCIFICATION

Même design system Golden Hour. Sections dans l'ordre :
1. **Hero** : ciel golden hour plein écran avec soleil, wordmark, tagline, mockup du téléphone en perspective 3D, champ email "Rejoindre la liste d'attente"
2. **Le problème / la solution** : "Trouver où sortir ce soir ne devrait pas prendre 45 minutes"
3. **Fonctionnalités** : 3 cartes de verre — Happy hours en direct / Tout réserver en un tap / Le Club
4. **Comment ça marche** : 3 étapes
5. **Section partenaires** : "Vous gérez un bar, un café, un lieu ? Ajoutez votre établissement" + formulaire (nom, établissement, email, téléphone)
6. **Footer** : liens, réseaux, mention légale

Formulaires branchés sur Supabase (tables `waitlist` et `partner_leads`). SEO de base + Open Graph. Responsive mobile-first.

---

# 8. DÉMARRER AVEC CLAUDE CODE

1. Installer Node.js 18+ puis Claude Code :
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
2. Créer le projet et y placer ce fichier :
   ```bash
   mkdir happyhour && cd happyhour
   # copier ce fichier ici sous le nom CLAUDE.md
   claude
   ```
3. Claude Code lit `CLAUDE.md` automatiquement au démarrage — il connaîtra tout le contexte ci-dessus.
4. Lancer les prompts de la section 9, un par un, dans l'ordre. Vérifier/tester après chaque étape avant de passer à la suivante.

Docs officielles : https://docs.claude.com/en/docs/claude-code/overview

---

# 9. PROMPTS À LANCER DANS CLAUDE CODE (dans l'ordre)

## Prompt 1 — Fondations du monorepo
```
Initialise le monorepo décrit dans CLAUDE.md section 4 : npm workspaces + Turborepo,
apps/mobile (Expo + TypeScript + Expo Router), apps/web (Next.js App Router + Tailwind +
TypeScript), packages/ui, packages/types, packages/api. Crée packages/types avec tous les
types du modèle de données (section 5). Crée packages/ui avec les design tokens Golden Hour
(section 6) exportés pour React Native ET pour Tailwind (tailwind preset). Ajoute les
scripts dev/build/lint à la racine. Vérifie que `npm run dev` lance bien les deux apps.
```

## Prompt 2 — Backend Supabase
```
Configure Supabase : crée supabase/migrations avec tout le schéma SQL de la section 5
(profiles, venues, happy_hours, events, favorites, bookings, subscriptions + waitlist et
partner_leads pour le site web), avec RLS activé et policies de base (lecture publique des
venues/events/happy_hours, écriture réservée au propriétaire pour favorites/bookings).
Crée un script de seed avec 18 lieux fictifs réalistes à Doha (West Bay, The Pearl,
Msheireb, Katara) : mix de bars, cafés, rooftops, chacun avec des happy hours à horaires
variés, et 6 événements à venir. Crée packages/api avec le client Supabase typé et les
requêtes : getVenues, getVenuesNearby(lat,lng), getLiveHappyHours (en cours maintenant),
getUpcomingEvents, toggleFavorite.
```

## Prompt 3 — Site web (landing)
```
Construis la landing page dans apps/web en suivant exactement la spécification de la
section 7 et le design system Golden Hour de la section 6 : fond ciel dégradé + halo
solaire, panneaux liquid glass (backdrop-blur), polices Alegreya Sans + Hanken Grotesk
via next/font, wordmark happyhour, mockup téléphone en perspective 3D dans le hero,
formulaires waitlist et partenaires branchés sur Supabase, dark mode automatique
(prefers-color-scheme : ciel crépuscule), responsive mobile-first, SEO + Open Graph.
Texte en français.
```

## Prompt 4 — App mobile : structure + Explorer
```
Dans apps/mobile, mets en place Expo Router avec le dock de navigation en pilule de verre
(expo-blur) : Explorer, Carte, Résas, Club. Charge les polices Alegreya Sans et Hanken
Grotesk (expo-font). Construis l'écran Explorer complet selon le design system : fond ciel
golden hour (dégradé + halo, light/dark selon le thème système), header wordmark +
localisation, barre de recherche en verre, section "En cours près de vous" (cartes
horizontales avec badge compte à rebours en temps réel : point vert pulsant + minutes
restantes, calculées depuis happy_hours), section "Ce soir" (événements). Données via
packages/api. Les écrans Carte/Résas/Club peuvent être des placeholders stylés.
```

## Prompt 5 — App mobile : Carte + détail lieu
```
Construis l'écran Carte (react-native-maps) : marqueurs des lieux autour de la position de
l'utilisateur, badge doré "en direct" sur les lieux en happy hour, bottom sheet en verre au
tap sur un marqueur (nom, offre, distance, bouton Voir). Construis la page détail d'un
lieu : header photo avec dégradé, badge compte à rebours si happy hour en cours, infos
(catégorie, prix, note, adresse), description, horaires des happy hours de la semaine,
bouton favori (cœur), mini-carte, CTA "Réserver" (placeholder pour la Phase 2).
```

## Prompt 6 — Auth + favoris
```
Ajoute l'authentification Supabase dans l'app mobile : écrans onboarding (3 slides golden
hour : découvrir / réserver / le Club), connexion et inscription par email + Sign in with
Apple + Google, création du profile avec preferences au premier login. Protège les favoris
derrière l'auth, synchronise-les avec Supabase, ajoute un écran profil simple (avatar, nom,
préférences, déconnexion) accessible depuis le header.
```

## Prompt 7 — Finitions Phase 1
```
Passe de qualité sur tout le MVP : états vides et loading (skeletons en verre), gestion
d'erreurs réseau, pull-to-refresh, animations d'entrée des cartes (fade + translateY,
respecter prefers-reduced-motion), audit accessibilité (contrastes AA, labels, cibles
44px), audit visuel contre la section 6 (aucun blanc pur, aucun gris froid, un seul CTA
plein par écran), README avec instructions de lancement, et vérifie que web + mobile
buildent sans erreur.
```

**Phase 2 (plus tard)** : réservations + Stripe. **Phase 3** : abonnement Club + portail partenaires. Me redemander les prompts détaillés à ce moment-là.

---

# 10. RÈGLES POUR CLAUDE CODE

- TypeScript strict partout. Pas de `any`.
- Tous les textes UI en français, devise QAR.
- Toujours utiliser les design tokens de packages/ui — jamais de couleurs en dur dans les écrans.
- Respecter le design system section 6 à la lettre : c'est l'identité du produit.
- Commits atomiques avec messages clairs à chaque étape terminée.
- Ne jamais commiter de clés/secrets : utiliser .env + .env.example.
