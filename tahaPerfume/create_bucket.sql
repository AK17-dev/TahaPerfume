-- Create the product-images storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Verify bucket was created
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE name = 'product-images';

-- Success message
SELECT 'Storage bucket "product-images" created successfully!' as message;
