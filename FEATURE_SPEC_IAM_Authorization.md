# IAM AUTHORIZATION FEATURE SPECIFICATION – DWS (DIGITAL WORK SPACE)

## 1. OVERVIEW

This specification defines feature-level authorization requirements for DWS (Digital Work Space), the internal employee platform used exclusively within DQ.

It translates the platform-wide IAM Authentication Specification and IAM Authorization Design Specification (DWS) into concrete authorization rules for employee-facing capabilities such as onboarding, internal services, knowledge, collaboration, work tracking, directory access, and platform settings.

Authorization is enforced consistently across:
- **Front-end (DWS UI)** using CASL for UI gating and action checks
- **Middleware / API layer** enforcing authoritative permission checks
- **Internal DWS data services** enforcing write, state, and lifecycle rules

All rules in this document assume the platform-wide IAM model defined in:
- `FEATURE_SPEC_Authentication_Module.md` (IAM Authentication Module Spec v1)
- IAM Authorization Design Spec v1 (DWS)

---

## 2. SCOPE

### Applies only to
- Authenticated internal DQ employees accessing DWS

### Covers authorization for
- Workspace access & onboarding lifecycle
- Internal service interaction
- Internal knowledge & content
- Collaboration & engagement
- Work & activity tracking
- Organizational directory
- Employee settings & platform administration

### Does not cover
- External platforms or client systems
- Partner or advisor tools
- Infrastructure-level IAM
- Non-DQ identities

---

## 3. ROLE & CLAIM MODEL – DWS

### 3.1 Segments & Eligibility

All users of DWS are internal identities authenticated via the DQ identity provider.

**Required claims:**
- `segment` = `new_joiner` | `employee` | `power_user` | `system_admin`
- `roles` = responsibility roles (see below)
- `user_id` = internal employee identifier

Users missing required claims must not receive access beyond an access-denied page.

### 3.2 DWS Responsibility Roles

Roles represent responsibilities, not employment status.

| Role Key | Description |
|----------|-------------|
| `viewer` | Default read-only access |
| `content_publisher` | Creates and manages internal content |
| `service_owner` | Manages internal service definitions |
| `community_moderator` | Moderates discussions and engagement |
| `directory_maintainer` | Maintains organizational directory data |
| `system_admin` | Full platform and IAM control |

**Important rule:**
- Being an existing employee does not grant edit permissions.
- Write access is granted only via responsibility roles.

### 3.3 Canonical Actions & Subjects

**Actions:**
- `read`, `create`, `update`, `delete`, `publish`, `approve`, `moderate`, `archive`, `manage`

**Subjects:**
- `Workspace`
- `Service`
- `Content`
- `Community`
- `Directory`
- `Activity`
- `Notification`
- `User`

### 3.4 Scoping Model

- Single organization (DQ only)
- No tenant or organization filters
- Authorization depends on employee lifecycle + roles

---

## 4. FEATURE-LEVEL AUTHORIZATION RULES

### 4.1 Workspace Access & Onboarding

#### 4.1.1 Feature Description
Controls access to DWS capabilities based on employee onboarding status.

#### 4.1.2 Access Rules

| # | Item | Detail |
|---|------|--------|
| 1 | App access pre-onboarding | Authenticated users can access onboarding only |
| 2 | Onboarding visibility | All users can read onboarding steps |
| 3 | Completing onboarding | Users can complete assigned steps |
| 4 | Override | Only `system_admin` can bypass onboarding |
| 5 | Post-onboarding | Other modules unlocked only after completion |

#### 4.1.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Enforcement | Middleware redirects `new_joiner` users |
| No bypass | No feature bypasses onboarding gates |

---

### 4.2 Internal Service Interaction

#### 4.2.1 Feature Description
Covers viewing and managing internal service definitions and workflows.

#### 4.2.2 Required Permissions per Action

| Action | Service Owner | Employee | Viewer |
|--------|---------------|----------|--------|
| View services | ✅ `read:Service` | ✅ | ✅ |
| Create service | ✅ `create:Service` | ❌ | ❌ |
| Edit service | ✅ `update:Service` | ❌ | ❌ |
| Approve service | ✅ `approve:Service` | ❌ | ❌ |
| Archive service | ❌ (admin only) | ❌ | ❌ |

