
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

// ── Storage strategy ────────────────────────────────────────────────────────
// SESSION_KEY lives in sessionStorage (per-tab, never shared between tabs).
// This fixes the multi-tab / multi-role bug: each tab holds its own session
// independently so Tab-2 logging in as contractor can't stomp Tab-1's client
// session.
//
// TOKEN_KEY stays in localStorage so the same JWT is accessible to both the
// React app and any service workers. Tabs can legitimately share the same
// Supabase-issued JWT, so this is safe.
const SESSION_KEY = "buildspora_session";
const TOKEN_KEY   = "buildspora_token";

function readSession(): AuthUser | null {
  try {
    // Prefer sessionStorage (per-tab).
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as AuthUser;

    // Migration: if the user already has a session in localStorage from before
    // this fix, move it to sessionStorage so they aren't forced to re-login.
    const legacyRaw = localStorage.getItem(SESSION_KEY);
    if (legacyRaw) {
      const legacyUser = JSON.parse(legacyRaw) as AuthUser;
      sessionStorage.setItem(SESSION_KEY, legacyRaw);
      // Remove from localStorage so future tabs start fresh
      localStorage.removeItem(SESSION_KEY);
      return legacyUser;
    }
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
  return null;
}

function writeSession(user: AuthUser): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY); // also clear legacy key
}

// ── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession());
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for token removal in localStorage (e.g. logout from another tab).
  // sessionStorage changes DON'T fire storage events across tabs (by design),
  // so we only need to watch for the token being cleared to force logout here.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY && !e.newValue) {
        // Another tab logged out — clear this tab's session too
        sessionStorage.removeItem(SESSION_KEY);
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback((newUser: AuthUser, token: string) => {
    writeSession(newUser);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(newUser);
  }, []);

  const logout = async () => {
    await supabaseLogout();
    clearSession();
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const clearFirstLogin = () => {
    if (!user) return;
    const updated = { ...user, isFirstLogin: false };
    writeSession(updated);
    setUser(updated);
  };

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      writeSession(updated);
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