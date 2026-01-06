import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { EventType, AuthenticationResult } from "@azure/msal-browser";
import { defaultLoginRequest } from "@/services/auth/msal";
import { api } from "@/lib/apiClient";
import type { AuthUser, AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthMeResponse {
  id: string;
  email: string;
  name: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  roles: string[];
  segment?: "employee" | "new_joiner" | "lead" | "hr" | "tech_support" | "platform_admin";
  newJoiner: boolean;
  employeeId?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      // Call logout API endpoint
      await api.post("/auth/logout", {}, { requireAuth: false });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always logout from MSAL
      const account = instance.getActiveAccount() || accounts[0];
      instance.logoutRedirect({ account });
    }
  }, [instance, accounts]);

  /**
   * Fetches user profile, roles, and newJoiner status from /api/auth/me
   */
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<AuthMeResponse>("/auth/me");
      
      // Validate email domain (internal DQ employees only)
      const email = response.email?.toLowerCase() || "";
      const isInternalEmail = email.endsWith("@dq.com") || email.endsWith("@dq.lk");
      
      if (!isInternalEmail && response.email) {
        console.error("External email domain not allowed:", response.email);
        await logout();
        return;
      }

      const authUser: AuthUser = {
        id: response.id,
        email: response.email,
        name: response.name,
        givenName: response.givenName,
        familyName: response.familyName,
        picture: response.picture,
        roles: response.roles || [],
        segment: response.segment || "employee",
        newJoiner: response.newJoiner || false,
        employeeId: response.employeeId,
      };

      setUser(authUser);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // If it's a 401 or "No access token" error, user is not authenticated
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("Authentication required") ||
          error.message.includes("No access token"))
      ) {
        setUser(null);
      }
      // Always set loading to false so UI can render
      setLoading(false);
    }
  }, [isAuthenticated, logout]);

  // Ensure active account is set
  useEffect(() => {
    const active = instance.getActiveAccount();
    if (!active && accounts.length === 1) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance, accounts]);

  // Handle MSAL events for account management
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        event.eventType === EventType.SSO_SILENT_SUCCESS
      ) {
        const payload = event.payload as AuthenticationResult | null;
        const account = payload?.account;
        if (account) {
          instance.setActiveAccount(account);
          // Fetch user profile after successful auth
          fetchUserProfile();
        }
      }
      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance, fetchUserProfile]);

  // Fetch user profile on mount and when auth state changes
  useEffect(() => {
    // Small delay to ensure MSAL redirect is fully processed
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        fetchUserProfile();
      } else {
        setUser(null);
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, fetchUserProfile]);

  const login = useCallback(async () => {
    try {
      await instance.loginRedirect(defaultLoginRequest);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, [instance]);

  // Role helpers
  const roleSet = useMemo(() => new Set(user?.roles.map((r) => r.toLowerCase()) || []), [user?.roles]);

  const isEmployee = useMemo(() => {
    return user !== null && !user.newJoiner;
  }, [user]);

  const isServiceOwner = useMemo(() => {
    return roleSet.has("service_owner") || roleSet.has("serviceowner");
  }, [roleSet]);

  const isContentPublisher = useMemo(() => {
    return (
      roleSet.has("content_publisher") ||
      roleSet.has("contentpublisher") ||
      roleSet.has("publisher")
    );
  }, [roleSet]);

  const isModerator = useMemo(() => {
    return (
      roleSet.has("community_moderator") ||
      roleSet.has("moderator") ||
      roleSet.has("communitymoderator")
    );
  }, [roleSet]);

  const isDirectoryMaintainer = useMemo(() => {
    return (
      roleSet.has("directory_maintainer") ||
      roleSet.has("directorymaintainer") ||
      roleSet.has("maintainer")
    );
  }, [roleSet]);

  const isSystemAdmin = useMemo(() => {
    return (
      roleSet.has("system_admin") ||
      roleSet.has("systemadmin") ||
      roleSet.has("admin") ||
      user?.segment === "platform_admin"
    );
  }, [roleSet, user?.segment]);

  const contextValue: AuthContextType = useMemo(
    () => ({
      user,
      roles: user?.roles || [],
      newJoiner: user?.newJoiner || false,
      loading,
      isEmployee,
      isServiceOwner,
      isContentPublisher,
      isModerator,
      isDirectoryMaintainer,
      isSystemAdmin,
      login,
      logout,
    }),
    [
      user,
      loading,
      isEmployee,
      isServiceOwner,
      isContentPublisher,
      isModerator,
      isDirectoryMaintainer,
      isSystemAdmin,
      login,
      logout,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