#### 4.2.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Default | Employees are read-only |
| Ownership | Only owners/admins modify services |
| Audit | All changes logged |

---

### 4.3 Internal Knowledge & Content

#### 4.3.1 Feature Description
Controls internal documentation, guidance, announcements, and learning content.

#### 4.3.2 Required Permissions per Action

| Action | Publisher | Employee | Viewer |
|--------|-----------|----------|--------|
| View published content | ✅ | ✅ | ✅ |
| Create content | ✅ `create:Content` | ❌ | ❌ |
| Edit content | ✅ `update:Content` | ❌ | ❌ |
| Publish / unpublish | ✅ `publish:Content` | ❌ | ❌ |
| Archive content | ❌ (admin only) | ❌ | ❌ |

#### 4.3.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Read-only default | Employees cannot edit |
| Draft isolation | Drafts visible only to publishers/admins |
| Audit | Publish & archive actions logged |

---

### 4.4 Collaboration & Engagement

#### 4.4.1 Feature Description
Supports discussions, events, and feedback mechanisms.

#### 4.4.2 Required Permissions per Action

| Action | Moderator | Employee | Viewer |
|--------|-----------|----------|--------|
| View items | ✅ | ✅ | ✅ |
| Create posts / respond | ❌ | ✅ | ❌ |
| Moderate / remove | ✅ `moderate:Community` | ❌ | ❌ |

#### 4.4.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Moderation | Moderators approve/remove content |
| Logging | Moderation actions audited |

---

### 4.5 Work & Activity Tracking

#### 4.5.1 Feature Description
Tracks employee tasks, sessions, and work records.

#### 4.5.2 Required Permissions per Action

| Action | Employee | Viewer |
|--------|----------|--------|
| View activities | ✅ `read:Activity` | ✅ |
| Update own items | ✅ `update:Activity` | ❌ |

#### 4.5.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Ownership | Users update only assigned items |

---

### 4.6 Organizational Directory

#### 4.6.1 Feature Description
Provides visibility into people, roles, and organizational structure.

#### 4.6.2 Required Permissions per Action

| Action | Maintainer | Employee | Viewer |
|--------|------------|----------|--------|
| View directory | ✅ | ✅ | ✅ |
| Edit directory | ✅ `update:Directory` | ❌ | ❌ |

#### 4.6.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Restricted edits | Only maintainers/admins |
| Audit | All edits logged |

---

### 4.7 Settings & Administration

#### 4.7.1 Feature Description
Covers personal settings and platform administration.

#### 4.7.2 Required Permissions per Action

| Action | System Admin | Employee |
|--------|--------------|----------|
| View personal settings | ❌ | ✅ |
| Update personal settings | ❌ | ✅ |
| Manage platform config | ✅ `manage:Workspace` | ❌ |
| Assign roles | ✅ `manage:User` | ❌ |

#### 4.7.3 Behavioral Rules

| Item | Detail |
|------|--------|
| Separation | Employees cannot alter IAM or platform config |

---

## 5. FRONT-END AUTHORIZATION PATTERNS

### 5.1 Ability Construction

**Input:**
- `segment`
- `assigned roles`
- `onboarding status`

**Output:**
- CASL `AppAbility` instance

### 5.2 UI Gating Patterns

| Item | Detail |
|------|--------|
| Navigation | Render only if `can('read')` |
| Actions | Wrapped in `<Can>` |
| Read-only | Forms disabled where `update` not allowed |

---

## 6. API & MIDDLEWARE ENFORCEMENT

### 6.1 General Rules

| Item | Detail |
|------|--------|
| Claim validation | Invalid → 401/403 |
| Server enforcement | Ability rebuilt server-side |
| Audit | Critical actions logged |

### 6.2 Enforcement Points

**Middleware Layer:**
- Validates token and extracts claims
- Builds ability object from segment + roles
- Enforces route-level permissions
- Redirects unauthorized requests

**API Layer:**
- Re-validates permissions on each request
- Checks action + subject permissions
- Returns 401/403 for unauthorized actions
- Logs all permission checks and denials

**Data Service Layer:**
- Enforces write permissions on data mutations
- Validates ownership rules (e.g., own activities)
- Prevents unauthorized state changes
- Maintains audit trails

