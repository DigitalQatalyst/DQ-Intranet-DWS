import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { buildAbilityFromUserContext } from '@/auth/ability';
import { AbilityContext } from '@/auth/AbilityContext';
import type {
  UserContext as IamUserContext,
  AppAbility,
} from '@/auth/ability';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  userContext: IamUserContext | null;
  ability: AppAbility;
  isLoading: boolean;
  roles: string[];
  newJoiner: boolean;
  isEmployee: boolean;
  isServiceOwner: boolean;
  isContentPublisher: boolean;
  isModerator: boolean;
  isDirectoryMaintainer: boolean;
  isSystemAdmin: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy user for development without MSAL
const DUMMY_USER: UserProfile = {
  id: 'dummy-user-id',
  name: 'DQ Developer',
  email: 'developer@digitalqatalyst.com',
  givenName: 'DQ',
  familyName: 'Developer',
};

const DUMMY_CONTEXT: IamUserContext = {
  id: 'dummy-user-id',
  email: 'developer@digitalqatalyst.com',
  name: 'DQ Developer',
  progressiveRole: 'admin', // Full access
  segment: 'employee',
  responsibilityRoles: [],
};

export function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userContext, setUserContext] = useState<IamUserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for persisted login
  useEffect(() => {
    const storedAuth = localStorage.getItem('dq_auth_dummy_session');
    if (storedAuth === 'true') {
      setUser(DUMMY_USER);
      setUserContext(DUMMY_CONTEXT);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(() => {
    localStorage.setItem('dq_auth_dummy_session', 'true');
    setUser(DUMMY_USER);
    setUserContext(DUMMY_CONTEXT);
  }, []);

  const signup = useCallback(() => {
    login(); // Just login for now
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('dq_auth_dummy_session');
    setUser(null);
    setUserContext(null);
    window.location.href = '/signin';
  }, []);

  const roles = useMemo(() => {
    if (!userContext) return [];
    const roleList: string[] = [userContext.progressiveRole];
    if (userContext.responsibilityRoles?.length) {
      roleList.push(...userContext.responsibilityRoles);
    }
    return roleList;
  }, [userContext]);

  const newJoiner = userContext?.segment === 'new_joiner';
  const roleSet = useMemo(() => new Set(roles.map(r => r.toLowerCase())), [roles]);

  const ability = useMemo(() => {
    try {
      return buildAbilityFromUserContext(userContext);
    } catch (error) {
      console.error('Error building ability:', error);
      return buildAbilityFromUserContext(null);
    }
  }, [userContext]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      userContext,
      ability,
      isLoading,
      roles,
      newJoiner,
      isEmployee: userContext?.segment === 'employee' || userContext?.segment === undefined,
      isServiceOwner: roleSet.has('service_owner'),
      isContentPublisher: roleSet.has('content_publisher'),
      isModerator: roleSet.has('moderator') || roleSet.has('community_moderator'),
      isDirectoryMaintainer: roleSet.has('directory_maintainer'),
      isSystemAdmin: roleSet.has('system_admin') || userContext?.progressiveRole === 'admin' || userContext?.segment === 'platform_admin',
      login,
      signup,
      logout,
    }),
    [user, userContext, ability, isLoading, roles, newJoiner, roleSet, login, signup, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
