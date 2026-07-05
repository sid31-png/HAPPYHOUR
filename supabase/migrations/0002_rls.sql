-- Row Level Security : lecture publique du catalogue, écriture restreinte au propriétaire.

alter table profiles enable row level security;
alter table venues enable row level security;
alter table happy_hours enable row level security;
alter table events enable row level security;
alter table favorites enable row level security;
alter table bookings enable row level security;
alter table subscriptions enable row level security;
alter table waitlist enable row level security;
alter table partner_leads enable row level security;

-- profiles : chacun lit/modifie son propre profil
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

-- venues : lecture publique, écriture réservée au service role (back-office)
create policy "venues_public_read" on venues for select using (true);

-- happy_hours : lecture publique
create policy "happy_hours_public_read" on happy_hours for select using (true);

-- events : lecture publique
create policy "events_public_read" on events for select using (true);

-- favorites : uniquement le propriétaire
create policy "favorites_select_own" on favorites for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on favorites for delete using (auth.uid() = user_id);

-- bookings : uniquement le propriétaire
create policy "bookings_select_own" on bookings for select using (auth.uid() = user_id);
create policy "bookings_insert_own" on bookings for insert with check (auth.uid() = user_id);
create policy "bookings_update_own" on bookings for update using (auth.uid() = user_id);

-- subscriptions : uniquement le propriétaire (lecture seule côté client)
create policy "subscriptions_select_own" on subscriptions for select using (auth.uid() = user_id);

-- waitlist / partner_leads : écriture publique (formulaires du site), pas de lecture publique
create policy "waitlist_public_insert" on waitlist for insert with check (true);
create policy "partner_leads_public_insert" on partner_leads for insert with check (true);
