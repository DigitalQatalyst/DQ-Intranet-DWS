import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Header';

/**
 * ProtectedRoute (ProtectedLayout equivalent)
 * 
 * Per Global_Authentication_v1.md spec Section 3.2:
 * - Wrap all authenticated content
 * - Show loading UI while auth resolves
 * - Redirect newJoiner → /onboarding
 * - Redirect unauthenticated users → /signin (app's login route)
 * - Prevent partial rendering until session is resolved
 */
const AUTO_LOGIN = false;

const ALLOWED_DOMAINS = ['@digitalqatalyst.com', '@dq.com', '@dq.lk'];

function isAllowedEmail(email?: string | null): boolean {
  if (!email) return false;
  const lower = email.toLowerCase();
  return ALLOWED_DOMAINS.some(domain => lower.endsWith(domain));
}

export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, userContext, isLoading } = useAuth();
  const location = useLocation();

  // While determining auth state, show loading message
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-dq-navy border-r-transparent"></div>
          <p className="text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to sign-in page
  if (!user) {
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Enforce DQ email domains
  if (!isAllowedEmail(user.email)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div className="max-w-xl">
          <h1 className="mb-4 text-2xl font-display font-semibold text-dq-navy">
            Access restricted
          </h1>
          <p className="mb-6 text-base text-gray-700">
            This workspace is only available to Digital Qatalyst accounts. Please sign in with
            your <span className="font-mono">@digitalqatalyst.com</span>,{' '}
            <span className="font-mono">@dq.com</span> or <span className="font-mono">@dq.lk</span>{' '}
            email.
          </p>
        </div>
      </div>
    );
  }

  // New Joiner: Redirect to onboarding (per DWS Authorization Design Spec)
  if (userContext?.segment === 'new_joiner') {
    // Allow access to onboarding routes, but redirect others
    const isOnboardingRoute = location.pathname.startsWith('/onboarding');
    if (!isOnboardingRoute) {
      return <Navigate to="/onboarding/start" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
