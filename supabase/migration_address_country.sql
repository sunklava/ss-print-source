-- Run in Supabase SQL editor to add country field to orders.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_country text;
