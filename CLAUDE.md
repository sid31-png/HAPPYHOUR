# HAPPY HOUR — Dossier de démarrage Claude Code
## App mobile + Site web · Tout ce qu'il faut pour commencer

> **Comment utiliser ce fichier** : crée un dossier `happyhour/`, copie ce fichier dedans sous le nom `CLAUDE.md`, ouvre Claude Code dans ce dossier, et lance les prompts de la section 10 dans l'ordre. Claude Code lira automatiquement ce fichier et connaîtra tout le projet.

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
2. **Web app** (plus tard) : version navigateur de l'app + dashboard partenaires + pages publiques de vote "On va où ?" (section 4, mécanique 9)

---

# 4. MÉCANIQUES SIGNATURE

Réponse produit à la question : pourquoi venir sur Happy Hour plutôt que rester sur Instagram, Google Maps, WhatsApp ou Snoonu ? Chaque mécanique doit créer une raison concrète d'ouvrir l'app plutôt qu'un autre canal.

## Phase 1 — MVP

1. **Déblocage d'offre in-app** : chaque offre exclusive s'active via un bouton "Utiliser l'offre" qui génère un code court + QR avec un timer de validité de 15 minutes, à montrer/scanner au serveur. L'offre n'est jamais utilisable sans passer par l'app. Chaque activation est enregistrée (traçabilité pour les lieux partenaires).
2. **Compteur d'économies** : total des QAR économisés (mois + cumul) calculé depuis les offres utilisées, affiché dans le profil et sur l'écran d'accueil ("Tu as économisé 340 QAR ce mois-ci").
3. **Section "Dernière chance"** : dans Explorer, rangée dédiée aux offres qui se terminent dans moins de 60 minutes, triées par fin la plus proche.
4. **Règle des 3 taps** *(contrainte de design, voir section 7)* : parcours offre → réservation en 3 taps maximum, aucun formulaire, nombre de personnes en slider, horaire pré-rempli sur "maintenant" / "+1h".
5. **Vérification communautaire** : sur chaque offre en cours, micro-action "C'est bien actif ? 👍/👎" sans quitter l'écran. 3 signalements négatifs en 24h → statut `to_verify` + notification au partenaire.
6. **Badge "Vérifié cette semaine"** : affiché sur les lieux dont l'offre a été confirmée dans les 7 derniers jours (par le partenaire ou par ≥3 confirmations communautaires).

## Phase 2

7. **Rituel de 17h** : notification quotidienne intelligente entre 17h et 17h30 résumant ce qui est disponible ce soir près de l'utilisateur. Fréquence auto-adaptative : si l'utilisateur n'ouvre pas 3 notifications de suite, espacer (1 jour sur 2, puis hebdomadaire). Jamais de spam.
8. **Radar géofencé** : géofences sur les lieux partenaires ; si l'utilisateur entre dans un rayon de 400 m d'un lieu dont la happy hour commence dans ≤20 min ou est en cours → push contextuel. Max 2 pushs radar par jour.
9. **Mode groupe "On va où ?"** : créer un plan (taille du groupe, budget, zone), l'app propose 3 lieux, partage d'un lien web votable **sans installer l'app** (page Next.js publique dans apps/web), vote en un tap, le créateur réserve. Chaque page de vote a un CTA d'installation.
10. **Garantie Happy Hour** : si une offre affichée est refusée sur place, signalement avec photo → crédit automatique (offre de compensation chez un partenaire). Workflow de modération simple dans le back-office.

## Phase 3

11. **Passeport & récap** : check-in automatique à chaque offre utilisée ; badges par quartier (5 lieux à The Pearl = badge + récompense partenaire) ; récap mensuel partageable façon Spotify Wrapped (lieux, économies, quartier favori) généré en image.

---

