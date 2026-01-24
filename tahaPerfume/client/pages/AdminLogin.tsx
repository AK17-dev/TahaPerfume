import { useState, useEffect } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAdmin, loading } = useAdmin();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin && !loading) {
      navigate("/admin");
    }
  }, [isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      navigate("/admin");
    }

    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-white via-luxury-beige-light to-luxury-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p
            className={`text-luxury-black ${isRTL ? "font-arabic" : "font-sans"}`}
          >
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-white via-luxury-beige-light to-luxury-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-luxury-gold rounded-full flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-luxury-white" />
          </div>
          <h2
            className={`text-3xl font-bold text-luxury-black ${isRTL ? "font-arabic" : "font-english"}`}
          >
            {isRTL ? "تسجيل دخول المدير" : "Admin Login"}
          </h2>
          <p
            className={`mt-2 text-luxury-black/60 ${isRTL ? "font-arabic" : "font-sans"}`}
          >
            {isRTL
              ? "قم بتسجيل الدخول لإدارة المنتجات"
              : "Sign in to manage products"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}
              >
                {isRTL ? "البريد الإلكتروني" : "Email"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-luxury-black/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-luxury-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent bg-luxury-white text-luxury-black"
                  placeholder={
                    isRTL ? "ادخل البريد الإلكتروني" : "Enter your email"
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium text-luxury-black mb-2 ${isRTL ? "font-arabic" : "font-sans"}`}
              >
                {isRTL ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-luxury-black/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-luxury-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent bg-luxury-white text-luxury-black"
                  placeholder={
                    isRTL ? "ادخل كلمة المرور" : "Enter your password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-luxury-black/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-luxury-black/40" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-luxury-white bg-luxury-gold hover:bg-luxury-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-luxury-white border-t-transparent rounded-full animate-spin"></div>
              ) : isRTL ? (
                "تسجيل الدخول"
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/"
              className={`text-luxury-gold hover:text-luxury-gold-dark font-medium ${isRTL ? "font-arabic" : "font-sans"}`}
            >
              {isRTL ? "العودة للموقع الرئيسي" : "Back to main site"}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
