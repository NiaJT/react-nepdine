import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";
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
  const navigate = useNavigate();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    // Guest-only logic
    if (guestOnly && user && localStorage.getItem("restaurant_id")) {
      navigate("/", { replace: true });
      return;
    }

    if (
      guestOnly &&
      user &&
      !localStorage.getItem("restaurant_id") &&
      !user.is_superadmin
    ) {
      navigate("/restaurants", { replace: true });
      return;
    }

    if (guestOnly && user && user.is_superadmin) {
      navigate("/superadmin/tenants", { replace: true });
      return;
    }

    // 🔒 Require auth
    if (requireAuth && !user) {
      navigate("/home", { replace: true });
      return;
    }

    // 🔒 Require superadmin
    if (requireSuperAdmin && (!user || !user.is_superadmin)) {
      navigate("/", { replace: true });
      return;
    }

    // 🔒 Block superadmins from tenant area
    if (blockSuperAdmin && user?.is_superadmin) {
      navigate("/superadmin/tenants", { replace: true });
      return;
    }

    // 🔒 Role-based guard
    if (requireRole && !user?.is_superadmin) {
      const allowedRoles = Array.isArray(requireRole)
        ? requireRole
        : [requireRole];

      if (!user?.role || !allowedRoles.includes(user.role)) {
        navigate("/tables", { replace: true });
        return;
      }
    }
  }, [
    user,
    loading,
    navigate,
    guestOnly,
    requireAuth,
    requireSuperAdmin,
    redirectAuthenticatedTo,
    requireRole,
    blockSuperAdmin,
  ]);

  // Wait until user state is known
  if (loading) return null;

  // Guest-only rendering
  if (guestOnly) {
    if (user) return null;
    return <>{children}</>;
  }

  // If auth required but no user → don’t render
  if (requireAuth && !user) return null;

  // Superadmin required
  if (requireSuperAdmin && (!user || !user.is_superadmin)) return null;

  // Role required
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
