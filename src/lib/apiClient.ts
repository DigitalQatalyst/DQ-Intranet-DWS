/**
 * API Client without MSAL
 */

interface ApiClientOptions extends RequestInit {
  requireAuth?: boolean;
  retryOn401?: boolean;
}

class ApiClient {
  constructor() { }

  /**
   * Get dummy access token for API calls
   */
  private async getAccessToken(): Promise<string | null> {
    return "dummy-access-token";
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
      // Logic for real auth removed
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

    // Handle 401 Unauthorized - retry logic removed since no real token refresh
    if (response.status === 401 && retryOn401 && requireAuth) {
      // Just logout
      window.location.href = '/signin';
      throw new Error('Session expired. Please sign in again.');
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
export const apiClient = new ApiClient();
