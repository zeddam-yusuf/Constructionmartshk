-- Construction Mart SHK — Supabase setup (standalone / client-side auth)
-- Run this once in your Supabase SQL editor.
--
-- The app reads/writes these tables directly from the browser using the anon key.
-- RLS policies below allow that (demo-grade; tighten for production).
-- Safe to re-run: all statements are idempotent.

-- Users table (JWT auth users)
create table if not exists public.auth_users (
  id text primary key,
  name text not null,
  phone text not null unique,
  role text not null,
  password_hash text not null,
  status text not null default 'active',
  email text,
  city text,
  company_name text,
  category text,
  experience text,
  charges text,
  gst_number text,
  created_at timestamptz default now()
);

-- Job listings table (managed by super admin)
create table if not exists public.jobs (
  id text primary key,
  title text,
  role text,
  location text,
  salary text,
  type text,
  description text,
  status text default 'Open',
  data jsonb,
  created_at timestamptz default now()
);

-- Bookings (instant labour / supplier)
create table if not exists public.bookings (
  id text primary key,
  booking_type text,
  status text,
  details jsonb,
  created_at timestamptz default now()
);

-- General submissions (unified store for all form/save actions)
create table if not exists public.submissions (
  id text primary key,
  type text,
  status text,
  data jsonb,
  created_at timestamptz default now()
);

-- Type-specific submission mirror tables
create table if not exists public.contacts (
  id text primary key,
  status text default 'Pending',
  data jsonb,
  created_at timestamptz default now()
);
create table if not exists public.registrations (
  id text primary key,
  status text default 'Pending',
  data jsonb,
  created_at timestamptz default now()
);
create table if not exists public.properties (
  id text primary key,
  status text default 'Pending',
  data jsonb,
  created_at timestamptz default now()
);
create table if not exists public.applications (
  id text primary key,
  status text default 'Pending',
  data jsonb,
  created_at timestamptz default now()
);
create table if not exists public.service_requests (
  id text primary key,
  status text default 'Pending',
  data jsonb,
  created_at timestamptz default now()
);

-- Row level security: allow anon + authenticated (browser) full access.
-- Works with both legacy anon JWT (eyJ...) and new publishable key (sb_publishable_...) and sb_secret.
alter table public.auth_users enable row level security;
alter table public.jobs enable row level security;
alter table public.bookings enable row level security;
alter table public.submissions enable row level security;
alter table public.contacts enable row level security;
alter table public.registrations enable row level security;
alter table public.properties enable row level security;
alter table public.applications enable row level security;
alter table public.service_requests enable row level security;

-- Recreate policies idempotently (drop if exists first, for older Postgres without IF NOT EXISTS)
do $$
declare t text;
begin
  foreach t in array array['auth_users','jobs','bookings','submissions','contacts','registrations','properties','applications','service_requests'] loop
    execute format('drop policy if exists "anon full access %1$s" on public.%1$I', t, t);
    execute format('create policy "anon full access %1$s" on public.%1$I for all to anon, authenticated using (true) with check (true)', t, t);
    -- Also allow publishable key (mapped to anon) and service_role explicitly
    execute format('drop policy if exists "public full access %1$s" on public.%1$I', t, t);
    execute format('create policy "public full access %1$s" on public.%1$I for all to public using (true) with check (true)', t, t);
  end loop;
end $$;

-- Optional: ensure tables are exposed via PostgREST (needed if created outside setup)
-- Run Supabase Dashboard > SQL Editor > paste this file > Run.