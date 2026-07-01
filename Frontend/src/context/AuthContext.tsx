/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserRole = "client" | "contractor" | "supplier";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  /** True only on the very first session after signup */
  isFirstLogin: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  clearFirstLogin: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "buildspora_session";

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    return null;
  });
  const [isLoading] = useState(false);

  const login = useCallback((newUser: AuthUser) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  /**
   * Called once after the user has seen their "Welcome to BuildSpora!" greeting.
   * Clears the first-login flag so it never shows again.
   */
  const clearFirstLogin = () => {
    if (!user) return;
    const updated = { ...user, isFirstLogin: false };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  const value = useMemo(
    () => ({ user, isLoading, login, logout, clearFirstLogin }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

