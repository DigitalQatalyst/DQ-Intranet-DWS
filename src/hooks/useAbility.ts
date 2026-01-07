import { useContext, useMemo } from 'react';
import { AbilityContext } from '@/auth/AbilityContext';
import type { AppAbility, Actions, Subjects } from '@/auth/ability';
import { useAuth } from '@/components/Header';
import type { ResponsibilityRole } from '@/types/iam';

/**
 * Hook to access CASL ability from context.
 * Must be used within the global AuthProvider.
 */
export function useAppAbility(): AppAbility {
  const ability = useContext(AbilityContext);

  if (!ability) {
    throw new Error('useAppAbility must be used within an AuthProvider');
  }

  return ability;
}

/**
 * Hook to check if user can perform an action on a subject.
 */
export function useCan(action: Actions, subject: Subjects): boolean {
  const ability = useAppAbility();
  return ability.can(action, subject);
}

/**
 * Hook to check if user cannot perform an action on a subject.
 */
export function useCannot(action: Actions, subject: Subjects): boolean {
  const ability = useAppAbility();
  return ability.cannot(action, subject);
}

/**
 * useAuthorization hook - per Global_Authentication_v1.md spec
 * 
 * Must provide:
 * - hasRole(role: string): boolean
 * - hasAnyRole(roles: string[]): boolean
 * - isNewJoiner
 * - isEmployee
 * - isServiceOwner
 * - isContentPublisher
 * - isModerator
 * - isDirectoryMaintainer
 * - isSystemAdmin
 */
export function useAuthorization() {
  const { userContext, ability } = useAuth();

  const helpers = useMemo(() => {
    const roles = userContext?.responsibilityRoles || [];
    const roleSet = new Set(roles.map(r => r.toLowerCase()));

    return {
      hasRole: (role: string): boolean => {
        if (!userContext) return false;
        const normalizedRole = role.toLowerCase();
        // Check progressive role
        if (userContext.progressiveRole.toLowerCase() === normalizedRole) return true;
        // Check responsibility roles
        return roleSet.has(normalizedRole);
      },
      hasAnyRole: (roleList: string[]): boolean => {
        if (!userContext) return false;
        return roleList.some(role => {
          const normalizedRole = role.toLowerCase();
          if (userContext.progressiveRole.toLowerCase() === normalizedRole) return true;
          return roleSet.has(normalizedRole);
        });
      },
      isNewJoiner: userContext?.segment === 'new_joiner',
      isEmployee: userContext?.segment === 'employee' || userContext?.segment === undefined,
      isServiceOwner: roleSet.has('service_owner'),
      isContentPublisher: roleSet.has('content_publisher'),
      isModerator: roleSet.has('moderator') || roleSet.has('community_moderator'),
      isDirectoryMaintainer: roleSet.has('directory_maintainer'),
      isSystemAdmin: roleSet.has('system_admin') || userContext?.progressiveRole === 'admin' || userContext?.segment === 'platform_admin',
    };
  }, [userContext]);

  return {
    userContext,
    ability,
    ...helpers,
  };
}
