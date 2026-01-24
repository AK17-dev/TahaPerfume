import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Change this to your real admin email
  const ADMIN_EMAIL = "admin@tahaperfume.com";

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          const sessionUser = session?.user ?? null;

          setUser(sessionUser);

          // ✅ Only admin email is allowed
          setIsAdmin(!!sessionUser?.email && sessionUser.email === ADMIN_EMAIL);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        const sessionUser = session?.user ?? null;

        setUser(sessionUser);
        setIsAdmin(
          !!sessionUser?.email && sessionUser.email === ADMIN_EMAIL,
        );
        setLoading(false);
      });

      return () => data.subscription.unsubscribe();
    }
  }, []);

  // ✅ FIXED LOGIN FUNCTION (REAL SUPABASE AUTH SESSION)
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      if (!isSupabaseConfigured || !supabase) {
        return { error: "Supabase not configured" };
      }

      // ✅ Must sign in with Supabase Auth so Storage uploads work
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: normalizedPassword,
      });

      if (error) {
        return { error: error.message };
      }

      // ✅ Block non-admin emails
      if (data.user?.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        setUser(null);
        setIsAdmin(false);
        return { error: "Not authorized as admin" };
      }

      setUser(data.user);
      setIsAdmin(true);
      return {};
    } catch {
      return { error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }

      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
