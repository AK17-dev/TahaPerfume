-- Storage Policies Setup for TahaPerfumetp
-- Run this in Supabase SQL Editor to fix storage upload issues

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Remove existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create new storage policies for product-images bucket

-- 1. Allow public downloads (anyone can view images)
CREATE POLICY "Allow public downloads" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'product-images');

-- 2. Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
    FOR INSERT 
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 3. Allow authenticated users to update images
CREATE POLICY "Allow authenticated updates" ON storage.objects
    FOR UPDATE 
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 4. Allow authenticated users to delete images
CREATE POLICY "Allow authenticated deletes" ON storage.objects
    FOR DELETE 
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Verify setup
SELECT 'Storage policies setup completed successfully!' as message;

-- Show created policies
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%product-images%' OR policyname LIKE '%authenticated%' OR policyname LIKE '%public%';
