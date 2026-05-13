-- Run this in your Supabase SQL editor if you've already set up the database.

ALTER TABLE site_content ADD COLUMN IF NOT EXISTS hero_image_url text;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS workshop_image_url text;

INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site', 'site', true) ON CONFLICT DO NOTHING;

CREATE POLICY "public_products_read"  ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "admin_products_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "admin_products_delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "public_site_read"  ON storage.objects FOR SELECT USING (bucket_id = 'site');
CREATE POLICY "admin_site_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site' AND auth.role() = 'authenticated');
CREATE POLICY "admin_site_delete" ON storage.objects FOR DELETE USING (bucket_id = 'site' AND auth.role() = 'authenticated');
