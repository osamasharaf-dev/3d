-- =============================================
-- Portfolio CMS — Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Projects table
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  tags         jsonb default '[]',
  image_url    text,
  images       jsonb default '[]',
  source_code_link text,
  live_demo_link   text,
  features     jsonb default '[]',
  order_index  integer default 0,
  created_at   timestamptz default now()
);

-- Skills table
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  icon       text,
  category   text check (category in ('Frontend','Backend','Database','Tools')) default 'Frontend',
  created_at timestamptz default now()
);

-- =============================================
-- Row Level Security
-- =============================================

-- Enable RLS on both tables
alter table public.projects enable row level security;
alter table public.skills   enable row level security;

-- Public can READ projects and skills
create policy "Public read projects"
  on public.projects for select
  using (true);

create policy "Public read skills"
  on public.skills for select
  using (true);

-- Only authenticated admin can INSERT / UPDATE / DELETE
create policy "Admin insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "Admin update projects"
  on public.projects for update
  to authenticated
  using (true);

create policy "Admin delete projects"
  on public.projects for delete
  to authenticated
  using (true);

create policy "Admin insert skills"
  on public.skills for insert
  to authenticated
  with check (true);

create policy "Admin delete skills"
  on public.skills for delete
  to authenticated
  using (true);

-- =============================================
-- Storage Bucket for project images
-- =============================================
-- Run this or create manually in Supabase Dashboard → Storage
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "Public read project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Admin upload project-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "Admin delete project-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');
