import { useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedLayoutProps {
  children: ReactNode;
  requireRoles?: string[];
  requireAnyRole?: string[];
}

/**
 * ProtectedLayout wraps authenticated routes
 * - Shows loading while auth resolves
 * - Redirects newJoiners to /onboarding
 * - Redirects unauthenticated users to /login
 * - Optionally enforces role-based access
 */
export function ProtectedLayout({
  children,
  requireRoles = [],
  requireAnyRole = [],
}: ProtectedLayoutProps) {
  const { user, loading, newJoiner, roles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // Don't redirect if already on login page
    if (location.pathname === "/login") {
      return;
    }

    // Not authenticated - redirect to login
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // New Joiner - redirect to onboarding
    if (newJoiner) {
      // Allow access to onboarding routes
      if (location.pathname.startsWith("/onboarding") || location.pathname.startsWith("/dashboard/onboarding")) {
        return;
      }
      navigate("/onboarding", { replace: true });
      return;
    }

    // Check role requirements (case-insensitive)
    if (requireRoles.length > 0) {
      const roleSet = new Set(roles.map((r) => r.toLowerCase()));
      const hasAllRoles = requireRoles.every((role) =>
        roleSet.has(role.toLowerCase())
      );
      if (!hasAllRoles) {
        navigate("/unauthorized", { replace: true });
        return;
      }
    }

    if (requireAnyRole.length > 0) {
      const roleSet = new Set(roles.map((r) => r.toLowerCase()));
      const hasAnyRole = requireAnyRole.some((role) =>
        roleSet.has(role.toLowerCase())
      );
      if (!hasAnyRole) {
        navigate("/unauthorized", { replace: true });
        return;
      }
    }
  }, [loading, user, newJoiner, roles, requireRoles, requireAnyRole, navigate, location]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  // Render children
  return <>{children}</>;
}
