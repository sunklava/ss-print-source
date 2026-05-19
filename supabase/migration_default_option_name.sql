-- Run this in your Supabase project SQL editor.

alter table products
  add column if not exists default_option_name text;
