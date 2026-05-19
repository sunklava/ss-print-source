-- Run this in your Supabase project SQL editor.

alter table products
  add column if not exists gender text not null default 'unisex'
  check (gender in ('men', 'women', 'unisex'));
