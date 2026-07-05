-- Happy Hour — schema initial (section 5 du CLAUDE.md)
create extension if not exists "uuid-ossp";

-- Profils utilisateurs (étend auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  preferences text[] not null default '{}',
  club_member boolean not null default false,
  created_at timestamptz not null default now()
);

-- Lieux
create table venues (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  category text not null check (category in ('bar', 'cafe', 'rooftop', 'restaurant')),
  description text,
  address text,
  lat double precision not null,
  lng double precision not null,
  photos text[] not null default '{}',
  price_level int not null default 2 check (price_level between 1 and 4),
  rating numeric(2, 1) check (rating between 0 and 5),
  is_partner boolean not null default false,
  created_at timestamptz not null default now()
);

create index venues_category_idx on venues (category);
create index venues_lat_lng_idx on venues (lat, lng);

-- Happy hours (le cœur de l'app)
create table happy_hours (
  id uuid primary key default uuid_generate_v4(),
  venue_id uuid not null references venues (id) on delete cascade,
  title text not null,
  description text,
  days_of_week int[] not null,
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true
);

create index happy_hours_venue_id_idx on happy_hours (venue_id);

-- Événements
create table events (
  id uuid primary key default uuid_generate_v4(),
  venue_id uuid not null references venues (id) on delete cascade,
  title text not null,
  description text,
  category text not null check (category in ('live_music', 'party', 'experience', 'other')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  price_from numeric,
  capacity int,
  photos text[] not null default '{}'
);

create index events_venue_id_idx on events (venue_id);
create index events_starts_at_idx on events (starts_at);

-- Favoris
create table favorites (
  user_id uuid not null references profiles (id) on delete cascade,
  venue_id uuid not null references venues (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, venue_id)
);

-- Réservations (Phase 2)
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  venue_id uuid not null references venues (id) on delete cascade,
  event_id uuid references events (id) on delete set null,
  booking_type text not null check (booking_type in ('table', 'ticket')),
  party_size int not null default 1,
  scheduled_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  amount numeric,
  commission numeric,
  created_at timestamptz not null default now()
);

create index bookings_user_id_idx on bookings (user_id);
create index bookings_venue_id_idx on bookings (venue_id);

-- Abonnements Club (Phase 3)
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  stripe_subscription_id text,
  status text not null default 'inactive',
  current_period_end timestamptz
);

create index subscriptions_user_id_idx on subscriptions (user_id);

-- Site web : liste d'attente
create table waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Site web : demandes de partenariat
create table partner_leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  venue_name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- Création automatique du profil au premier login
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
