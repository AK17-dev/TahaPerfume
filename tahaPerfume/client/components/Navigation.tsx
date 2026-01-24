import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X, Instagram, MessageCircle } from "lucide-react";

const Navigation = () => {
  const { t, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const whatsappNumber = "+961 76 353 706";
  const instagramUrl =
    "https://www.instagram.com/taha_perfumetp?igsh=eWszZTQ1bmVqNjJ0";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-gold/95 backdrop-blur-md border-b border-luxury-gold-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F740bcadcab564296b58c988fc52c72e1%2F2ac605fc17c14a8ea66c56cb8c940a7b?format=webp&width=800"
              alt="Taha Perfume Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-luxury-white font-english">
              TahaPerfumetp
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8 rtl:space-x-reverse">
              <button
                onClick={() => scrollToSection("home")}
                className="text-luxury-white hover:text-luxury-white/80 transition-colors duration-300 font-medium"
              >
                {t("nav.home")}
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="text-luxury-white hover:text-luxury-white/80 transition-colors duration-300 font-medium"
              >
                {t("nav.products")}
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-luxury-white hover:text-luxury-white/80 transition-colors duration-300 font-medium"
              >
                {t("nav.about")}
              </button>

              {/* Social Links */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-white hover:text-luxury-white/80 transition-colors duration-300"
                  title={t("contact.whatsapp")}
                >
                  <MessageCircle size={20} />
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-white hover:text-luxury-white/80 transition-colors duration-300"
                  title={t("contact.instagram")}
                >
                  <Instagram size={20} />
                </a>
              </div>

              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-luxury-white hover:text-luxury-white/80 transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-luxury-gold border-t border-luxury-gold-dark">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-3 py-2 text-luxury-white hover:text-luxury-white/80 transition-colors duration-300 font-medium"
              >
                {t("nav.home")}
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="block w-full text-left px-3 py-2 text-luxury-white hover:text-luxury-white/80 transition-colors duration-300 font-medium"
              >
                {t("nav.products")}
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-3 py-2 text-luxury-white hover:text-luxury-white/80 transition-colors duration-300 font-medium"
              >
                {t("nav.about")}
              </button>

              {/* Mobile Social Links */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse px-3 py-2">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-white hover:text-luxury-white/80 transition-colors duration-300"
                  title={t("contact.whatsapp")}
                >
                  <MessageCircle size={20} />
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-white hover:text-luxury-white/80 transition-colors duration-300"
                  title={t("contact.instagram")}
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

