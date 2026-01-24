import { useState, useEffect } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

import {
  ProductService,
  CreateProductData,
  UpdateProductData,
} from "../services/productService";
import { Product, isSupabaseConfigured } from "../lib/supabase";
import ImageUpload from "../components/ImageUpload";
import SupabaseStatus from "../components/SupabaseStatus";
import StorageTest from "../components/StorageTest";
import { StorageChecker } from "../utils/storageChecker";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Save,
  X,
  Package,
  Eye,
  EyeOff,
} from "lucide-react";

interface ProductFormData {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
}

const AdminPanel = () => {
  const { isAdmin, logout, loading } = useAdmin();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  // ✅ For NEW product image (before product exists)
  const [newProductImage, setNewProductImage] = useState<File | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImageFor, setUploadingImageFor] = useState<string | null>(
    null,
  );

  const [storageStatus, setStorageStatus] = useState<{
    checked: boolean;
    bucketExists: boolean;
    canUpload: boolean;
    errors: string[];
  }>({
    checked: false,
    bucketExists: false,
    canUpload: false,
    errors: [],
  });

  const [formData, setFormData] = useState<ProductFormData>({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    price: 0,
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    const allProducts = await ProductService.getAllProducts(true);
    setProducts(allProducts);
    setIsLoadingProducts(false);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      price: 0,
    });
    setNewProductImage(null); // ✅ important
    setShowForm(true);
  };

  const closeForm = () => {
    setFormData({
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      price: 0,
    });
    setEditingProduct(null);
    setNewProductImage(null); // ✅ important
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        const updateData: UpdateProductData = {
          id: editingProduct.id,
          ...formData,
        };
        const result = await ProductService.updateProduct(updateData);

        if (result.success) {
          await loadProducts();
          closeForm();

          if (!isSupabaseConfigured) {
            alert(
              isRTL
                ? "تم حفظ التغييرات محليًا! للحفظ الدائم، قم بإعداد Supabase."
                : "Changes saved locally! For permanent storage, setup Supabase.",
            );
          }
        } else {
          alert(result.error || "Failed to update product");
        }
      } else {
        // ✅ Create new product first
        const createData: CreateProductData = formData;
        const result = await ProductService.createProduct(createData);

        if (!result.success || !result.data?.id) {
          alert(result.error || "Failed to create product");
          return;
        }

        const newProductId = result.data.id;

        // ✅ If admin selected an image, upload it using the REAL new product id
        if (newProductImage) {
          await handleImageUpload(newProductImage, newProductId);
        }

        // ✅ Load products once after everything
        await loadProducts();
        closeForm();

        if (!isSupabaseConfigured) {
          alert(
            isRTL
              ? "تم إنشاء المنتج محليًا! للحفظ الدائم، قم بإعداد Supabase."
              : "Product created locally! For permanent storage, setup Supabase.",
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while saving the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en,
      name_ar: product.name_ar,
      description_en: product.description_en,
      description_ar: product.description_ar,
      price: product.price,
    });
    setShowForm(true);

    // ✅ Clear any pending new-product image
    setNewProductImage(null);
  };

  const handleDelete = async (product: Product) => {
    if (
      window.confirm(
        isRTL
          ? `هل أنت متأكد من حذف "${product.name_ar}"؟`
          : `Are you sure you want to delete "${product.name_en}"?`,
      )
    ) {
      const result = await ProductService.deleteProduct(product.id);
      if (result.success) {
        await loadProducts();
      } else {
        alert(result.error || "Failed to delete product");
      }
    }
  };

  const handleToggleActive = async (product: Product) => {
    const updateData: UpdateProductData = {
      id: product.id,
      is_active: !product.is_active,
    };
    const result = await ProductService.updateProduct(updateData);
    if (result.success) {
      await loadProducts();
    } else {
      alert(result.error || "Failed to update product status");
    }
  };

  const handleImageUpload = async (file: File, productId: string) => {
    setUploadingImageFor(productId);

    // Check storage setup on first upload if using Supabase
    if (isSupabaseConfigured && !storageStatus.checked) {
      console.log("🔍 Checking storage setup...");
      const checkResult = await StorageChecker.checkStorageSetup();
      setStorageStatus({
        checked: true,
        bucketExists: checkResult.bucketExists,
        canUpload: checkResult.canUpload,
        errors: checkResult.errors,
      });

      if (!checkResult.canUpload && checkResult.errors.length > 0) {
        alert(
          `Storage setup issue:\n\n${checkResult.errors.join(
            "\n",
          )}\n\nPlease set up storage bucket and policies in Supabase Dashboard.`,
        );
        setUploadingImageFor(null);
        return;
      }
    }

    const result = await ProductService.uploadProductImage(file, productId);

    if (result.success) {
      // ✅ optional: no need to loadProducts here, caller can load once
      await loadProducts();
    } else {
      const errorMsg = result.error || "Failed to upload image";
      console.error("Image upload failed:", errorMsg);

      if (errorMsg.includes("Bucket not found")) {
        alert(
          `❌ Storage Error: Product images bucket not found.\n\n🔧 To fix this:\n${StorageChecker.getSetupInstructions().join(
            "\n",
          )}`,
        );
      } else if (errorMsg.includes("row-level security")) {
        alert(
          `❌ Permission Error: Storage policies not configured.\n\n🔧 To fix this:\n1. Go to Supabase Dashboard → Storage → Policies\n2. Create policies for 'product-images' bucket\n3. Allow public SELECT and authenticated INSERT/UPDATE/DELETE`,
        );
      } else {
        alert(`❌ Upload Error: ${errorMsg}`);
      }
    }

    setUploadingImageFor(null);
  };

  const handleImageDelete = async (product: Product) => {
    if (product.image_url) {
      setUploadingImageFor(product.id);
      const result = await ProductService.deleteProductImage(
        product.image_url,
        product.id,
      );
      if (result.success) {
        await loadProducts();
      } else {
        alert(result.error || "Failed to delete image");
      }
      setUploadingImageFor(null);
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-white via-luxury-beige-light to-luxury-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-luxury-black ${isRTL ? "font-arabic" : "font-sans"}`}>
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-white via-luxury-beige-light to-luxury-white">
      {/* Header */}
      <header className="bg-luxury-white shadow-sm border-b border-luxury-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <h1
                className={`text-2xl font-bold text-luxury-black ${isRTL ? "font-arabic" : "font-english"
                  }`}
              >
                {isRTL ? "لوحة تحكم المدير" : "Admin Panel"}
              </h1>
              {!isSupabaseConfigured && (
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {isRTL ? "وضع التجريب" : "DEMO MODE"}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <a
                href="/"
                className={`text-luxury-gold hover:text-luxury-gold-dark font-medium ${isRTL ? "font-arabic" : "font-sans"
                  }`}
              >
                {isRTL ? "عرض الموقع" : "View Site"}
              </a>
              <button
                onClick={logout}
                className="flex items-center space-x-2 rtl:space-x-reverse text-luxury-black hover:text-luxury-gold transition-colors duration-300"
              >
                <LogOut size={20} />
                <span className={`${isRTL ? "font-arabic" : "font-sans"}`}>
                  {isRTL ? "تسجيل خروج" : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SupabaseStatus />
        {isSupabaseConfigured && <StorageTest />}

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl font-semibold text-luxury-black ${isRTL ? "font-arabic" : "font-english"
              }`}
          >
            {isRTL ? "إدارة المنتجات" : "Product Management"}
          </h2>
          <button
            onClick={() => {
              if (showForm) closeForm();
              else openAddForm();
            }}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            <span>
              {showForm
                ? isRTL
                  ? "إلغاء"
                  : "Cancel"
                : isRTL
                  ? "إضافة منتج"
                  : "Add Product"}
            </span>
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-luxury-white rounded-lg shadow-sm p-6 border border-luxury-beige mb-6">
            <h3
              className={`text-lg font-semibold text-luxury-black mb-4 ${isRTL ? "font-arabic" : "font-english"
                }`}
            >
              {editingProduct
                ? isRTL
                  ? "تعديل المنتج"
                  : "Edit Product"
                : isRTL
                  ? "إضافة منتج جديد"
                  : "Add New Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-sans"
                      }`}
                  >
                    {isRTL ? "الاسم (انجليزي)" : "Name (English)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) =>
                      setFormData({ ...formData, name_en: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-luxury-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-sans"
                      }`}
                  >
                    {isRTL ? "الاسم (عربي)" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ar: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-luxury-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent font-arabic"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-sans"
                      }`}
                  >
                    {isRTL ? "الوصف (انجليزي)" : "Description (English)"}
                  </label>
                  <textarea
                    required
                    value={formData.description_en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_en: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-luxury-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-sans"
                      }`}
                  >
                    {isRTL ? "الوصف (عربي)" : "Description (Arabic)"}
                  </label>
                  <textarea
                    required
                    value={formData.description_ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description_ar: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-luxury-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent font-arabic"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-sans"
                      }`}
                  >
                    {isRTL ? "السعر (USD)" : "Price (USD)"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-luxury-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  />
                </div>
              </div>

              {/* NEW: image picker inside "Add New Product" */}
              {!editingProduct && (
                <div className="mt-2">
                  <label
                    className={`block text-sm font-medium text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-sans"
                      }`}
                  >
                    {isRTL ? "صورة المنتج" : "Product Image"}
                  </label>

                  <ImageUpload
                    onImageUpload={async (file) => {
                      setNewProductImage(file); // ✅ store only, upload after create
                    }}
                    currentImageUrl={
                      newProductImage ? URL.createObjectURL(newProductImage) : null
                    }
                    onImageDelete={
                      newProductImage ? async () => setNewProductImage(null) : undefined
                    }
                    isUploading={isSubmitting}
                  />
                </div>
              )}

              {/* actions */}
              <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2 border border-luxury-beige text-luxury-black hover:bg-luxury-beige rounded-lg font-semibold transition-all duration-300"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 rtl:space-x-reverse bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-luxury-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  <span>
                    {isSubmitting
                      ? isRTL
                        ? "جاري الحفظ..."
                        : "Saving..."
                      : isRTL
                        ? "حفظ"
                        : "Save"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-luxury-white rounded-lg shadow-sm border border-luxury-beige">
          <div className="p-6">
            {isLoadingProducts ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className={`text-luxury-black/60 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {isRTL ? "جاري تحميل المنتجات..." : "Loading products..."}
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="text-luxury-black/40 mx-auto mb-4" size={48} />
                <p className={`text-luxury-black/60 ${isRTL ? "font-arabic" : "font-sans"}`}>
                  {isRTL ? "لا توجد منتجات حتى الآن" : "No products yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`border border-luxury-beige rounded-lg overflow-hidden ${!product.is_active ? "opacity-60" : ""
                      }`}
                  >
                    <div className="relative">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={isRTL ? product.name_ar : product.name_en}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-luxury-beige-light flex items-center justify-center">
                          <Package className="text-luxury-black/40" size={48} />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`p-1 rounded-full ${product.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                            }`}
                        >
                          {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className={`font-semibold text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-english"}`}>
                        {isRTL ? product.name_ar : product.name_en}
                      </h3>

                      <p className={`text-luxury-black/70 text-sm mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}>
                        {isRTL ? product.description_ar : product.description_en}
                      </p>

                      <p className={`text-luxury-gold font-bold text-lg mb-4 ${isRTL ? "font-arabic" : "font-english"}`}>
                        ${product.price}
                      </p>

                      <div className="mb-4">
                        <ImageUpload
                          onImageUpload={(file) => handleImageUpload(file, product.id)}
                          currentImageUrl={product.image_url}
                          onImageDelete={() => handleImageDelete(product)}
                          isUploading={uploadingImageFor === product.id}
                        />
                      </div>

                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 flex items-center justify-center space-x-1 rtl:space-x-reverse bg-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-white px-3 py-2 rounded-lg font-medium transition-all duration-300"
                        >
                          <Edit size={16} />
                          <span className={`${isRTL ? "font-arabic" : "font-sans"}`}>
                            {isRTL ? "تعديل" : "Edit"}
                          </span>
                        </button>

                        <button
                          onClick={() => handleDelete(product)}
                          className="flex-1 flex items-center justify-center space-x-1 rtl:space-x-reverse bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg font-medium transition-all duration-300"
                        >
                          <Trash2 size={16} />
                          <span className={`${isRTL ? "font-arabic" : "font-sans"}`}>
                            {isRTL ? "حذف" : "Delete"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
