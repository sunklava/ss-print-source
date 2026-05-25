-- Run in Supabase SQL editor to add post-based gallery support.

create table if not exists gallery_posts (
  id          uuid primary key default gen_random_uuid(),
  caption     text,
  order_index integer default 0,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Link gallery images to posts (cascade deletes images when post is deleted)
alter table gallery add column if not exists post_id uuid references gallery_posts(id) on delete cascade;

-- RLS
alter table gallery_posts enable row level security;
create policy "public_read_gallery_posts" on gallery_posts for select using (active = true);
create policy "admin_all_gallery_posts"   on gallery_posts for all  using (auth.role() = 'authenticated');