---

## 7. TESTING & ACCEPTANCE CRITERIA

### 7.1 Role Matrix Tests

**Required Tests:**
- Verify each role × action combination
- Confirm existing employees cannot edit content
- Verify power-user roles grant correct permissions
- Confirm system_admin has full access

**Test Scenarios:**
- Employee attempts to create service → denied
- Employee attempts to publish content → denied
- Employee attempts to moderate community → denied
- Service Owner creates service → allowed
- Content Publisher publishes content → allowed
- Community Moderator removes post → allowed

### 7.2 Lifecycle Tests

**New Joiner Flow:**
- New joiner authenticated → redirected to onboarding
- New joiner attempts to access workspace → blocked
- New joiner completes onboarding → access granted
- System admin accesses workspace → allowed (bypass)

**Role Updates:**
- User role changed → permissions updated on next request
- User role removed → permissions revoked immediately
- Multiple roles assigned → all permissions combined

### 7.3 Integration Tests

**Front-End + API Alignment:**
- UI gated action matches API permission check
- Navigation visibility matches route protection
- Disabled form fields match write permissions

**Multi-Layer Enforcement:**
- Middleware blocks unauthorized route access
- API returns 403 for unauthorized actions
- Data service prevents unauthorized writes

### 7.4 Acceptance Criteria

This specification is met when:

✅ **Unauthorized writes are impossible**
   - Employees cannot edit content without roles
   - Viewers cannot create or update resources
   - Only authorized roles can perform protected actions

✅ **UI and API rules are aligned**
   - UI gates match API permissions
   - Navigation reflects actual access
   - Disabled actions cannot be executed via API

✅ **Onboarding and role gates function correctly**
   - New joiners are redirected appropriately
   - Role changes take effect immediately
   - System admin bypass works correctly

✅ **Audit logging is comprehensive**
   - All permission checks are logged
   - Authorization failures are tracked
   - Role changes are audited

---

## SECTION 8 — IMPLEMENTATION GUIDELINES

### 8.1 CASL Integration

**Required Package:**
- `@casl/ability` - Core ability definition
- `@casl/react` - React integration hooks

**Ability Definition Pattern:**
```typescript
import { defineAbility } from '@casl/ability';

export function defineAppAbility(segment: string, roles: string[], onboardingComplete: boolean) {
  return defineAbility((can, cannot) => {
    // Base permissions
    if (onboardingComplete || segment === 'system_admin') {
      can('read', 'Workspace');
    }

    // Role-based permissions
    if (roles.includes('service_owner')) {
      can(['create', 'update', 'approve'], 'Service');
    }

    if (roles.includes('content_publisher')) {
      can(['create', 'update', 'publish'], 'Content');
    }

    if (roles.includes('community_moderator')) {
      can('moderate', 'Community');
    }

    if (roles.includes('directory_maintainer')) {
      can('update', 'Directory');
    }

    if (segment === 'system_admin') {
      can('manage', 'all');
    }

    // Restrictions
    if (segment === 'employee' && !roles.includes('service_owner')) {
      cannot('update', 'Service');
    }
  });
}
```

### 8.2 React Hook Integration

**useAuthorization Hook Extension:**
```typescript
import { useAbility } from '@casl/react';
import { useAuth } from '@/context/AuthContext';

export function useAuthorization() {
  const { user, roles, newJoiner } = useAuth();
  const ability = useAbility();

  return {
    can: (action: string, subject: string) => ability.can(action, subject),
    cannot: (action: string, subject: string) => ability.cannot(action, subject),
    // ... existing role helpers
  };
}
```

### 8.3 Component Gating Patterns

**Navigation Gating:**
```typescript
import { Can } from '@casl/react';

function Navigation() {
  return (
    <nav>
      <Can I="read" a="Service">
        <Link to="/services">Services</Link>
      </Can>
      <Can I="read" a="Content">
        <Link to="/knowledge">Knowledge</Link>
      </Can>
    </nav>
  );
}
```

**Action Gating:**
```typescript
import { Can } from '@casl/react';

function ServiceCard({ service }) {
  return (
    <div>
      <h3>{service.name}</h3>
      <Can I="update" a="Service">
        <Button onClick={handleEdit}>Edit</Button>
      </Can>
      <Can I="approve" a="Service">
        <Button onClick={handleApprove}>Approve</Button>
      </Can>
    </div>
  );
}
```

