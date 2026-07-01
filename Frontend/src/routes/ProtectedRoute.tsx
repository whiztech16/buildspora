import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardPath } from "../context/authHelpers";
import type { UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  /** The role this route is reserved for */
  role: UserRole;
  children: ReactNode;
}

/**
 * Guards a route so that:
 * 1. Unauthenticated users are redirected to /signin
 * 2. Authenticated users with the WRONG role are redirected to their own dashboard
 *    — preventing URL-twisting (e.g. a contractor visiting /dashboard/supplier)
 */
export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Still rehydrating session — render nothing to avoid flash
  if (isLoading) return null;

  // Not logged in → go to sign-in, remember where they wanted to go
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → silently redirect to their real dashboard
  if (user.role !== role) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }

  return <>{children}</>;
}
