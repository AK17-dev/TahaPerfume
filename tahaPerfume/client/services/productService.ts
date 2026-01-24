import { supabase, Product, isSupabaseConfigured } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

// Default mock products for demo when Supabase is not configured
const defaultMockProducts: Product[] = [
  {
    id: "1",
    name_en: "Royal Oud",
    name_ar: "العود الملكي",
    description_en: "Luxurious oriental fragrance",
    description_ar: "عطر شرقي فاخر",
    price: 299.99,
    image_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "2",
    name_en: "Golden Rose",
    name_ar: "الوردة الذهبية",
    description_en: "Elegant floral essence",
    description_ar: "جوهر زهري أنيق",
    price: 249.99,
    image_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "3",
    name_en: "Mystic Amber",
    name_ar: "العنبر الغامض",
    description_en: "Mysterious and captivating",
    description_ar: "غامض وآسر",
    price: 279.99,
    image_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: "4",
    name_en: "Desert Breeze",
    name_ar: "نسيم الصحراء",
    description_en: "Fresh and invigorating",
    description_ar: "منعش ومنشط",
    price: 199.99,
    image_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
  },
];

// Mock products with localStorage persistence
class MockProductStorage {
  private static STORAGE_KEY = "tahaperfume_mock_products";

  static getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Error loading mock products from localStorage:", error);
    }
    this.saveProducts(defaultMockProducts);
    return defaultMockProducts;
  }

  static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.warn("Error saving mock products to localStorage:", error);
    }
  }

  static addProduct(product: Product): void {
    const products = this.getProducts();
    products.unshift(product);
    this.saveProducts(products);
  }

  static updateProduct(updatedProduct: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      this.saveProducts(products);
    }
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    this.saveProducts(filtered);
  }
}

export interface CreateProductData {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
}

export interface UpdateProductData {
  id: string;
  name_en?: string;
  name_ar?: string;
  description_en?: string;
  description_ar?: string;
  price?: number;
  is_active?: boolean;
}

export class ProductService {
  private static BUCKET = "product-images";

  /**
   * Extracts the storage object path from a Supabase public URL.
   * Example:
   * https://xxx.supabase.co/storage/v1/object/public/product-images/products/abc.jpg
   * -> products/abc.jpg
   */
  private static getStoragePathFromPublicUrl(imageUrl: string): string | null {
    try {
      const marker = `/storage/v1/object/public/${this.BUCKET}/`;
      const idx = imageUrl.indexOf(marker);
      if (idx === -1) return null;

      const path = imageUrl.slice(idx + marker.length);
      // remove querystring if exists
      return path.split("?")[0] || null;
    } catch {
      return null;
    }
  }