# 5. STACK TECHNIQUE

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
- **QR codes** : react-native-qrcode-svg (déblocage d'offre, mécanique 1).
- **Paiement (Phase 2)** : Stripe.
- **Monorepo** : npm workspaces + Turborepo.

---

# 6. MODÈLE DE DONNÉES (Supabase / Postgres)

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

-- Offres exclusives déblocables in-app (mécanique 1)
offers (
  id uuid PK,
  venue_id uuid FK -> venues,
  happy_hour_id uuid FK -> happy_hours NULL,
  title text,
  description text,
  discount_label text,          -- "-50% cocktails"
  is_exclusive boolean default true,
  estimated_saving numeric,     -- QAR économisés par utilisation (alimente le compteur)
  status text default 'active', -- 'active' | 'to_verify' | 'paused'
  last_verified_at timestamptz  -- bascule le badge "Vérifié cette semaine" (mécanique 6)
)

-- Activations d'offre : code + QR + fenêtre de validité de 15 min (mécanique 1)
offer_redemptions (
  id uuid PK,
  offer_id uuid FK -> offers,
  user_id uuid FK -> profiles,
  code text,
  qr_payload text,
  activated_at timestamptz,
  expires_at timestamptz,       -- activated_at + 15 min
  redeemed_at timestamptz NULL,
  saving_amount numeric         -- copié depuis offers.estimated_saving à l'activation
)

-- Votes communautaires 👍/👎 sur une offre en cours (mécaniques 5 et 6)
offer_reports (
  id uuid PK,
  offer_id uuid FK -> offers,
  user_id uuid FK -> profiles,
  vote text,                    -- 'up' | 'down'
  photo_url text NULL,
  comment text NULL,
  created_at timestamptz
)

-- Plans de groupe "On va où ?" (mécanique 9, Phase 2)
group_plans (
  id uuid PK,
  creator_id uuid FK -> profiles,
  share_slug text unique,       -- utilisé par la page de vote publique sans compte
  party_size int,
  budget_level int,
  area text,
  suggested_venue_ids uuid[],
  status text,
  created_at timestamptz
)

-- Votes sur un plan de groupe, sans compte (mécanique 9, Phase 2)
plan_votes (
  id uuid PK,
  plan_id uuid FK -> group_plans,
  venue_id uuid FK -> venues,
  voter_name text,
  created_at timestamptz
)

-- Passeport : check-in à chaque offre utilisée (mécanique 11, Phase 3)
check_ins (
  user_id uuid FK -> profiles,
  venue_id uuid FK -> venues,
  redemption_id uuid FK -> offer_redemptions,
  district text,
  created_at timestamptz,
  PK (user_id, venue_id, created_at)
)
```

Activer RLS (Row Level Security) sur toutes les tables. Seed : 15-20 lieux fictifs de Doha (West Bay, The Pearl, Msheireb, Katara) avec happy hours variés pour le développement, plus une offre réaliste par happy hour (estimated_saving entre 30 et 120 QAR).

---

# 7. DESIGN SYSTEM

Interface claire (blanc pur en mode clair, noir pur en mode sombre) avec des surfaces en verre dépoli (glassmorphism, façon Apple) et une typographie système (SF Pro sur iOS/Safari, Roboto sur Android). Une seule couleur d'accent (doré), utilisée avec parcimonie ; le vert "en direct" est un signal sémantique, pas une couleur de marque.

## Fonds d'écran
- **Light** : blanc pur `#FFFFFF`.
- **Dark** : noir pur `#000000`.
- Aucun dégradé de fond, aucun halo décoratif — le fond est plat, la hiérarchie vient de la typographie et des surfaces en verre.

## Couleurs
| Token | Hex |
|---|---|
| gold (accent unique) | #F5A623 |
| goldDeep | #E07B1F |
| sunset | #E8642E |
| amberLight | #FFC864 |
| burgundy (accent secondaire, 1 usage max/écran) | #8E2157 |
| textLight (mode light) | #1D1D1F |
| textDark (mode dark) | #F5F5F7 |
| liveGreen (point "en direct", sémantique) | #6EF09A |

CTA : `linear-gradient(135deg, #FFAE3D, #E8642E)` + ombre `rgba(232,100,46,0.5)`. Un seul CTA plein par écran.

## Verre (toutes les surfaces : cartes, recherche, dock)
- Light : `background rgba(255,255,255,0.6); border 1px solid rgba(0,0,0,0.08); backdrop-filter blur(26px) saturate(170%); inset 0 1px 0 rgba(255,255,255,0.9)`
- Dark : `background rgba(255,255,255,0.08); border 1px solid rgba(255,255,255,0.14); même blur; inset 0 1px 0 rgba(255,255,255,0.1)`
- Radius : 24px cartes, 100px (pilule) pour recherche/dock/badges/boutons.
- Sur mobile (React Native) : utiliser expo-blur (BlurView) pour l'effet verre.

## Typographie
- Police système uniquement : `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif` sur le web ; `undefined`/`"System"` en React Native (rend SF Pro sur iOS nativement, sans chargement de police).
- Wordmark : `happyhour` minuscules, poids 800, "hour" en dégradé doré.
- Tailles : wordmark 27, H2 19, titre carte 15, corps 14, méta 11.5, nav 10. Minimum absolu 10px.

## Composant signature : badge compte à rebours
Pilule de verre sur chaque vignette de lieu en happy hour : point vert pulsant (#6EF09A, 1.6s) + temps restant ("42 min"). Mis à jour en temps réel.

## Navigation mobile
Dock flottant en pilule de verre (détaché du bas, marge 22px), 4 onglets : **Explorer · Carte · Résas · Club**. Icônes outline 2px uniquement, jamais d'emoji. Onglet actif : accent doré + glow.

## Règle des 3 taps (contrainte de design, mécanique 4)
Tout parcours qui mène à une action de réservation ou d'activation doit tenir en 3 taps maximum depuis la carte d'offre :
1. Tap sur l'offre → détail ou sheet d'activation.
2. Réglage rapide si nécessaire (slider nombre de personnes, choix "maintenant" / "+1h" pré-rempli — jamais de formulaire libre).
3. Tap de confirmation → code/QR généré ou réservation créée.
Aucun écran intermédiaire, aucun champ texte obligatoire dans ce parcours.

## Divers
- Langue UI : français. Devise : QAR.
- Transitions : cubic-bezier(0.22,1,0.36,1) ; respecter prefers-reduced-motion.
- Accessibilité : contraste AA, cibles 44px min, jamais d'info portée par la couleur seule.

---

# 8. SITE WEB (LANDING) — SPÉCIFICATION

Même design system (section 7). Sections dans l'ordre :
1. **Hero** : fond blanc/noir plein écran, wordmark, tagline, mockup du téléphone en perspective 3D, champ email "Rejoindre la liste d'attente"
2. **Le problème / la solution** : "Trouver où sortir ce soir ne devrait pas prendre 45 minutes"
3. **Fonctionnalités** : 3 cartes de verre — Happy hours en direct / Tout réserver en un tap / Le Club
4. **Comment ça marche** : 3 étapes
5. **Section partenaires** : "Vous gérez un bar, un café, un lieu ? Ajoutez votre établissement" + formulaire (nom, établissement, email, téléphone)
6. **Footer** : liens, réseaux, mention légale

Formulaires branchés sur Supabase (tables `waitlist` et `partner_leads`). SEO de base + Open Graph. Responsive mobile-first.

---

# 9. DÉMARRER AVEC CLAUDE CODE

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
4. Lancer les prompts de la section 10, un par un, dans l'ordre. Vérifier/tester après chaque étape avant de passer à la suivante.

Docs officielles : https://docs.claude.com/en/docs/claude-code/overview

---

# 10. PROMPTS À LANCER DANS CLAUDE CODE (dans l'ordre)

## Prompt 1 — Fondations du monorepo
```
Initialise le monorepo décrit dans CLAUDE.md section 5 : npm workspaces + Turborepo,
apps/mobile (Expo + TypeScript + Expo Router), apps/web (Next.js App Router + Tailwind +
TypeScript), packages/ui, packages/types, packages/api. Crée packages/types avec tous les
types du modèle de données (section 6). Crée packages/ui avec les design tokens
(section 7) exportés pour React Native ET pour Tailwind (tailwind preset). Ajoute les
scripts dev/build/lint à la racine. Vérifie que `npm run dev` lance bien les deux apps.
```

## Prompt 2 — Backend Supabase
```
Configure Supabase : crée supabase/migrations avec tout le schéma SQL de la section 6
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
section 8 et le design system de la section 7 : fond blanc/noir, panneaux liquid glass
(backdrop-blur), police système via la pile -apple-system, wordmark happyhour, mockup
téléphone en perspective 3D dans le hero,
formulaires waitlist et partenaires branchés sur Supabase, dark mode automatique
(prefers-color-scheme : ciel crépuscule), responsive mobile-first, SEO + Open Graph.
Texte en français.
```

## Prompt 4 — App mobile : structure + Explorer
```
Dans apps/mobile, mets en place Expo Router avec le dock de navigation en pilule de verre
(expo-blur) : Explorer, Carte, Résas, Club. Charge les polices Alegreya Sans et Hanken
Grotesk (expo-font). Construis l'écran Explorer complet selon le design system : fond ciel
plat blanc/noir selon le thème système, header wordmark +
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
44px), audit visuel contre la section 7 (police système partout, un seul CTA doré
plein par écran, jamais deux couleurs d'accent sur un même écran), README avec
instructions de lancement, et vérifie que web + mobile
buildent sans erreur.
```

**Phase 2 (plus tard)** : réservations + Stripe. **Phase 3** : abonnement Club + portail partenaires. Me redemander les prompts détaillés à ce moment-là.

---

# 11. RÈGLES POUR CLAUDE CODE

- TypeScript strict partout. Pas de `any`.
- Tous les textes UI en français, devise QAR.
- Toujours utiliser les design tokens de packages/ui — jamais de couleurs en dur dans les écrans.
- Respecter le design system section 7 à la lettre : c'est l'identité du produit.
- Commits atomiques avec messages clairs à chaque étape terminée.
- Ne jamais commiter de clés/secrets : utiliser .env + .env.example.
