import { ReactNode, useMemo } from "react";
import { AbilityContext } from "./AbilityContext";
import { buildAbility } from "./ability";
import { useAuth } from "./AuthContext";

/**
 * Provides CASL ability context that syncs with authentication state
 */
export function AbilityProvider({ children }: { children: ReactNode }) {
  const { user, roles, newJoiner, segment } = useAuth();

  const ability = useMemo(() => {
    return buildAbility({
      segment: segment || "employee",
      roles: roles || [],
      newJoiner: newJoiner || false,
    });
  }, [segment, roles, newJoiner]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
