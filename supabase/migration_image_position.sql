-- Run in Supabase SQL editor to add focal-point image positioning to products.
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_position text default '50% 50%';
