import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

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
    const initializeUser = async () => {
      if (!supabase) {
        setUser(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initializeUser();

    if (!supabase) {
      return;
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
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
      // Disable email confirmation by setting email_confirm: true in options (if supported)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Remove redirect to disable email confirmation flow
          data: {
            name,
          },
        },
      });
      if (error) throw error;

      // Sign in the user to get session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      // Upsert user metadata into users table
      if (signInData?.user) {
        const { id, email } = signInData.user;
        const { error: upsertError } = await supabase.from("users").upsert([
          {
            id,
            email,
            created_at: new Date().toISOString(),
          },
        ]);
        if (upsertError) {
          console.error("Failed to upsert user metadata:", upsertError);
          throw upsertError; // Throw error to notify caller
        }
      }
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