**Form Field Gating:**
```typescript
function ContentEditor() {
  const { can } = useAuthorization();

  return (
    <form>
      <input name="title" disabled={!can('update', 'Content')} />
      <Can I="publish" a="Content">
        <Button type="submit">Publish</Button>
      </Can>
    </form>
  );
}
```

### 8.4 API Permission Checks

**Middleware Pattern:**
```typescript
export async function checkPermission(
  req: Request,
  action: string,
  subject: string
): Promise<boolean> {
  const claims = extractClaims(req);
  const ability = defineAppAbility(
    claims.segment,
    claims.roles,
    !claims.new_joiner
  );
  return ability.can(action, subject);
}
```

**Route Protection:**
```typescript
export async function protectedRouteHandler(
  req: Request,
  res: Response,
  action: string,
  subject: string
) {
  const hasPermission = await checkPermission(req, action, subject);
  
  if (!hasPermission) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Continue with handler
}
```

---

## SECTION 9 — FILE STRUCTURE

### Recommended Organization

```
src/
  lib/
    ability/
      defineAbility.ts          # CASL ability definition
      types.ts                  # Action/Subject type definitions
  hooks/
    useAuthorization.ts         # Extended with CASL integration
  components/
    authorization/
      Can.tsx                   # CASL Can component wrapper
      Forbidden.tsx             # 403 error component
api/
  middleware/
    authMiddleware.ts           # Token validation & claim extraction
    permissionMiddleware.ts     # Permission checking middleware
  auth/
    permissions.ts              # Permission validation utilities
```

---

## SECTION 10 — EXECUTION RULES FOR CURSOR

1. **Install CASL dependencies**
   - Add `@casl/ability` and `@casl/react` to package.json

2. **Extend AuthContext**
   - Add ability construction based on segment + roles
   - Provide ability instance via context

3. **Create ability definition**
   - Implement `defineAppAbility()` following the pattern above
   - Map all roles to their permissions

4. **Update useAuthorization hook**
   - Integrate CASL `useAbility()` hook
   - Provide `can()` and `cannot()` helpers

5. **Implement UI gating**
   - Replace inline role checks with CASL `<Can>` components
   - Update navigation to use permission checks
   - Disable form fields based on permissions

6. **Add API enforcement**
   - Create permission checking middleware
   - Add permission validation to all protected routes
   - Return 403 for unauthorized actions

7. **Test thoroughly**
   - Verify all role × action combinations
   - Test new joiner gating
   - Verify UI and API alignment

---

## APPENDIX A — Permission Matrix Reference

### Complete Role × Action Matrix

| Subject | Action | Viewer | Employee | Service Owner | Content Publisher | Moderator | Directory Maintainer | System Admin |
|---------|--------|--------|----------|---------------|-------------------|-----------|---------------------|--------------|
| Workspace | read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Workspace | manage | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Service | read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Service | create | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Service | update | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Service | approve | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Service | archive | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Content | read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Content | create | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Content | update | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Content | publish | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Content | archive | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Community | read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Community | create | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Community | moderate | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Activity | read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Activity | update | ❌ | ✅* | ✅* | ✅* | ✅* | ✅* | ✅ |
| Directory | read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Directory | update | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| User | manage | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

*Activity updates limited to own items only

---

## APPENDIX B — Action & Subject Type Definitions

```typescript
export type Action =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'approve'
  | 'moderate'
  | 'archive'
  | 'manage';

export type Subject =
  | 'Workspace'
  | 'Service'
  | 'Content'
  | 'Community'
  | 'Directory'
  | 'Activity'
  | 'Notification'
  | 'User'
  | 'all';

export type Segment = 'new_joiner' | 'employee' | 'power_user' | 'system_admin';

export type Role =
  | 'viewer'
  | 'content_publisher'
  | 'service_owner'
  | 'community_moderator'
  | 'directory_maintainer'
  | 'system_admin';
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Status:** Draft — Ready for Implementation  
**Related Documents:**
- `FEATURE_SPEC_Authentication_Module.md` - Authentication foundation
- IAM Authorization Design Spec v1 (DWS) - Design patterns

