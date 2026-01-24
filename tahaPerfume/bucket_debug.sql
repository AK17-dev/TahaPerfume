-- Debug and fix storage bucket issues
-- Run this in Supabase SQL Editor

-- First, let's see what buckets exist
SELECT 'Current buckets:' as info;
SELECT id, name, public, created_at FROM storage.buckets;

-- Delete the bucket if it exists (in case it has wrong settings)
DELETE FROM storage.buckets WHERE id = 'product-images';

-- Create the bucket with correct settings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Verify it was created correctly
SELECT 'Bucket created successfully:' as info;
SELECT id, name, public, created_at FROM storage.buckets WHERE name = 'product-images';

-- Now set up the storage policies
-- Remove any existing policies first
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create proper storage policies
CREATE POLICY "Allow public downloads" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated uploads" ON storage.objects
    FOR INSERT 
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" ON storage.objects
    FOR UPDATE 
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
    FOR DELETE 
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Final verification
SELECT 'Setup completed! Final bucket list:' as info;
SELECT id, name, public, created_at FROM storage.buckets;

SELECT 'Success: Storage bucket and policies are now properly configured!' as message;
