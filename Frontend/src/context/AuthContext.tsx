
import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { logout as supabaseLogout } from "../lib/supabase";

export type UserRole = "client" | "contractor" | "supplier";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  isFirstLogin: boolean;
  hasPin?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
  clearFirstLogin: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "buildspora_session";
const TOKEN_KEY = "buildspora_token";

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

  // Fetch fresh user data on mount to keep `hasPin` and other flags in sync
  useEffect(() => {
    if (user) {
      fetch("/api/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          updateUser({ hasPin: data.user.hasPin, name: data.user.fullName || data.user.name });
        }
      })
      .catch(() => {});
    }
  }, []);

  const login = useCallback((newUser: AuthUser, token: string) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(newUser);
  }, []);

  const logout = async () => {
    // Kill the Supabase server-side session first
    await supabaseLogout();
    // Then clear local state & storage
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const clearFirstLogin = () => {
    if (!user) return;
    const updated = { ...user, isFirstLogin: false };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout, clearFirstLogin, updateUser }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}