import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-white via-luxury-beige-light to-luxury-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-luxury-white" size={48} />
          </div>
        </div>

        <h1
          className={`text-6xl font-bold mb-4 text-luxury-black ${isRTL ? "font-arabic" : "font-english"}`}
        >
          404
        </h1>

        <h2
          className={`text-2xl font-semibold mb-4 text-luxury-gold ${isRTL ? "font-arabic" : "font-english"}`}
        >
          {isRTL ? "الصفحة غير موجودة" : "Page Not Found"}
        </h2>

        <p
          className={`text-lg text-luxury-black/70 mb-8 max-w-md mx-auto ${isRTL ? "font-arabic" : "font-sans"}`}
        >
          {isRTL
            ? "عذراً، الصفحة التي تبحث عنها غير موجودة. دعنا نعيدك إلى مجموعتنا الرائعة من العطور."
            : "Sorry, the page you're looking for doesn't exist. Let us take you back to our exquisite perfume collection."}
        </p>

        <a
          href="/"
          className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Home size={20} />
          <span>{isRTL ? "العودة للرئيسية" : "Return to Home"}</span>
        </a>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-luxury-gold/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-32 h-32 bg-luxury-beige/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </div>
  );
};

export default NotFound;
