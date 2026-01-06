import { msalInstance } from "@/services/auth/msal";

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || "";
  }

  /**
   * Gets the access token from MSAL, handling silent refresh on 401
   */
  private async getAccessToken(forceRefresh = false): Promise<string | null> {
    try {
      const account = msalInstance.getActiveAccount();
      if (!account) {
        return null;
      }

      const request = {
        scopes: ["openid", "profile", "email", "offline_access"],
        account,
        forceRefresh,
      };

      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      console.error("Failed to acquire token:", error);
      return null;
    }
  }

  /**
   * Makes an API request with automatic token attachment and 401 retry
   */
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { requireAuth = true, headers = {}, ...fetchOptions } = options;

    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Attach Bearer token if auth is required
    if (requireAuth) {
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error("No access token available");
      }
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
      });

      // Handle 401: Try refresh once, then fail
      if (response.status === 401 && requireAuth) {
        const refreshedToken = await this.getAccessToken(true);
        if (refreshedToken) {
          requestHeaders["Authorization"] = `Bearer ${refreshedToken}`;
          const retryResponse = await fetch(url, {
            ...fetchOptions,
            headers: requestHeaders,
          });

          if (!retryResponse.ok) {
            // Still 401 after refresh - need to re-authenticate
            if (retryResponse.status === 401) {
              // Don't redirect if we're already on login page to avoid loops
              if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
              }
              throw new Error("Authentication required");
            }
            throw new Error(
              `API request failed: ${retryResponse.status} ${retryResponse.statusText}`
            );
          }

          const text = await retryResponse.text();
          if (!text) {
            return {} as T;
          }
          return JSON.parse(text) as T;
        } else {
          // No token available - don't redirect if already on login
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          throw new Error("Authentication required");
        }
      }

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Forbidden: Insufficient permissions");
        }
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }

  get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

// For API routes, use relative paths (handled by Vercel)
export const api = new ApiClient("/api");
