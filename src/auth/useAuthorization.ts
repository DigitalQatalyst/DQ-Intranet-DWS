import { useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";
import type { AppAbility } from "./ability";
import { buildAbility } from "./ability";

/**
 * Hook for checking authorization permissions
 * Uses CASL ability system for type-safe permission checks
 */
export function useAuthorization() {
  const { user, roles, newJoiner, segment } = useAuth();

  const ability: AppAbility = useMemo(() => {
    return buildAbility({
      segment: segment || "employee",
      roles: roles || [],
      newJoiner: newJoiner || false,
    });
  }, [segment, roles, newJoiner]);

  // Role check helpers
  const hasRole = useCallback(
    (role: string): boolean => {
      const roleSet = new Set(roles.map((r) => r.toLowerCase()));
      return roleSet.has(role.toLowerCase());
    },
    [roles]
  );

  const hasAnyRole = useCallback(
    (checkRoles: string[]): boolean => {
      return checkRoles.some((role) => hasRole(role));
    },
    [hasRole]
  );

  // Permission check helpers
  const can = useCallback(
    (action: string, subject: string): boolean => {
      return ability.can(action, subject);
    },
    [ability]
  );

  const cannot = useCallback(
    (action: string, subject: string): boolean => {
      return ability.cannot(action, subject);
    },
    [ability]
  );

  return {
    ability,
    hasRole,
    hasAnyRole,
    can,
    cannot,
    // Role flags
    isNewJoiner: newJoiner || false,
    isEmployee: user !== null && !newJoiner,
    isServiceOwner: hasRole("service_owner"),
    isContentPublisher: hasRole("content_publisher"),
    isModerator: hasRole("community_moderator") || hasRole("moderator"),
    isDirectoryMaintainer: hasRole("directory_maintainer"),
    isSystemAdmin: hasRole("system_admin") || hasRole("admin") || segment === "platform_admin",
  };
}
