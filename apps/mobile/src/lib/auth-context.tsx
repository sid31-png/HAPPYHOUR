import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Profile, UserPreference } from "@happyhour/types";
import { getSupabase } from "./supabase";
import { isSupabaseConfigured } from "./env";

interface AuthContextValue {
  isConfigured: boolean;
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    preferences: UserPreference[]
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  ensureProfile: (userId: string, preferences?: UserPreference[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const client = getSupabase();

  async function ensureProfile(userId: string, preferences?: UserPreference[]) {
    if (!client) return;
    const { data: existing } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (!existing) {
      const { data } = await client
        .from("profiles")
        .insert({ id: userId, preferences: preferences ?? [] })
        .select()
        .single();
      if (data) setProfile(data as Profile);
      return;
    }
    setProfile(existing as Profile);
  }

  async function refreshProfile() {
    if (!client || !session?.user) return;
    const { data } = await client.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }

  useEffect(() => {
    if (!client) {
      setLoading(false);
      return;
    }

    let mounted = true;

    client.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        void ensureProfile(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: subscription } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        void ensureProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signInWithEmail(email: string, password: string) {
    if (!client) return { error: "Supabase n'est pas configuré." };
    const { error } = await client.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUpWithEmail(email: string, password: string, preferences: UserPreference[]) {
    if (!client) return { error: "Supabase n'est pas configuré." };
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      await ensureProfile(data.user.id, preferences);
    }
    return { error: null };
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    setProfile(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured: isSupabaseConfigured,
      loading,
      session,
      profile,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      refreshProfile,
      ensureProfile,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, session, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  return ctx;
}
