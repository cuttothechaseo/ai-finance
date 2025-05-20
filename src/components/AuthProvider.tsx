"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserWithDetails } from "@/lib/auth";

interface AuthContextType {
  supabase: ReturnType<typeof createBrowserClient>;
  user: any;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  supabase: createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ),
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const useSupabase = () => {
  return useContext(AuthContext);
};

export const useUser = () => {
  const { user, loading, refreshUser } = useContext(AuthContext);
  return { user, loading, refreshUser };
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await getUserWithDetails();
      console.log("AuthProvider fetched userData:", userData);
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      fetchUser();
      if (session?.access_token !== undefined) {
        router.refresh();
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <AuthContext.Provider
      value={{ supabase, user, loading, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
