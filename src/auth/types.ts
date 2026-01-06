/**
 * Authentication and Authorization Types
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

export interface AuthUser extends UserProfile {
  roles: string[];
  segment?: "employee" | "new_joiner" | "lead" | "hr" | "tech_support" | "platform_admin";
  newJoiner: boolean;
  employeeId?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  roles: string[];
  newJoiner: boolean;
  loading: boolean;
  // Role helpers
  isEmployee: boolean;
  isServiceOwner: boolean;
  isContentPublisher: boolean;
  isModerator: boolean;
  isDirectoryMaintainer: boolean;
  isSystemAdmin: boolean;
  // Actions
  login: () => Promise<void>;
  logout: () => Promise<void>;
}
