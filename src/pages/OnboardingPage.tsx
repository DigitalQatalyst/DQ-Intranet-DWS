import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

/**
 * Onboarding page - redirects new joiners here until onboarding is complete
 */
export function OnboardingPage() {
  const { newJoiner, loading } = useAuth();

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

  // If not a new joiner, redirect to dashboard
  if (!newJoiner) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to DWS
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Complete your onboarding to get started.
          </p>
          <div className="space-y-4">
            <p className="text-gray-700">
              Please complete the onboarding steps to access the full platform.
            </p>
            {/* TODO: Add onboarding steps/components here */}
            <div className="mt-8">
              <button
                onClick={() => window.location.href = "/dashboard/onboarding"}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Go to Onboarding Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
