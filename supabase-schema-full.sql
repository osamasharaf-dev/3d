-- =============================================
-- Full CMS Schema — Run in Supabase SQL Editor
-- =============================================

-- Hero Info (single row)
create table if not exists public.hero_info (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Osama Sharaf',
  greeting text not null default 'Hi, I''m',
  typed_items jsonb not null default '["Full-Stack Developer","Software Engineer","Web Architect","Problem Solver"]',
  subtitle text default 'Building modern digital solutions, scalable web applications, and high-performance digital experiences.',
  cta_primary text default 'View My Work',
  cta_secondary text default 'Get In Touch',
  updated_at timestamptz default now()
);

-- About Info (single row)
create table if not exists public.about_info (
  id uuid primary key default gen_random_uuid(),
  bio_paragraphs jsonb not null default '[]',
  services jsonb not null default '[]',
  hire_email text default '',
  resume_url text default '',
  updated_at timestamptz default now()
);

-- Certifications
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company_name text default '',
  date_range text default '',
  icon_url text default '',
  icon_bg text default '#383E56',
  points jsonb not null default '[]',
  credentials jsonb not null default '[]',
  order_index integer not null default 0,
  created_at timestamptz default now()
);

-- Professional Skills (soft skills)
create table if not exists public.professional_skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  icon text default '🔹',
  color text default '#8ec5ff',
  skills jsonb not null default '[]',
  order_index integer not null default 0,
  created_at timestamptz default now()
);

-- Contact Info (single row)
create table if not exists public.contact_info (
  id uuid primary key default gen_random_uuid(),
  email text default '',
  phone text default '',
  linkedin text default '',
  github text default '',
  facebook text default '',
  instagram text default '',
  whatsapp text default '',
  updated_at timestamptz default now()
);

-- ── Row Level Security ──────────────────────────────────────
alter table public.hero_info          enable row level security;
alter table public.about_info         enable row level security;
alter table public.certifications     enable row level security;
alter table public.professional_skills enable row level security;
alter table public.contact_info       enable row level security;

-- Public read all
create policy "Public read hero_info"           on public.hero_info           for select using (true);
create policy "Public read about_info"          on public.about_info          for select using (true);
create policy "Public read certifications"      on public.certifications      for select using (true);
create policy "Public read professional_skills" on public.professional_skills for select using (true);
create policy "Public read contact_info"        on public.contact_info        for select using (true);

-- Admin full access
create policy "Admin manage hero_info"           on public.hero_info           for all to authenticated using (true) with check (true);
create policy "Admin manage about_info"          on public.about_info          for all to authenticated using (true) with check (true);
create policy "Admin manage certifications"      on public.certifications      for all to authenticated using (true) with check (true);
create policy "Admin manage professional_skills" on public.professional_skills for all to authenticated using (true) with check (true);
create policy "Admin manage contact_info"        on public.contact_info        for all to authenticated using (true) with check (true);

-- ── Seed default data ───────────────────────────────────────
insert into public.hero_info (name, greeting, typed_items, subtitle, cta_primary, cta_secondary)
values (
  'Osama Sharaf', 'Hi, I''m',
  '["Full-Stack Developer","Software Engineer","Web Architect","Problem Solver"]',
  'Building modern digital solutions, scalable web applications, and high-performance digital experiences.',
  'View My Work', 'Get In Touch'
) on conflict do nothing;

insert into public.about_info (bio_paragraphs, services, hire_email, resume_url)
values (
  '["I am a Software Engineer and Full-Stack Web Developer passionate about building modern digital solutions, scalable web applications, and high-performance digital experiences.","With expertise spanning front-end development, back-end systems, databases, and cloud-based deployment, I transform ideas into reliable and impactful products that help businesses grow and succeed in the digital world.","My goal is not only to write code, but to create meaningful solutions that combine functionality, performance, and exceptional user experience."]',
  '[{"title":"Frontend Development","icon_name":"web"},{"title":"Backend Development","icon_name":"mobile"},{"title":"Database Management","icon_name":"backend"},{"title":"Cloud & DevOps","icon_name":"creator"}]',
  'osamaabdulhalimsharaf@gmail.com',
  ''
) on conflict do nothing;

insert into public.contact_info (email, phone, linkedin, github, facebook, instagram, whatsapp)
values (
  'osamaabdulhalimsharaf@gmail.com', '+963 935 562 470',
  'https://linkedin.com/in/osamasharaf',
  'https://github.com/osamasharaf',
  'https://facebook.com/osamasharaf',
  'https://instagram.com/osamasharaf',
  'https://wa.me/963935562470'
) on conflict do nothing;

insert into public.certifications (title, company_name, date_range, icon_bg, points, credentials, order_index) values
  ('Full-Stack Web Development','Self-Directed Learning','2023 — Present','#383E56',
   '["React.js & Next.js Advanced Patterns","Node.js & Express.js Backend Systems","Database Design with MySQL & PostgreSQL"]','[null,null,null]',0),
  ('Frontend Mastery','Online Platforms','2022 — 2023','#E6DEDD',
   '["HTML5 & CSS3 — Advanced Certification","JavaScript (ES6+) — Proficiency Badge","Responsive Web Design Certification","Tailwind CSS & Framer Motion"]','[null,null,null,null]',1),
  ('Backend & Databases','Technical Certification','2023','#383E56',
   '["RESTful API Architecture & Design","Authentication & Authorization Systems","Database Optimization Techniques"]','[null,null,null]',2),
  ('Cloud & Deployment','DevOps Foundations','2024','#0056d2',
   '["Vercel & Netlify Deployment Workflows","Git & GitHub Version Control — Advanced","CI/CD Pipeline Fundamentals"]','[null,null,null]',3)
on conflict do nothing;

insert into public.professional_skills (category, icon, color, skills, order_index) values
  ('Communication & Teamwork','🤝','#8ec5ff','["Effective Communication","Team Collaboration","Client Interaction","Leadership & Coordination"]',0),
  ('Problem Solving','🧠','#a78bfa','["Analytical Thinking","Technical Troubleshooting","Strategic Planning","Decision Making"]',1),
  ('Work Excellence','⚡','#34d399','["Time Management","Adaptability","Working Under Pressure","Attention to Detail","Continuous Learning","Fast Problem Resolution"]',2)
on conflict do nothing;

-- ── Migration: add resume_url if table already exists ───────
alter table public.about_info add column if not exists resume_url text default '';
