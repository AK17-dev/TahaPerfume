import { isSupabaseConfigured } from "../lib/supabase";
import { useLanguage } from "../contexts/LanguageContext";
import { Database, AlertCircle, CheckCircle } from "lucide-react";

const SupabaseStatus = () => {
  const { isRTL } = useLanguage();

  if (isSupabaseConfigured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <CheckCircle className="text-green-600" size={20} />
          <div>
            <h3
              className={`font-semibold text-green-800 ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              {isRTL ? "قاعدة البيانات متصلة" : "Database Connected"}
            </h3>
            <p
              className={`text-green-700 text-sm ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              {isRTL
                ? "التغييرات محفوظة بشكل دائم في Supabase"
                : "Changes are permanently saved in Supabase"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3 rtl:space-x-reverse">
        <AlertCircle className="text-orange-600 mt-0.5" size={20} />
        <div className="flex-1">
          <h3
            className={`font-semibold text-orange-800 mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}
          >
            {isRTL
              ? "وضع التجريب - البيانات مؤقتة"
              : "Demo Mode - Temporary Data"}
          </h3>
          <p
            className={`text-orange-700 text-sm mb-3 ${isRTL ? "font-arabic" : "font-sans"}`}
          >
            {isRTL
              ? "التغييرات محفوظة محليًا فقط. لحفظ دائم، قم بإعداد Supabase:"
              : "Changes saved locally only. For permanent storage, setup Supabase:"}
          </p>
          <div
            className={`space-y-1 text-orange-700 text-sm ${isRTL ? "font-arabic" : "font-sans"}`}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Database size={14} />
              <span>
                {isRTL
                  ? "1. قم بتحديث ملف .env بمعلومات Supabase الخاصة بك"
                  : "1. Update .env file with your Supabase credentials"}
              </span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Database size={14} />
              <span>
                {isRTL
                  ? "2. راجع ملف SUPABASE_SETUP.md للتعليمات الكاملة"
                  : "2. See SUPABASE_SETUP.md for full instructions"}
              </span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Database size={14} />
              <span>
                {isRTL ? "3. أعد تشغيل الخادم" : "3. Restart the dev server"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseStatus;
