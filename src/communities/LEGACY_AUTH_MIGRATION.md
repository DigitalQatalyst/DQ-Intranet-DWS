# Legacy AuthContext Migration Guide

## Status: Legacy (To Be Migrated)

The communities feature currently uses its own `AuthProvider` implementations that are separate from the main authentication system. These should eventually be migrated to use the centralized `AuthProvider` from `src/components/Header/context/AuthContext.tsx`.

## Legacy AuthContext Locations

1. `src/communities/contexts/AuthProvider.tsx` - Supabase-based auth for communities
2. `src/communities/components/Header/context/AuthContext.tsx` - MSAL-based auth (incomplete)
3. `src/communities/components/CommunitiesHeader/context/AuthContext.tsx` - Mock auth for demo

## Migration Plan

When ready to migrate:

1. Update all imports from `@/communities/contexts/AuthProvider` to `@/components/Header`
2. Replace `useAuth()` from communities with the main `useAuth()` hook
3. Update components to use the unified auth API
4. Remove legacy AuthProvider implementations

## Current State

- ✅ Main authentication system is complete and spec-compliant
- ⚠️ Communities feature uses separate auth (non-breaking)
- 📝 Migration can be done incrementally without breaking existing functionality

