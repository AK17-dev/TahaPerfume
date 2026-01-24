import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Navigation from "../components/Navigation";
import { ProductService } from "../services/productService";
import { Product } from "../lib/supabase";
import { Instagram, MessageCircle, Sparkles, Heart } from "lucide-react";

const Index = () => {
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const whatsappNumber = "+961 76 353 706";
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
          backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F740bcadcab564296b58c988fc52c72e1%2F9c400ea6badc4ec18fc010df2deb3de2?format=webp&width=800')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black/40 via-luxury-black/20 to-luxury-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-luxury-white ${isRTL ? "font-arabic" : "font-english"
                } text-shadow`}
            >
              {t("hero.title")}
            </h1>
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl font-medium mb-8 text-luxury-gold ${isRTL ? "font-arabic" : "font-english"
                }`}
            >
              {t("hero.subtitle")}
            </h2>
            <p
              className={`text-lg md:text-xl max-w-3xl mx-auto mb-12 text-luxury-white leading-relaxed ${isRTL ? "font-arabic" : "font-sans"
                }`}
            >
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Sparkles size={20} />
                  <span>{t("hero.cta")}</span>
                </span>
              </button>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/\s+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <MessageCircle size={20} />
                  <span>{t("hero.whatsapp")}</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-luxury-gold/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-32 h-32 bg-luxury-beige/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-luxury-gold/10 rounded-full blur-lg animate-pulse delay-500"></div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="py-20 bg-gradient-to-b from-luxury-white to-luxury-beige-light"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 text-luxury-black ${isRTL ? "font-arabic" : "font-english"
                }`}
            >
              {t("products.title")}
            </h2>
            <p
              className={`text-xl text-luxury-black/70 max-w-2xl mx-auto ${isRTL ? "font-arabic" : "font-sans"
                }`}
            >
              {t("products.subtitle")}
            </p>
          </div>

          {isLoadingProducts ? (
            <div className="text-center py-12 text-luxury-black/60">
              {isRTL ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-luxury-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={isRTL ? product.name_ar : product.name_en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* ✅ DELETED: the star badge you showed in the screenshot */}
                  </div>

                  <div className="p-6">
                    <h3
                      className={`text-xl font-semibold mb-2 text-luxury-black ${isRTL ? "font-arabic" : "font-english"
                        }`}
                    >
                      {isRTL ? product.name_ar : product.name_en}
                    </h3>

                    <p
                      className={`text-luxury-black/70 mb-3 ${isRTL ? "font-arabic" : "font-sans"
                        }`}
                    >
                      {isRTL ? product.description_ar : product.description_en}
                    </p>

                    {/* ✅ PRICE (this is what was missing) */}
                    <p
                      className={`text-luxury-gold font-bold text-lg mb-4 ${isRTL ? "font-arabic" : "font-english"
                        }`}
                    >
                      ${Number(product.price ?? 0).toFixed(2)}
                    </p>

                    <a
                      href={`https://wa.me/${whatsappNumber.replace(
                        /\s+/g,
                        "",
                      )}?text=${encodeURIComponent(
                        `Hello! I'm interested in ${isRTL ? product.name_ar : product.name_en
                        }`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 rtl:space-x-reverse text-luxury-gold hover:text-luxury-gold-dark font-semibold transition-colors duration-300"
                    >
                      <MessageCircle size={18} />
                      <span>{t("products.contact")}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-gradient-to-b from-luxury-beige-light to-luxury-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-8 text-luxury-black ${isRTL ? "font-arabic" : "font-english"
                  }`}
              >
                {t("about.title")}
              </h2>
              <p
                className={`text-lg text-luxury-black/80 leading-relaxed mb-8 ${isRTL ? "font-arabic" : "font-sans"
                  }`}
              >
                {t("about.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle size={20} />
                  <span>{t("contact.whatsapp")}</span>
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 rtl:space-x-reverse border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Instagram size={20} />
                  <span>{t("contact.instagram")}</span>
                </a>
              </div>
            </div>

            {/* Card removed */}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-black text-luxury-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3
                className={`text-2xl font-bold mb-4 text-luxury-gold ${isRTL ? "font-arabic" : "font-english"
                  }`}
              >
                {t("hero.title")}
              </h3>
              <p
                className={`text-luxury-white/80 ${isRTL ? "font-arabic" : "font-sans"
                  }`}
              >
                {t("footer.luxury")}
              </p>
            </div>

            <div>
              <h4
                className={`text-lg font-semibold mb-4 ${isRTL ? "font-arabic" : "font-sans"
                  }`}
              >
                {t("nav.contact")}
              </h4>
              <div className="space-y-2">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rtl:space-x-reverse text-luxury-white/80 hover:text-luxury-gold transition-colors duration-300"
                >
                  <MessageCircle size={18} />
                  <span>{whatsappNumber}</span>
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rtl:space-x-reverse text-luxury-white/80 hover:text-luxury-gold transition-colors duration-300"
                >
                  <Instagram size={18} />
                  <span>@taha_perfumetp</span>
                </a>
              </div>
            </div>

            <div>
              <p
                className={`text-luxury-white/60 text-sm ${isRTL ? "font-arabic" : "font-sans"
                  }`}
              >
                {t("contact.order")}
              </p>
            </div>
          </div>

          <div className="border-t border-luxury-white/20 mt-8 pt-8 text-center">
            <p
              className={`text-luxury-white/60 ${isRTL ? "font-arabic" : "font-sans"
                }`}
            >
              © 2024 {t("hero.title")}. {t("footer.rights")}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
