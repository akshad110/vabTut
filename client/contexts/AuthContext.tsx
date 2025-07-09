import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === "vibhu123@gmail.com" && user?.id === "admin";

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email === "vibhu123@gmail.com" && password === "vibhu@123") {
      const adminUser = {
        id: "admin",
        email: "vibhu123@gmail.com",
        user_metadata: { name: "Admin" },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;
      setUser(adminUser);
      localStorage.setItem("admin_session", "true");
      return;
    }

    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } else {
      // Mock authentication for demo
      const mockUser = {
        id: "demo_user",
        email,
        user_metadata: { name: email.split("@")[0] },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;
      setUser(mockUser);
      localStorage.setItem("demo_session", JSON.stringify(mockUser));
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (error) throw error;
    } else {
      // Mock sign up for demo
      const mockUser = {
        id: "demo_user_" + Date.now(),
        email,
        user_metadata: { name },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;
      setUser(mockUser);
      localStorage.setItem("demo_session", JSON.stringify(mockUser));
    }
  };

  const signOut = async () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("demo_session");
    if (user?.id === "admin" || !supabase) {
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    if (localStorage.getItem("admin_session") === "true" && !user) {
      const adminUser = {
        id: "admin",
        email: "vibhu123@gmail.com",
        user_metadata: { name: "Admin" },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;
      setUser(adminUser);
    } else if (!supabase && !user) {
      const demoSession = localStorage.getItem("demo_session");
      if (demoSession) {
        try {
          const demoUser = JSON.parse(demoSession) as User;
          setUser(demoUser);
        } catch (e) {
          localStorage.removeItem("demo_session");
        }
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
