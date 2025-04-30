"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

const AuthContext = createContext<{
  supabase: ReturnType<typeof createBrowserClient>;
}>({
  supabase: createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ),
});

export const useSupabase = () => {
  return useContext(AuthContext);
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

  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== undefined) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <AuthContext.Provider value={{ supabase }}>{children}</AuthContext.Provider>
  );
}
