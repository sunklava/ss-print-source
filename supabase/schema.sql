-- Run this in your Supabase project SQL editor.

create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null,
  price        text not null,
  image_url    text,
  tag          text,
  order_index  integer default 0,
  active       boolean default true,
  created_at   timestamptz default now()
);

create table if not exists pricing_tiers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  price        text not null,
  unit         text not null default '/ piece',
  description  text,
  features     jsonb default '[]',
  featured     boolean default false,
  order_index  integer default 0
);

create table if not exists pricing_addons (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  price        text not null,
  order_index  integer default 0
);

create table if not exists site_content (
  id              integer primary key default 1,
  hero_eyebrow    text default 'Vol. 01 — Spring Press',
  hero_heading    text default 'Wear your ideas.',
  hero_subtext    text default 'Custom printing & apparel out of Jamaica.',
  stats           jsonb default '[{"key":"500+","label":"Pieces Pressed"},{"key":"48h","label":"Avg. Turnaround"},{"key":"100%","label":"Custom"}]',
  marquee_items   text[] default array['Custom Printing','Heat Press','Embroidery','Screen Print','Kingston, JA'],
  contact_phone   text default '+1 (876) 000-0000',
  contact_email   text default 'hello@ssprint.jm',
  contact_hours   text default 'Mon–Sat · 9am–7pm',
  footer_tagline  text default 'Pressed · Printed · Personal',
  constraint site_content_single_row check (id = 1)
);

create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  name          text not null,
  email         text not null,
  phone         text,
  product_type  text,
  details       text,
  quantity      integer,
  status        text default 'new' check (status in ('new','in_progress','completed','cancelled'))
);

create table if not exists gallery (
  id           uuid primary key default gen_random_uuid(),
  image_url    text not null,
  caption      text,
  order_index  integer default 0,
  active       boolean default true,
  created_at   timestamptz default now()
);

-- Storage bucket for gallery images
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict do nothing;

-- Row Level Security
alter table products       enable row level security;
alter table pricing_tiers  enable row level security;
alter table pricing_addons enable row level security;
alter table site_content   enable row level security;
alter table orders         enable row level security;
alter table gallery        enable row level security;

-- Public reads
create policy "public_read_products"       on products       for select using (active = true);
create policy "public_read_pricing_tiers"  on pricing_tiers  for select using (true);
create policy "public_read_pricing_addons" on pricing_addons for select using (true);
create policy "public_read_site_content"   on site_content   for select using (true);
create policy "public_read_gallery"        on gallery        for select using (active = true);

-- Public order submission
create policy "public_insert_orders" on orders for insert with check (true);

-- Admin full access
create policy "admin_all_products"       on products       for all using (auth.role() = 'authenticated');
create policy "admin_all_pricing_tiers"  on pricing_tiers  for all using (auth.role() = 'authenticated');
create policy "admin_all_pricing_addons" on pricing_addons for all using (auth.role() = 'authenticated');
create policy "admin_all_site_content"   on site_content   for all using (auth.role() = 'authenticated');
create policy "admin_all_orders"         on orders         for all using (auth.role() = 'authenticated');
create policy "admin_all_gallery"        on gallery        for all using (auth.role() = 'authenticated');

-- Storage policies
create policy "public_gallery_read"  on storage.objects for select using (bucket_id = 'gallery');
create policy "admin_gallery_upload" on storage.objects for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy "admin_gallery_delete" on storage.objects for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- Seed data
insert into site_content (id) values (1) on conflict (id) do nothing;

insert into products (name, category, price, tag, order_index) values
  ('Classic Shirt',    'Shirts',   '$1,500', 'Bestseller', 1),
  ('Graphic Tee',      'Shirts',   '$1,800', null,         2),
  ('Heavy Hoodie',     'Hoodies',  '$4,800', 'New',        3),
  ('Pullover Hoodie',  'Hoodies',  '$3,200', null,         4),
  ('Crewneck Sweater', 'Sweaters', '$3,400', null,         5),
  ('Zip Sweater',      'Sweaters', '$2,800', null,         6),
  ('Bomber Jacket',    'Jackets',  '$6,500', null,         7),
  ('Windbreaker',      'Jackets',  '$5,800', null,         8),
  ('Dad Cap',          'Caps',     '$1,800', null,         9),
  ('Snapback',         'Caps',     '$2,000', null,        10)
on conflict do nothing;

insert into pricing_tiers (name, price, unit, description, features, featured, order_index) values
  ('Single Piece', '$1,500', '/ piece', 'Perfect for personal designs and gifts.',
   '["1 print location","Free digital mockup","48–72hr turnaround","Pickup or delivery"]', false, 1),
  ('Small Run',    '$1,200', '/ piece', '10–24 pieces. Great for crews and small teams.',
   '["Up to 2 print locations","Free mockup + revisions","5 day turnaround","10% deposit"]', true, 2),
  ('Bulk Order',   '$950',   '/ piece', '25+ pieces. Schools, events, businesses.',
   '["Unlimited locations","Dedicated production rep","5–7 day turnaround","Volume pricing"]', false, 3)
on conflict do nothing;

insert into pricing_addons (name, price, order_index) values
  ('Cap Embroidery',       '$1,800',      1),
  ('Sweater Press',        '$3,400',      2),
  ('Hoodie Press',         '$4,800',      3),
  ('Jacket Press',         '$6,500',      4),
  ('Rush 24hr Service',    '+50%',        5),
  ('Extra Print Location', '+$400',       6),
  ('Design Service',       'from $2,500', 7)
on conflict do nothing;
