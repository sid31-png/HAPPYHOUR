-- Mécaniques signature (CLAUDE.md section 4) : déblocage d'offre, compteur d'économies,
-- vérification communautaire, mode groupe, passeport.

create table offers (
  id uuid primary key default uuid_generate_v4(),
  venue_id uuid not null references venues (id) on delete cascade,
  happy_hour_id uuid references happy_hours (id) on delete set null,
  title text not null,
  description text,
  discount_label text not null,
  is_exclusive boolean not null default true,
  estimated_saving numeric not null default 0,
  status text not null default 'active' check (status in ('active', 'to_verify', 'paused')),
  last_verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index offers_venue_id_idx on offers (venue_id);
create index offers_happy_hour_id_idx on offers (happy_hour_id);

create table offer_redemptions (
  id uuid primary key default uuid_generate_v4(),
  offer_id uuid not null references offers (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  code text not null,
  qr_payload text not null,
  activated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  saving_amount numeric not null default 0
);

create index offer_redemptions_offer_id_idx on offer_redemptions (offer_id);
create index offer_redemptions_user_id_idx on offer_redemptions (user_id);

create table offer_reports (
  id uuid primary key default uuid_generate_v4(),
  offer_id uuid not null references offers (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  vote text not null check (vote in ('up', 'down')),
  photo_url text,
  comment text,
  created_at timestamptz not null default now()
);

create index offer_reports_offer_id_idx on offer_reports (offer_id);
create index offer_reports_created_at_idx on offer_reports (created_at);

create table group_plans (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references profiles (id) on delete cascade,
  share_slug text not null unique,
  party_size int not null default 2,
  budget_level int not null default 2 check (budget_level between 1 and 4),
  area text,
  suggested_venue_ids uuid[] not null default '{}',
  status text not null default 'open' check (status in ('open', 'decided', 'cancelled')),
  created_at timestamptz not null default now()
);

create table plan_votes (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references group_plans (id) on delete cascade,
  venue_id uuid not null references venues (id) on delete cascade,
  voter_name text not null,
  created_at timestamptz not null default now()
);

create index plan_votes_plan_id_idx on plan_votes (plan_id);

create table check_ins (
  user_id uuid not null references profiles (id) on delete cascade,
  venue_id uuid not null references venues (id) on delete cascade,
  redemption_id uuid references offer_redemptions (id) on delete set null,
  district text,
  created_at timestamptz not null default now(),
  primary key (user_id, venue_id, created_at)
);

-- RLS

alter table offers enable row level security;
alter table offer_redemptions enable row level security;
alter table offer_reports enable row level security;
alter table group_plans enable row level security;
alter table plan_votes enable row level security;
alter table check_ins enable row level security;

create policy "offers_public_read" on offers for select using (true);

create policy "offer_redemptions_select_own" on offer_redemptions for select using (auth.uid() = user_id);
create policy "offer_redemptions_insert_own" on offer_redemptions for insert with check (auth.uid() = user_id);

create policy "offer_reports_select_own" on offer_reports for select using (auth.uid() = user_id);
create policy "offer_reports_insert_own" on offer_reports for insert with check (auth.uid() = user_id);

-- group_plans est lu via un slug non devinable par des invités sans compte (page de vote
-- publique) : lecture publique, écriture réservée au créateur.
create policy "group_plans_public_read" on group_plans for select using (true);
create policy "group_plans_insert_own" on group_plans for insert with check (auth.uid() = creator_id);

-- plan_votes : vote public sans compte depuis la page de partage.
create policy "plan_votes_public_read" on plan_votes for select using (true);
create policy "plan_votes_public_insert" on plan_votes for insert with check (true);

create policy "check_ins_select_own" on check_ins for select using (auth.uid() = user_id);
create policy "check_ins_insert_own" on check_ins for insert with check (auth.uid() = user_id);

-- Vérification communautaire (mécaniques 5 et 6) : insère le vote puis fait basculer le
-- statut de l'offre selon les seuils définis en section 4 du CLAUDE.md. SECURITY DEFINER
-- car l'utilisateur n'a pas de policy d'écriture directe sur `offers`.
create function public.submit_offer_report(
  p_offer_id uuid,
  p_user_id uuid,
  p_vote text,
  p_photo_url text default null,
  p_comment text default null
)
returns void as $$
declare
  down_count int;
  up_count int;
begin
  insert into offer_reports (offer_id, user_id, vote, photo_url, comment)
  values (p_offer_id, p_user_id, p_vote, p_photo_url, p_comment);

  if p_vote = 'down' then
    select count(*) into down_count
    from offer_reports
    where offer_id = p_offer_id
      and vote = 'down'
      and created_at >= now() - interval '24 hours';

    if down_count >= 3 then
      update offers set status = 'to_verify' where id = p_offer_id;
    end if;
  elsif p_vote = 'up' then
    select count(*) into up_count
    from offer_reports
    where offer_id = p_offer_id
      and vote = 'up'
      and created_at >= now() - interval '7 days';

    if up_count >= 3 then
      update offers set last_verified_at = now(), status = 'active' where id = p_offer_id;
    end if;
  end if;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.submit_offer_report(uuid, uuid, text, text, text) to authenticated;
