-- Run this once in Supabase SQL Editor to enable Artist Profiles.
-- This creates only the artists table and its access policies.
create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  photo_url text,
  created_at timestamptz default now()
);

alter table public.artists enable row level security;

drop policy if exists "Public can view artists" on public.artists;
create policy "Public can view artists"
on public.artists for select
to anon, authenticated
using (true);

drop policy if exists "Admin can insert artists" on public.artists;
create policy "Admin can insert artists"
on public.artists for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'rathodmitranshu@gmail.com');

drop policy if exists "Admin can update artists" on public.artists;
create policy "Admin can update artists"
on public.artists for update
to authenticated
using ((auth.jwt() ->> 'email') = 'rathodmitranshu@gmail.com')
with check ((auth.jwt() ->> 'email') = 'rathodmitranshu@gmail.com');

drop policy if exists "Admin can delete artists" on public.artists;
create policy "Admin can delete artists"
on public.artists for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'rathodmitranshu@gmail.com');

grant select on public.artists to anon, authenticated;
grant insert, update, delete on public.artists to authenticated;
