"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/guards/UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireSuperAdmin?: boolean;
  guestOnly?: boolean;
  redirectAuthenticatedTo?: string;
  requireRole?:
    | "admin"
    | "manager"
    | "waiter"
    | "cook"
    | ("admin" | "manager" | "waiter" | "cook")[];
  blockSuperAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth,
  requireSuperAdmin,
  guestOnly,
  redirectAuthenticatedTo,
  requireRole,
  blockSuperAdmin,
}) => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (guestOnly && user && localStorage.getItem("restaurant_id")) {
      router.replace("/"); //
    }
    if (
      guestOnly &&
      user &&
      !localStorage.getItem("restaurant_id") &&
      !user.is_superadmin
    ) {
      router.replace("/restaurants"); //
    }
    if (guestOnly && user && user.is_superadmin) {
      router.replace("/superadmin/tenants"); //
    }

    // 🔒 Require auth
    if (requireAuth && !user) {
      router.replace("/home");
      return;
    }

    // 🔒 Require superadmin
    if (requireSuperAdmin && (!user || !user.is_superadmin)) {
      router.replace("/");
      return;
    }

    // 🔒 Block superadmins from tenant area
    if (blockSuperAdmin && user?.is_superadmin) {
      router.replace("/superadmin/tenants");
      return;
    }

    // 🔒 Role-based guard
    if (requireRole && !user?.is_superadmin) {
      const allowedRoles = Array.isArray(requireRole)
        ? requireRole
        : [requireRole];

      if (!user?.role || !allowedRoles.includes(user.role)) {
        router.replace("/tables");
        return;
      }
    }
  }, [
    user,
    loading,
    router,
    guestOnly,
    requireAuth,
    requireSuperAdmin,
    redirectAuthenticatedTo,
    requireRole,
    blockSuperAdmin,
  ]);

  // Wait until user state is known
  if (loading) {
    // You can also render a spinner or skeleton here
    return null;
  }

  // Guest-only pages
  if (guestOnly) {
    if (user) return null;
    return <>{children}</>;
  }
  if (guestOnly) {
    if (!user) return <>{children}</>; // guest, render page
    // logged in → redirect to dashboard / fallback
    router.replace(redirectAuthenticatedTo || "/");
    return null;
  }

  // If auth required but no user → don’t render
  if (requireAuth && !user) return null;
  if (requireAuth && user?.is_superadmin) return null;
  // If superadmin required but user isn’t → don’t render
  if (requireSuperAdmin && (!user || !user.is_superadmin)) return null;

  // If role required but doesn’t match → don’t render
  if (
    requireRole &&
    !user?.is_superadmin &&
    (!user?.role ||
      !(Array.isArray(requireRole)
        ? requireRole.includes(user.role)
        : requireRole === user.role))
  ) {
    return null;
  }

  return <>{children}</>;
};
