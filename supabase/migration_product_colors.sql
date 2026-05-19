-- Run this in your Supabase project SQL editor.

create table if not exists product_colors (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  name           text not null,
  image_url      text,
  image_position text default '50% 50%',
  order_index    integer default 0,
  created_at     timestamptz default now()
);

alter table product_colors enable row level security;

create policy "public_read_product_colors"  on product_colors for select using (true);
create policy "admin_all_product_colors"    on product_colors for all    using (auth.role() = 'authenticated');

-- Storage bucket for product images (may already exist)
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