  // Get all products (for public view)
  static async getAllProducts(includeInactive = false): Promise<Product[]> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase not configured, using persistent mock data");
      const mockProducts = MockProductStorage.getProducts();
      return includeInactive ? mockProducts : mockProducts.filter((p) => p.is_active);
    }

    try {
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!includeInactive) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        const fallbackProducts = MockProductStorage.getProducts();
        return fallbackProducts.filter((p) => includeInactive || p.is_active);
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      const fallbackProducts = MockProductStorage.getProducts();
      return fallbackProducts.filter((p) => includeInactive || p.is_active);
    }
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured || !supabase) {
      const mockProducts = MockProductStorage.getProducts();
      const product = mockProducts.find((p) => p.id === id);
      return product || null;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  }

  // Create new product
  static async createProduct(
    productData: CreateProductData,
  ): Promise<{ success: boolean; data?: Product; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase not configured, saving to localStorage");
      const newProduct: Product = {
        ...productData,
        id: uuidv4(),
        image_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
      };
      MockProductStorage.addProduct(newProduct);
      return { success: true, data: newProduct };
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            ...productData,
            id: uuidv4(),
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating product:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false, error: "Failed to create product" };
    }
  }

  // Update product
  static async updateProduct(
    productData: UpdateProductData,
  ): Promise<{ success: boolean; data?: Product; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase not configured, updating localStorage");
      const { id, ...updateData } = productData;
      const mockProducts = MockProductStorage.getProducts();
      const product = mockProducts.find((p) => p.id === id);

      if (!product) return { success: false, error: "Product not found" };

      const updatedProduct = {
        ...product,
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      MockProductStorage.updateProduct(updatedProduct);
      return { success: true, data: updatedProduct };
    }

    try {
      const { id, ...updateData } = productData;

      const { data, error } = await supabase
        .from("products")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating product:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error: "Failed to update product" };
    }
  }

  // ✅ Delete product (DB + Storage image)
  static async deleteProduct(
    id: string,
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase not configured, deleting from localStorage");
      const mockProducts = MockProductStorage.getProducts();
      const product = mockProducts.find((p) => p.id === id);

      if (!product) return { success: false, error: "Product not found" };

      MockProductStorage.deleteProduct(id);
      return { success: true };
    }

    try {
      // 1) Get image_url first (so we can delete from bucket)
      const { data: existing, error: fetchError } = await supabase
        .from("products")
        .select("image_url")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching product before delete:", fetchError);
        return { success: false, error: fetchError.message };
      }

      const imageUrl: string | null = existing?.image_url ?? null;

      // 2) Delete DB row
      const { error: dbError } = await supabase.from("products").delete().eq("id", id);
      if (dbError) {
        console.error("Error deleting product:", dbError);
        return { success: false, error: dbError.message };
      }

      // 3) Delete image from storage (best-effort)
      if (imageUrl) {
        const path = this.getStoragePathFromPublicUrl(imageUrl);
        if (path) {
          const { error: storageError } = await supabase.storage
            .from(this.BUCKET)
            .remove([path]);

          if (storageError) {
            // don’t fail the whole delete if storage cleanup fails
            console.warn("⚠️ Product deleted but image not removed:", storageError.message);
          }
        } else {
          console.warn("⚠️ Could not parse storage path from image_url:", imageUrl);
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: "Failed to delete product" };
    }
  }

  // Upload product image
  static async uploadProductImage(
    file: File,
    productId: string,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase not configured, saving image to localStorage");

      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => {
          const base64 = reader.result as string;

          const mockProducts = MockProductStorage.getProducts();
          const product = mockProducts.find((p) => p.id === productId);

          if (product) {
            const updatedProduct = {
              ...product,
              image_url: base64,
              updated_at: new Date().toISOString(),
            };
            MockProductStorage.updateProduct(updatedProduct);
            resolve({ success: true, url: base64 });
          } else {
            resolve({ success: false, error: "Product not found" });
          }
        };
        reader.onerror = () => resolve({ success: false, error: "Failed to read image file" });
        reader.readAsDataURL(file);
      });
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return {
          success: false,
          error: "Authentication required. Please log in with your Supabase admin account.",
        };
      }

      if (!file || file.size === 0) return { success: false, error: "Invalid file provided" };
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: "File size too large. Maximum 10MB allowed." };
      }
      if (!file.type.startsWith("image/")) {
        return { success: false, error: "Invalid file type. Please upload an image file." };
      }

      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET)
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return { success: false, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage.from(this.BUCKET).getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("products")
        .update({ image_url: imageUrl })
        .eq("id", productId);

      if (updateError) {
        console.error("Error updating product with image URL:", updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true, url: imageUrl };
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error ? error.message : typeof error === "string" ? error : `Upload failed`;
      return { success: false, error: errorMessage };
    }
  }

  // ✅ Delete product image (fixed path extraction)
  static async deleteProductImage(
    imageUrl: string,
    productId: string,
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase not configured, removing image from localStorage");

      const mockProducts = MockProductStorage.getProducts();
      const product = mockProducts.find((p) => p.id === productId);

      if (product) {
        const updatedProduct = {
          ...product,
          image_url: null,
          updated_at: new Date().toISOString(),
        };
        MockProductStorage.updateProduct(updatedProduct);
      }

      return { success: true };
    }

    try {
      const path = this.getStoragePathFromPublicUrl(imageUrl);

      if (!path) {
        return { success: false, error: "Could not parse image path from URL" };
      }

      const { error: deleteError } = await supabase.storage
        .from(this.BUCKET)
        .remove([path]);

      if (deleteError) {
        console.error("Error deleting image:", deleteError);
        return { success: false, error: deleteError.message };
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({ image_url: null })
        .eq("id", productId);

      if (updateError) {
        console.error("Error updating product after image deletion:", updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting image:", error);
      return { success: false, error: "Failed to delete image" };
    }
  }
}
