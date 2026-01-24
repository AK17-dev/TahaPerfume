-- TahaPerfumetp Database Setup
-- Copy and paste this entire script into Supabase SQL Editor

-- Clean up existing tables (if any)
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Create products table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Create admin users table
CREATE TABLE public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER handle_products_updated_at 
    BEFORE UPDATE ON public.products
    FOR EACH ROW 
    EXECUTE PROCEDURE public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Allow public read access" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for admin_users table
CREATE POLICY "Allow authenticated admin access" ON public.admin_users
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample products
INSERT INTO public.products (name_en, name_ar, description_en, description_ar, price, is_active) VALUES
('Royal Oud', 'العود الملكي', 'Luxurious oriental fragrance with deep, rich notes', 'عطر شرقي فاخر بنفحات عميقة وغنية', 299.99, true),
('Golden Rose', 'الوردة الذهبية', 'Elegant floral essence with romantic undertones', 'جوهر زهري أنيق بلمسات رومانسية', 249.99, true),
('Mystic Amber', 'العنبر الغامض', 'Mysterious and captivating with warm amber notes', 'غامض وآسر بنفحات العنبر الدافئة', 279.99, true),
('Desert Breeze', 'نسيم الصحراء', 'Fresh and invigorating with citrus top notes', 'منعش ومنشط بنفحات حمضية علوية', 199.99, true),
('Night Jasmine', 'ياسمين الليل', 'Intoxicating night-blooming jasmine fragrance', 'عطر ياسمين ليلي مسكر ومثير', 329.99, true),
('Sandalwood Dreams', 'أحلام الصندل', 'Warm and woody with sandalwood base', 'دافئ وخشبي بقاعدة من الصندل', 259.99, true);

-- Success message
SELECT 'Database setup completed successfully! You can now manage products.' as message;
