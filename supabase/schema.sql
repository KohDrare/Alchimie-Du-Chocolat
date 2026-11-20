-- =====================================================================
--  L'alchimie du chocolat — comptes clients (Supabase)
--  À exécuter une fois dans Supabase > SQL Editor (en premier)
-- =====================================================================

create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text,
  phone       text,
  shop        text,        -- boutique habituelle : waterloo | ixelles
  updated_at  timestamptz default now()
);

create table if not exists public.orders (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  num         text not null,
  shop        text,
  when_label  text,
  total       numeric(10,2),
  items       jsonb not null,
  created_at  timestamptz default now()
);
create index if not exists orders_user_created on public.orders (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.orders   enable row level security;

drop policy if exists "profil perso" on public.profiles;
create policy "profil perso" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "commandes perso lecture" on public.orders;
create policy "commandes perso lecture" on public.orders for select using (auth.uid() = user_id);
drop policy if exists "commandes perso ajout" on public.orders;
create policy "commandes perso ajout" on public.orders for insert with check (auth.uid() = user_id);
drop policy if exists "commandes perso suppression" on public.orders;
create policy "commandes perso suppression" on public.orders for delete using (auth.uid() = user_id);
