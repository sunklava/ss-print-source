-- Run in Supabase SQL editor to add delivery and address fields to orders.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method text check (delivery_method in ('pickup', 'delivery'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_line1 text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_city text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_parish text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_postal text;
