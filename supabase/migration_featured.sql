-- Run in Supabase SQL editor to add featured flag to products.
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured boolean default false;
