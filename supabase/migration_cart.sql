-- Run this in your Supabase SQL editor if you've already set up the database.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text default 'pending' check (payment_status in ('pending','paid','failed'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount numeric;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items jsonb;
