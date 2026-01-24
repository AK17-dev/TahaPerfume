# Supabase Setup Guide for TahaPerfumetp Admin Panel

## Quick Setup Steps

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub or email
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `tahaperfume-admin`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project" (takes ~2 minutes)

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abc123.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Setup Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste and run this SQL:

```sql
-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.admin_users;

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
CREATE TRIGGER handle_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Insert sample products
INSERT INTO public.products (name_en, name_ar, description_en, description_ar, price, is_active) VALUES
('Royal Oud', 'العود الملكي', 'Luxurious oriental fragrance', 'عطر شرقي فاخر', 299.99, true),
('Golden Rose', 'الوردة الذهبية', 'Elegant floral essence', 'جوهر زهري أنيق', 249.99, true),
('Mystic Amber', 'العنبر الغامض', 'Mysterious and captivating', 'غامض وآسر', 279.99, true),
('Desert Breeze', 'نسيم الصحراء', 'Fresh and invigorating', 'منعش ومنشط', 199.99, true);
```

### 5. Setup Storage for Images

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Bucket details:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **YES** (checked)
4. Click "Create bucket"

### 6. Setup Authentication

1. Go to **Authentication** > **Settings** > **Policies**
2. For `products` table, click "Create Policy"
3. Select "Allow all operations" template
4. Policy name: `Allow all for authenticated users`
5. Click "Create Policy"

### 7. Setup Storage Policies

1. Go to **Storage** > **Policies**
2. For `Objects in product-images`, create policies:

**Upload Policy:**

```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');
```

**Select Policy:**

```sql
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

**Update Policy:**

```sql
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');
```

**Delete Policy:**

```sql
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
```

### 8. Create Admin User

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Enter:
   - **Email**: `admin@tahaperfume.com`
   - **Password**: Your secure password
4. Click "Create user"

### 9. Restart Your App

```bash
npm run dev
```

## Testing

1. Go to `/admin/login`
2. Use your real admin credentials now
3. Add/edit products with photos
4. Changes will persist in the database!

## Troubleshooting

- **"Invalid URL" error**: Check your `.env` file has correct Supabase URL
- **Auth errors**: Verify your anon key is correct
- **Image upload fails**: Check storage bucket is public and policies are set
- **Database errors**: Verify SQL was run successfully in SQL Editor

Your admin panel will now have full persistent storage! 🎉
