import { PublicClientApplication } from '@azure/msal-browser';
import { msalInstance } from '@/services/auth/msal';

/**
 * API Client with MSAL token attachment
 * 
 * Per Global_Authentication_v1.md spec Section 3.4:
 * - Attach Bearer token to all requests
 * - Retry once on 401 → silent refresh
 * - On repeat failure → logout + redirect
 * - Return 403 for RBAC failures
 * - Never store tokens in localStorage or query params
 */

interface ApiClientOptions extends RequestInit {
  requireAuth?: boolean;
  retryOn401?: boolean;
}

class ApiClient {
  private instance: PublicClientApplication;

  constructor(instance: PublicClientApplication) {
    this.instance = instance;
  }

  /**
   * Get MSAL access token for API calls
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      const account = this.instance.getActiveAccount();
      if (!account) {
        return null;
      }

      // Try to get token silently first
      const response = await this.instance.acquireTokenSilent({
        scopes: ['openid', 'profile', 'email'],
        account,
      });

      return response.accessToken;
    } catch (error) {
      console.error('Failed to acquire token:', error);
      return null;
    }
  }

  /**
   * Make authenticated API request
   */
  async request<T = any>(
    url: string,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const { requireAuth = true, retryOn401 = true, ...fetchOptions } = options;

    // Get access token if auth is required
    let accessToken: string | null = null;
    if (requireAuth) {
      accessToken = await this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available. Please sign in.');
      }
    }

    // Prepare headers
    const headers = new Headers(fetchOptions.headers);
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    headers.set('Content-Type', 'application/json');

    // Make request
    const makeRequest = async (): Promise<Response> => {
      return fetch(url, {
        ...fetchOptions,
        headers,
      });
    };

    let response = await makeRequest();

    // Handle 401 Unauthorized - retry once with token refresh
    if (response.status === 401 && retryOn401 && requireAuth) {
      try {
        // Try to refresh token
        const account = this.instance.getActiveAccount();
        if (account) {
          await this.instance.acquireTokenSilent({
            scopes: ['openid', 'profile', 'email'],
            account,
          });

          // Retry request with new token
          const newToken = await this.getAccessToken();
          if (newToken) {
            headers.set('Authorization', `Bearer ${newToken}`);
            response = await makeRequest();
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // On repeat failure, logout and redirect
        this.instance.logoutRedirect({
          postLogoutRedirectUri: window.location.origin + '/signin',
        });
        throw new Error('Session expired. Please sign in again.');
      }
    }

    // Handle 403 Forbidden (RBAC failure)
    if (response.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }

    // Handle other errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    // Parse and return response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text() as any;
  }

  /**
   * Convenience methods for common HTTP verbs
   */
  async get<T = any>(url: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T = any>(url: string, data?: any, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(url: string, data?: any, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(url: string, data?: any, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(url: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(msalInstance);
