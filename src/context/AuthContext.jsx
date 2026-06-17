import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContextCore";

const missingConfigError = {
  message:
    "Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.",
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      isSupabaseConfigured,
      loading,
      session,
      user,
      signIn: ({ email, password }) => {
        if (!supabase) return { error: missingConfigError };
        return supabase.auth.signInWithPassword({ email, password });
      },
      signUp: ({ email, password, fullName }) => {
        if (!supabase) return { error: missingConfigError };
        return supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
      },
      signOut: () => {
        if (!supabase) return { error: missingConfigError };
        return supabase.auth.signOut();
      },
    }),
    [loading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
