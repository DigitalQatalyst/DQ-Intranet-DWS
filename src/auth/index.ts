/**
 * Authentication and Authorization Module
 * 
 * Exports:
 * - AuthContext and useAuth hook
 * - useAuthorization hook for permission checks
 * - ProtectedLayout component
 * - AbilityProvider for CASL integration
 * - Types and utilities
 */

export { AuthProvider, useAuth } from "./AuthContext";
export { useAuthorization } from "./useAuthorization";
export { ProtectedLayout } from "./ProtectedLayout";
export { AbilityProvider } from "./AbilityProvider";
export { AbilityContext } from "./AbilityContext";
export { buildAbility } from "./ability";
export type { AuthUser, AuthContextType } from "./types";
export type { AppAbility, Actions, Subjects } from "./ability";
