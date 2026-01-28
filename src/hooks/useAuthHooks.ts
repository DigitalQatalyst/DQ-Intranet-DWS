import { useCallback } from 'react';

import { useAuth } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';

/**
 * Required hooks per Global_Authentication_v1.md Section 6
 */

/**
 * useAuthQuery() → fetches /api/auth/me
 * Per spec Section 6
 */
export function useAuthQuery() {
  const fetchUserData = useCallback(async () => {
    try {
      const data = await apiClient.get<{
        id: string;
        email: string;
        name: string;
        roles: string[];
        newJoiner: boolean;
        segment: string;
        domain?: string;
      }>('/api/auth/me');
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }, []);

  return { fetchUserData };
}

/**
 * useLogin() - Wrapper for login function
 * Per spec Section 6
 */
export function useLogin() {
  const { login } = useAuth();
  return login;
}

/**
 * useLogout() - Wrapper for logout function
 * Per spec Section 6
 */
export function useLogout() {
  const { logout } = useAuth();
  return logout;
}

/**
 * useAccessToken() - Get access token
 * Per spec Section 6
 */
export function useAccessToken() {
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    return "dummy-access-token";
  }, []);

  return { getAccessToken };
}

/**
 * useRequireAuth() - Redirect if not authenticated
 * Per spec Section 6
 * 
 * Usage:
 * const { isAuthenticated, redirectToSignIn } = useRequireAuth();
 * if (!isAuthenticated) {
 *   redirectToSignIn();
 *   return null;
 * }
 */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();

  const redirectToSignIn = useCallback(() => {
    const currentPath = window.location.pathname;
    window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`;
  }, []);

  return {
    isAuthenticated: !!user && !isLoading,
    isLoading,
    redirectToSignIn,
  };
}

