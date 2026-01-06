import { useContext } from 'react';

import { AbilityContext, useAuth } from '@/components/Header/context/AuthContext';
import type { AppAbility, Actions, Subjects } from '@/auth/ability';

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
 * Hook to get enriched userContext and CASL ability.
 */
export function useAuthorization() {
  const { userContext, ability } = useAuth();
  return { userContext, ability };
}
