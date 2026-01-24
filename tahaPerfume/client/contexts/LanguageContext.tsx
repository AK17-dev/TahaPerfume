import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ar";

interface Translations { 
  [key: string]: {
    en: string;
    ar: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.products": { en: "Products", ar: "المنتجات" },
  "nav.about": { en: "About Us", ar: "عن الشركة" },
  "nav.contact": { en: "Contact", ar: "تواصل معنا" },

  // Hero Section
  "hero.title": { en: "TahaPerfumetp", ar: "طه بيرفيوم تي بي"},
  "hero.subtitle": {
    en: "Luxury Fragrances Collection",
    ar: "مجموعة العطور الفاخرة",
  },
  "hero.description": {
    en: "Discover our exquisite collection of premium perfumes crafted for the sophisticated individual.",
    ar: "اكتشف مجموعتنا الرائعة من العطور المتميزة المصنوعة للشخصية المتطورة.",
  },
  "hero.cta": { en: "Explore Collection", ar: "استكشف المجموعة" },
  "hero.whatsapp": { en: "Order via WhatsApp", ar: "اطلب عبر واتساب" },

  // Products Section
  "products.title": { en: "Our Premium Collection", ar: "مجموعتنا المتميزة" },
  "products.subtitle": {
    en: "Each fragrance tells a unique story",
    ar: "كل عطر يحكي قصة فريدة",
  },
  "products.contact": { en: "Contact for Price", ar: "تواصل للسعر" },

  // About Section
  "about.title": { en: "About TahaPerfumetp", ar: "عن طه بيرفيوم تي بي" },
  "about.description": {
    en: "We are passionate about bringing you the finest selection of luxury perfumes. Our curated collection features exceptional fragrances that embody elegance, sophistication, and timeless appeal.",
    ar: "نحن متحمسون لتقديم أفضل مجموعة من العطور الفاخرة لك. تضم مجموعتنا المنتاة عطورًا استثنائية تجسد الأناقة والرقي والجاذبية الخالدة.",
  },

  // Contact
  "contact.whatsapp": { en: "WhatsApp Us", ar: "راسلنا واتساب" },
  "contact.instagram": { en: "Follow on Instagram", ar: "تابعنا على انستغرام" },
  "contact.order": {
    en: "To place an order, contact us directly via WhatsApp",
    ar: "لتقديم طلب، تواصل معنا مباشرة عبر واتساب",
  },

  // Footer
  "footer.rights": { en: "All rights reserved", ar: "جميع الحقوق محفوظة" },
  "footer.luxury": { en: "Luxury Perfumes", ar: "العطور الفاخرة" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={isRTL ? "rtl" : "ltr"} dir={isRTL ? "rtl" : "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
