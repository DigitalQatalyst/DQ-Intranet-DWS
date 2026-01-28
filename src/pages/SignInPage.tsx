import { SVGProps, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Header";

type SignInPageProps = {
  redirectTo?: string;
};

/**
 * SignInPage (Microsoft SSO)
 * - Email "Next" triggers your magic link/OTP endpoint
 * - "Sign in with Microsoft" redirects to your OAuth start route
 * - Brand: #030F35 (navy), #FB5535 (accent)
 * Wire these endpoints:
 *   POST /api/auth/request-access   { email }
 *   GET  /api/auth/microsoft        (redirects to Microsoft OAuth)
 */

export default function SignInPage({ redirectTo = "/onboarding/start" }: SignInPageProps = {}) {
  const { user, isLoading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const candidate = params.get("redirect") ?? redirectTo;
    if (!candidate) return redirectTo;
    if (/^https?:\/\//i.test(candidate)) return redirectTo;
    return candidate.startsWith("/") ? candidate : redirectTo;
  }, [location.search, redirectTo]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isLoading, user, redirectTarget, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(115deg, #FF6A3D 0%, #B24B5A 35%, #2E3A6D 70%, #0C1E54 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <SignInCard redirectTarget={redirectTarget} />
      </div>
    </div>
  );
}

type SignInCardProps = {
  redirectTarget: string;
};

function SignInCard({ redirectTarget }: SignInCardProps) {
  const { login, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="bg-white/95 rounded-xl shadow-xl border border-black/5">
      <div className="p-6 sm:p-8">
        <div className="text-xs tracking-widest text-[#030F35] font-bold mb-2">
          DQ WORKSPACE
        </div>
        <h1 className="text-2xl font-semibold text-[#030F35]">Sign in</h1>
        <p className="text-sm text-gray-600 mt-1">
          Sign in to access <span className="font-medium">DQ Workspace</span>
        </p>
      </div>

      <div className="px-6 sm:px-8 pb-6">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              login();
              setTimeout(() => setLoading(false), 500); // Simulate network delay
            } catch (error) {
              console.error('Error calling login:', error);
              setLoading(false);
              setError('Sign in failed.');
            }
          }}
          disabled={loading || authLoading}
          className="w-full flex items-center justify-center gap-3 border-2 border-[#030F35] rounded-md bg-white py-3 hover:bg-[#030F35] hover:text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Signing in...' : 'Sign in (Developer Mode)'}</span>
        </button>
      </div>
    </div>
  );
}

function MicrosoftLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 23 23" aria-hidden="true" {...props}>
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="13" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="13" width="9" height="9" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}
