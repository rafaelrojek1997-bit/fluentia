"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAccessToken } from "./api-client";

export type AuthUser = { id: string; email: string | null; status: string; locale: string; timeZone: string };
type AuthResponse = { accessToken: string; expiresIn: number; user: AuthUser };
type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const accept = (result: AuthResponse) => { setAccessToken(result.accessToken); setUser(result.user); };
  useEffect(() => {
    api.post<AuthResponse>("/auth/refresh").then(accept).catch(() => setAccessToken(null)).finally(() => setReady(true));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, ready,
    async login(email, password) { accept(await api.post<AuthResponse>("/auth/login", { email, password })); },
    async register(email, password) { accept(await api.post<AuthResponse>("/auth/register", { email, password, acceptedTermsVersion: "2026-08", acceptedPrivacyVersion: "2026-08" })); },
    async logout() { try { await api.post<void>("/auth/logout"); } finally { setAccessToken(null); setUser(null); } }
  }), [user, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth outside AuthProvider");
  return value;
}
