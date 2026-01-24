import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Navigation from "../components/Navigation";
import { ProductService } from "../services/productService";
import { Product } from "../lib/supabase";
import { Instagram, MessageCircle, Sparkles, Star } from "lucide-react";

const Index = () => {
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const whatsappNumber = "+96176353706";
  const instagramUrl =
    "https://www.instagram.com/taha_perfumetp?igsh=eWszZTQ1bmVqNjJ0";

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      const fetchedProducts = await ProductService.getAllProducts();
      setProducts(fetchedProducts);
      setIsLoadingProducts(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-white via-luxury-beige-light to-luxury-white">
      <Navigation />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage:
            "url('https://cdn.builder.io/api/v1/image/assets%2F740bcadcab564296b58c988fc52c72e1%2F9c400ea6badc4ec18fc010df2deb3de2?format=webp&width=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center px-4">
          <h1
            className={`text-5xl md:text-7xl font-bold text-white mb-6 ${isRTL ? "font-arabic" : "font-english"
              }`}
          >
            {t("hero.title")}
          </h1>

          <p
            className={`text-xl md:text-2xl text-luxury-gold mb-10 ${isRTL ? "font-arabic" : "font-sans"
              }`}
          >
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-luxury-gold hover:bg-luxury-gold-dark text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              {t("hero.cta")}
            </button>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              {t("hero.whatsapp")}
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="py-20 bg-gradient-to-b from-luxury-white to-luxury-beige-light"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className={`text-4xl font-bold text-center mb-12 ${isRTL ? "font-arabic" : "font-english"
              }`}
          >
            {t("products.title")}
          </h2>

          {isLoadingProducts ? (
            <p className="text-center text-gray-500">
              {isRTL ? "جاري التحميل..." : "Loading..."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={isRTL ? product.name_ar : product.name_en}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-luxury-gold p-2 rounded-full text-white">
                      <Star size={16} />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3
                      className={`text-lg font-semibold mb-2 ${isRTL ? "font-arabic" : "font-english"
                        }`}
                    >
                      {isRTL ? product.name_ar : product.name_en}
                    </h3>

                    <p
                      className={`text-gray-600 mb-4 ${isRTL ? "font-arabic" : "font-sans"
                        }`}
                    >
                      {isRTL
                        ? product.description_ar
                        : product.description_en}
                    </p>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Hello! I'm interested in ${isRTL ? product.name_ar : product.name_en
                        }`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-luxury-gold font-semibold hover:text-luxury-gold-dark"
                    >
                      <MessageCircle size={18} />
                      {t("products.contact")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`${isRTL ? "font-arabic" : "font-sans"} text-white/70`}>
            © 2024 {t("hero.title")}. {t("footer.rights")}
          </p>

          <div className="flex justify-center gap-6 mt-4">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-luxury-gold"
            >
              <MessageCircle size={22} />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-luxury-gold"
            >
              <Instagram size={22} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
