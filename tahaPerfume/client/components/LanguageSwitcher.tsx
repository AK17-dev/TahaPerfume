import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 text-sm font-medium transition-all duration-300 ${
          language === "en"
            ? "text-luxury-gold border-b-2 border-luxury-gold"
            : "text-luxury-black hover:text-luxury-gold"
        }`}
      >
        EN
      </button>
      <span className="text-luxury-black">|</span>
      <button
        onClick={() => setLanguage("ar")}
        className={`px-3 py-1 text-sm font-medium transition-all duration-300 ${
          language === "ar"
            ? "text-luxury-gold border-b-2 border-luxury-gold"
            : "text-luxury-black hover:text-luxury-gold"
        }`}
      >
        عربي
      </button>
    </div>
  );
};

export default LanguageSwitcher;
