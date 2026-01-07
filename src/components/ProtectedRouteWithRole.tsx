import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Header';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * ProtectedRouteWithRole - Per Global_Authentication_v1.md spec Section 4
 * 
 * Protects routes that require specific roles (power-user and admin routes).
 * Must be used inside ProtectedRoute for authentication check first.
 * 
 * Example:
 * <ProtectedRoute>
 *   <ProtectedRouteWithRole requiredRole="service_owner">
 *     <ServiceManagementPage />
 *   </ProtectedRouteWithRole>
 * </ProtectedRoute>
 */
interface ProtectedRouteWithRoleProps {
  requiredRole: 'service_owner' | 'content_publisher' | 'moderator' | 'directory_maintainer' | 'system_admin';
  requiredRoles?: string[]; // Alternative: require any of these roles
}

export const ProtectedRouteWithRole: React.FC<PropsWithChildren<ProtectedRouteWithRoleProps>> = ({
  children,
  requiredRole,
  requiredRoles,
}) => {
  const { userContext, isServiceOwner, isContentPublisher, isModerator, isDirectoryMaintainer, isSystemAdmin } = useAuth();
  const location = useLocation();

  // Check if user has the required role
  const hasRequiredRole = (() => {
    if (requiredRoles) {
      // Check if user has any of the required roles
      return requiredRoles.some(role => {
        switch (role) {
          case 'service_owner':
            return isServiceOwner;
          case 'content_publisher':
            return isContentPublisher;
          case 'moderator':
          case 'community_moderator':
            return isModerator;
          case 'directory_maintainer':
            return isDirectoryMaintainer;
          case 'system_admin':
          case 'admin':
            return isSystemAdmin;
          default:
            return false;
        }
      });
    }

    // Check single required role
    switch (requiredRole) {
      case 'service_owner':
        return isServiceOwner;
      case 'content_publisher':
        return isContentPublisher;
      case 'moderator':
        return isModerator;
      case 'directory_maintainer':
        return isDirectoryMaintainer;
      case 'system_admin':
        return isSystemAdmin;
      default:
        return false;
    }
  })();

  if (!hasRequiredRole) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div className="max-w-xl">
          <h1 className="mb-4 text-2xl font-display font-semibold text-dq-navy">
            Access Denied
          </h1>
          <p className="mb-6 text-base text-gray-700">
            You do not have permission to access this page. This area requires{' '}
            <span className="font-semibold">{requiredRole.replace('_', ' ')}</span> role.
          </p>
          <p className="text-sm text-gray-500">
            If you believe you should have access, please contact your administrator.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-2 bg-dq-navy text-white rounded-md hover:bg-dq-navy-dark transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Convenience wrapper that includes both authentication and role checks
 */
export const ProtectedRouteWithAuthAndRole: React.FC<PropsWithChildren<ProtectedRouteWithRoleProps>> = ({
  children,
  requiredRole,
  requiredRoles,
}) => {
  return (
    <ProtectedRoute>
      <ProtectedRouteWithRole requiredRole={requiredRole} requiredRoles={requiredRoles}>
        {children}
      </ProtectedRouteWithRole>
    </ProtectedRoute>
  );
};

