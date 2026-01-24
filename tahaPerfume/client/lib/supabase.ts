import { createClient } from "@supabase/supabase-js";

// These would normally be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const adminKey = import.meta.env.VITE_ADMIN_KEY; // ✅ add this

// Check if Supabase is properly configured with real values
export const isSupabaseConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "YOUR_SUPABASE_URL" &&
    supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY" &&
    supabaseUrl !== "your_supabase_project_url_here" &&
    supabaseAnonKey !== "your_supabase_anon_key_here" &&
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey.startsWith("eyJ");

// Only create Supabase client if properly configured
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: { persistSession: true, autoRefreshToken: true },
    })
    : null;

console.log("🔍 EXPECTED PROJECT:", "https://ajqnfufhpcdxiscfjzxs.supabase.co");
console.log("🔍 ENV PROJECT:", supabaseUrl);

// Log configuration status for debugging
if (!isSupabaseConfigured) {
    console.warn("🔧 SUPABASE NOT CONFIGURED");
    console.warn("📝 Using demo mode with localStorage");
    console.warn("⚙️ To enable real database storage:");
    console.warn("   1. Update .env file with your Supabase credentials");
    console.warn("   2. See SUPABASE_SETUP.md for full instructions");
    console.warn("   3. Restart the dev server");
} else {
    console.log("✅ Supabase configured successfully!");
    console.log(`🔗 Connected to: ${supabaseUrl}`);
    if (!adminKey) {
        console.warn("⚠️ Missing VITE_ADMIN_KEY in .env (admin writes may fail)");
    }
}

export interface Product {
    id: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    price: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

export interface DatabaseProduct {
    id: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    price: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}
