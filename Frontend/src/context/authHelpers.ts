import type { UserRole } from "./AuthContext";

/** Returns the correct dashboard path for a given role */
export function dashboardPath(role: UserRole): string {
  return `/dashboard/${role}`;
}

/** Derives initials from a full name or business name */
export function toInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
