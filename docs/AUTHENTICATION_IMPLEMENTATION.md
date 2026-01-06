# Authentication & Authorization Implementation Summary

## Overview

This document summarizes the authentication and authorization implementation for DWS (Digital Work Space) following the specifications provided.

## What Was Implemented

### 1. Azure Entra ID Integration
- ✅ Updated MSAL configuration for Azure Entra ID (removed B2C patterns)
- ✅ Configured for internal DQ employees only (@dq.com, @dq.lk domains)
- ✅ Token handling with automatic refresh on 401 errors

### 2. Unified Authentication Context
- ✅ Created `src/auth/AuthContext.tsx` with:
  - User profile management
  - Role-based access control helpers
  - New joiner detection
  - Login/logout functionality
  - Integration with `/api/auth/me` endpoint

### 3. CASL Authorization System
- ✅ Installed `@casl/ability` and `@casl/react`
- ✅ Created ability builder with progressive role hierarchy:
  - Viewer (base read-only)
  - Contributor (create/update domain-scoped)
  - Approver (approve workflows)
  - Admin (full platform access)
- ✅ Role-based permission checks

### 4. Authorization Hooks
- ✅ `useAuthorization()` hook for permission checks
- ✅ Role helpers: `isServiceOwner`, `isContentPublisher`, `isModerator`, etc.
- ✅ Permission checks: `can()`, `cannot()`, `hasRole()`, `hasAnyRole()`

### 5. Protected Routes
- ✅ `ProtectedLayout` component for route protection
- ✅ New joiner redirect to onboarding
- ✅ Role-based route protection
- ✅ Unauthorized page for 403 errors

### 6. API Routes
- ✅ `GET /api/auth/me` - Returns user profile, roles, and newJoiner status
- ✅ `POST /api/auth/logout` - Clears server-side sessions

### 7. API Client
- ✅ `src/lib/apiClient.ts` with:
  - Automatic Bearer token attachment
  - 401 retry with token refresh
  - Automatic redirect to login on auth failure
  - Proper error handling

### 8. Routing Updates
- ✅ Updated `AppRouter.tsx` to use `ProtectedLayout` for all authenticated routes
- ✅ Added `/login` route
- ✅ Added `/unauthorized` route
- ✅ Added `/onboarding` route for new joiners
- ✅ Protected routes:
  - `/marketplace/*`
  - `/services/*`
  - `/communities/*`
  - `/work/*`
  - `/directory/*`
  - `/knowledge/*`
  - `/media/*`
  - `/dashboard/*`
- ✅ Role-protected routes:
  - `/services/manage/*` (service_owner)
  - `/media/admin/*` (content_publisher)
  - `/knowledge/manage/*` (content_publisher)
  - `/communities/moderation/*` (community_moderator)
  - `/directory/manage/*` (directory_maintainer)
  - `/admin/*` (system_admin)

## File Structure

```
src/
  auth/
    ├── AuthContext.tsx          # Unified auth context
    ├── useAuthorization.ts      # Authorization hook
    ├── ProtectedLayout.tsx      # Route protection component
    ├── AbilityProvider.tsx      # CASL ability provider
    ├── AbilityContext.tsx       # CASL context
    ├── ability.ts               # CASL ability builder
    ├── types.ts                 # Auth types
    └── index.ts                 # Module exports

  lib/
    └── apiClient.ts             # API client with token handling

  pages/
    ├── LoginPage.tsx            # Login page
    ├── UnauthorizedPage.tsx     # 403 error page
    └── OnboardingPage.tsx       # New joiner onboarding

api/
  auth/
    ├── me.ts                    # GET /api/auth/me
    └── logout.ts                # POST /api/auth/logout
```

## Environment Variables Required

```env
# Azure Entra ID Configuration
VITE_AZURE_CLIENT_ID=a18ef318-8e19-4904-9036-cd0368a128cb
VITE_AZURE_TENANT_ID=199ebd0d-2986-4f3d-8659-4388c5b2a724

# Optional
VITE_AZURE_REDIRECT_URI=http://localhost:3004
VITE_AZURE_POST_LOGOUT_REDIRECT_URI=http://localhost:3004
VITE_MSAL_ENABLE_GRAPH_FALLBACK=false
```

## User Roles & Segments

### Segments
- `employee` - Default DQ employees
- `new_joiner` - Employees in onboarding
- `lead` - Team/practice leads
- `hr` - People & culture team
- `tech_support` - IT/operations
- `platform_admin` - DWS system owners

### Roles
- `viewer` - Read-only access (default)
- `content_publisher` - Create/edit/publish content
- `service_owner` - Manage services
- `community_moderator` - Moderate discussions
- `directory_maintainer` - Edit directory
- `system_admin` - Full platform access

## Usage Examples

### Using Auth Context
```tsx
import { useAuth } from "@/auth";

function MyComponent() {
  const { user, roles, newJoiner, isServiceOwner, login, logout } = useAuth();
  
  if (newJoiner) {
    return <div>Please complete onboarding</div>;
  }
  
  return <div>Welcome, {user?.name}</div>;
}
```

### Using Authorization Hook
```tsx
import { useAuthorization } from "@/auth";

function AdminPanel() {
  const { can, isSystemAdmin } = useAuthorization();
  
  if (!can("manage", "System")) {
    return <div>Access Denied</div>;
  }
  
  return <div>Admin Panel</div>;
}
```

### Protected Routes
```tsx
<Route
  path="/admin/*"
  element={
    <ProtectedLayout requireRoles={["system_admin"]}>
      <AdminDashboard />
    </ProtectedLayout>
  }
/>
```

## Next Steps / TODO

1. **Azure Entra ID Configuration**
   - Configure app roles in Azure Entra ID
   - Ensure roles are included in token claims
   - Test token validation in `/api/auth/me`

2. **Database Integration**
   - Store user roles in database (if not in Azure AD)
   - Track onboarding completion status
   - Implement role assignment/admin interface

3. **Cleanup**
   - Remove old `AuthContext` implementations:
     - `src/components/Header/context/AuthContext.tsx`
     - `src/communities/components/Header/context/AuthContext.tsx`
     - `src/communities/components/CommunitiesHeader/context/AuthContext.tsx`
   - Update components that use old auth hooks

4. **Testing**
   - Test login/logout flows
   - Test role-based access control
   - Test new joiner onboarding redirect
   - Test 401 token refresh

5. **Onboarding Flow**
   - Implement onboarding completion tracking
   - Update user status after onboarding

## Notes

- All authentication follows the specifications provided
- Internal-only access enforced via email domain validation
- Progressive role hierarchy implemented
- CASL provides type-safe permission checks
- Token refresh handled automatically
- New joiners automatically redirected to onboarding

## Support

For issues or questions, refer to:
- `Global_Authentication_v1.md`
- `Global_Authorization_CustomerApp_Spec_v1.md`
- `Global_Authorization_Design_Spec_v1.md`
