# IAM AUTHORIZATION DESIGN SPECIFICATION v1 — DWS (DIGITAL WORK SPACE)

## OVERVIEW

This specification defines the complete Role-Based Access Control (RBAC) architecture for DWS (Digital Work Space). DWS is an internal-only platform used and managed exclusively by DQ employees.

The system uses CASL (Isomorphic Authorization Library) to provide type-safe, declarative authorization rules based on employee segments and functional roles.

DWS authorization ensures:
- Secure internal access
- Clear separation between consumption, contribution, approval, and administration
- No implicit permissions based on employment alone
- Domain-scoped editing instead of platform-wide privileges

---

## KEY DESIGN PRINCIPLES

1. **Progressive Role Hierarchy**: Each role includes all permissions from lower roles
2. **Employee Segmentation**: Authorization is based on employee responsibility, not job title
3. **Domain-Scoped Editing**: Edit rights are limited to owned domains (HR, Services, Ops)
4. **Internal-Only Access**: No external users, organizations, or tenants
5. **Database-Driven Authorization**: All authorization context comes from internal identity data
6. **Type-Safe Permissions**: CASL provides compile-time checking for actions and subjects

---

## DESIGN PHILOSOPHY

### Progressive Role Hierarchy

Roles are progressive and additive:

```
Viewer (base)
  ↓
Contributor = Viewer + Create + Update
  ↓
Approver = Contributor + Approve
  ↓
Admin = Approver + Publish + Archive + Delete + Manage
```

**Benefits:**
- Intuitive permission growth
- Clear separation of responsibility
- Prevents accidental over-permissioning
- Easy onboarding and role assignment

### Organization Scoping

DWS operates within a single internal organization (DQ).

- No multi-tenant or external organization scoping
- All users inherently belong to DQ
- Isolation is enforced by domain and responsibility, not organization

---

## SEGMENT-BASED ACCESS CONTROL

Segments define who the employee is, while roles define what they can do.

### Employee Segments

| Segment | Description | Scope | Special Rules |
|---------|-------------|-------|---------------|
| `employee` | Default DQ employees | Global read | Read-only by default |
| `new_joiner` | Employees in onboarding | Gated | Restricted until onboarding completion |
| `lead` | Team / practice leads | Review scope | Approval & moderation only |
| `hr` | People & culture team | HR domain | Can publish HR content only |
| `tech_support` | Ops & internal IT | Services domain | Edit operational content |
| `platform_admin` | DWS owners | Full | IAM & system control |

---

## USER SEGMENTS

### Employee (Default)

**Characteristics:**
- All active DQ employees post-onboarding
- Primary consumers of DWS

**Permission Scope:**
- Read all internal content
- Participate in discussions
- No edit, publish, approve, or admin rights

### New Joiner

**Characteristics:**
- Employees in onboarding lifecycle
- Temporary state

**Permission Scope:**
- Access onboarding resources only
- Restricted navigation
- No creation or approval actions

### Lead

**Characteristics:**
- Team, practice, or delivery leads
- Oversight responsibility

**Permission Scope:**
- Read all content
- Approve workflows and submissions
- Moderate discussions
- Cannot publish or manage IAM

### HR

**Characteristics:**
- People & culture team

**Permission Scope:**
- Create, edit, publish HR-related content
- Maintain people and policy records
- No access to technical or platform admin areas

### Tech Support

**Characteristics:**
- Internal IT, operations, and support teams

**Permission Scope:**
- Create and manage service-related content
- Maintain operational workflows
- No access to HR or IAM configuration

### Platform Admin

**Characteristics:**
- Small trusted group
- Platform owners

**Permission Scope:**
- Full system access
- IAM, RBAC, configuration, audits
- Override and emergency control

---

## ROLES

### Admin

**Progressive Permissions:**
- All Approver permissions
- Plus: publish, archive, delete, manage

```typescript
can('manage', 'all');
```

**Use Cases:**
- DWS system owners
- Security and platform administrators

### Approver

**Progressive Permissions:**
- All Contributor permissions
- Plus: approve

```typescript
can('approve', ['Content', 'Workflow']);
```

**Use Cases:**
- Leads
- Review authorities

### Contributor

**Progressive Permissions:**
- All Viewer permissions
- Plus: create, update (domain-scoped)

```typescript
can('create', ['Content']);
can('update', ['Content'], { domain });
```

**Use Cases:**
- HR contributors
- Tech support operators

### Viewer

**Base Permissions:**
- Read only

```typescript
can('read', 'all');
```

**Use Cases:**
- Majority of employees

### Role Normalization

```typescript
function normalizeRole(role: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    admin: 'admin',
    approver: 'approver',
    contributor: 'contributor',
    editor: 'contributor',
    viewer: 'viewer'
  };
  return roleMap[role.toLowerCase()] || 'viewer';
}
```

---

## CASL ABILITY SYSTEM

### Action Vocabulary

| Action | Description |
|--------|-------------|
| `manage` | Full administrative control |
| `create` | Create new records |
| `read` | View content |
| `update` | Modify content |
| `delete` | Permanent removal |
| `approve` | Workflow approval |
| `publish` | Make content live |
| `archive` | Soft removal |
| `flag` | Mark for review |

### Subject Types (DWS)

| Subject | Description |
|---------|-------------|
| `Content` | Knowledge, guidelines, media |
| `Service` | Internal services & requests |
| `Community` | Discussions & events |
| `Directory` | People & roles |
| `Workflow` | Approval processes |
| `User` | Employee profiles |
| `System` | Platform configuration |
| `all` | Wildcard |

### Ability Builder Function

```typescript
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

export type AppAbility = MongoAbility<[string, string]>;

export interface UserContext {
  role: 'admin' | 'approver' | 'contributor' | 'viewer';
  segment: 'employee' | 'new_joiner' | 'lead' | 'hr' | 'tech_support' | 'platform_admin';
  domain?: string;
  onboardingComplete: boolean;
}

export function buildAbility(user: UserContext): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  const { role, segment, domain, onboardingComplete } = user;

  // Base rule: require valid segment
  if (!segment) {
    cannot('manage', 'all');
    return build();
  }

  // New joiner restrictions
  if (segment === 'new_joiner' && !onboardingComplete) {
    can('read', 'Workspace', { status: 'onboarding' });
    cannot('create', 'all');
    cannot('update', 'all');
    return build();
  }

  // Platform admin: full access
  if (segment === 'platform_admin') {
    can('manage', 'all');
    return build();
  }

  // Role-based permissions (progressive hierarchy)
  switch (role) {
    case 'admin':
      // Admin inherits all lower-level permissions
      can('read', 'all');
      can('create', 'all');
      can('update', 'all');
      can('approve', 'all');
      can('publish', 'all');
      can('archive', 'all');
      can('delete', 'all');
      can('manage', 'all');
      break;

    case 'approver':
      // Approver inherits contributor permissions
      can('read', 'all');
      can('create', ['Content', 'Service', 'Community']);
      can('update', ['Content', 'Service', 'Community']);
      can('approve', ['Content', 'Workflow', 'Service']);
      can('moderate', 'Community');
      break;

    case 'contributor':
      // Contributor inherits viewer permissions
      can('read', 'all');
      // Domain-scoped editing
      if (domain) {
        can('create', ['Content', 'Service'], { domain });
        can('update', ['Content', 'Service'], { domain });
      }
      break;

    case 'viewer':
    default:
      // Base permissions: read only
      can('read', 'all');
      break;
  }

  // Segment-specific permissions
  if (segment === 'lead') {
    can('approve', ['Content', 'Workflow']);
    can('moderate', 'Community');
  }

  if (segment === 'hr') {
    can('create', ['Content', 'Directory'], { domain: 'hr' });
    can('update', ['Content', 'Directory'], { domain: 'hr' });
    can('publish', ['Content'], { domain: 'hr' });
  }

  if (segment === 'tech_support') {
    can('create', ['Service', 'Content'], { domain: 'ops' });
    can('update', ['Service', 'Content'], { domain: 'ops' });
  }

  // Restrictions
  // Employees without explicit roles cannot edit
  if (segment === 'employee' && role === 'viewer') {
    cannot('create', 'all');
    cannot('update', 'all');
    cannot('publish', 'all');
    cannot('approve', 'all');
  }

  // Only platform admins can manage IAM
  if (segment !== 'platform_admin') {
    cannot('manage', ['User', 'System']);
  }

  return build();
}
```

---

## PERMISSION RULES (KEY CONSTRAINTS)

### Critical Constraints

1. **Not every employee can edit**
   - Default employees are read-only
   - Edit permissions require explicit role assignment

2. **Leads are not admins**
   - Leads can approve and moderate
   - Cannot publish, archive, or manage IAM

3. **HR and Tech Support are domain-scoped**
   - HR can only edit HR domain content
   - Tech Support can only edit ops/services domain content

4. **Publishing is explicit**
   - Only contributors with domain scope or admins can publish
   - Publishing requires explicit `publish` permission

5. **Only Platform Admins manage IAM**
   - Role assignment restricted to platform admins
   - System configuration changes require platform admin

6. **New Joiners are lifecycle-restricted**
   - Restricted to onboarding resources
   - Cannot create or update content until onboarding complete

---

## SECURITY CONSIDERATIONS

### Defense-in-Depth

1. **UI checks are UX-only**
   - Client-side permission checks improve user experience
   - Never rely on UI checks for security

2. **API enforcement is mandatory**
   - All API endpoints must validate permissions server-side
   - Rebuild ability object from verified claims on each request

3. **No trust in client permissions**
   - Never accept permission claims from the client
   - Always extract permissions from verified identity tokens

4. **Defense-in-depth (UI + API + data)**
   - UI layer: Hides unauthorized actions
   - API layer: Rejects unauthorized requests
   - Data layer: Enforces constraints at database level

---

## IMPLEMENTATION ARCHITECTURE

### Frontend Implementation

**Ability Context Provider:**
```typescript
// src/context/AbilityContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { AppAbility, buildAbility } from '@/lib/ability/defineAbility';
import { useAuth } from '@/context/AuthContext';

const AbilityContext = createContext<AppAbility | undefined>(undefined);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const { user, roles, segment, newJoiner } = useAuth();

  const ability = useMemo(() => {
    if (!user || !segment) {
      return buildAbility({
        role: 'viewer',
        segment: 'employee',
        onboardingComplete: false,
      });
    }

    // Determine role from roles array (highest role wins)
    const role = determineRole(roles);

    return buildAbility({
      role,
      segment,
      domain: user.domain,
      onboardingComplete: !newJoiner,
    });
  }, [user, roles, segment, newJoiner]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbility must be used within AbilityProvider');
  }
  return context;
}

function determineRole(roles: string[]): 'admin' | 'approver' | 'contributor' | 'viewer' {
  if (roles.includes('system_admin')) return 'admin';
  if (roles.includes('service_owner') || roles.includes('content_publisher')) return 'approver';
  if (roles.includes('community_moderator') || roles.includes('directory_maintainer')) return 'contributor';
  return 'viewer';
}
```

**Integration with AuthContext:**
```typescript
// src/context/AuthContext.tsx
import { AbilityProvider } from './AbilityContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ... existing auth logic ...

  return (
    <AuthContext.Provider value={authValue}>
      <AbilityProvider>
        {children}
      </AbilityProvider>
    </AuthContext.Provider>
  );
}
```

### Backend Implementation

**Ability Builder Service:**
```typescript
// api/lib/ability.ts
import { buildAbility, UserContext } from '@/lib/ability/defineAbility';
import { extractClaims } from './authMiddleware';

export async function getAbilityFromRequest(req: Request): Promise<AppAbility> {
  const claims = await extractClaims(req);
  
  return buildAbility({
    role: claims.role || 'viewer',
    segment: claims.segment || 'employee',
    domain: claims.domain,
    onboardingComplete: !claims.new_joiner,
  });
}
```

**Permission Middleware:**
```typescript
// api/middleware/permissionMiddleware.ts
import { getAbilityFromRequest } from '@/lib/ability';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export function requirePermission(action: string, subject: string) {
  return async (req: VercelRequest, res: VercelResponse, next: () => void) => {
    try {
      const ability = await getAbilityFromRequest(req);
      
      if (!ability.can(action, subject)) {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: `Insufficient permissions: ${action} ${subject}`
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Failed to verify permissions'
      });
    }
  };
}
```

**Route Protection Example:**
```typescript
// api/services/create.ts
import { requirePermission } from '@/middleware/permissionMiddleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check permission
  await requirePermission('create', 'Service')(req, res, async () => {
    // Handler logic here
    // ...
  });
}
```

---

## TYPE DEFINITIONS

```typescript
// src/lib/ability/types.ts

export type Action =
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'publish'
  | 'archive'
  | 'moderate'
  | 'flag';

export type Subject =
  | 'Content'
  | 'Service'
  | 'Community'
  | 'Directory'
  | 'Workflow'
  | 'User'
  | 'System'
  | 'Workspace'
  | 'Activity'
  | 'all';

export type UserRole = 'admin' | 'approver' | 'contributor' | 'viewer';

export type UserSegment =
  | 'employee'
  | 'new_joiner'
  | 'lead'
  | 'hr'
  | 'tech_support'
  | 'platform_admin';

export interface UserContext {
  role: UserRole;
  segment: UserSegment;
  domain?: string;
  onboardingComplete: boolean;
}

export interface PermissionCheck {
  action: Action;
  subject: Subject;
  conditions?: Record<string, any>;
}
```

---

## TESTING STRATEGY

### Unit Tests

**Ability Builder Tests:**
```typescript
// tests/ability.test.ts
import { buildAbility } from '@/lib/ability/defineAbility';

describe('buildAbility', () => {
  it('viewer can read all', () => {
    const ability = buildAbility({
      role: 'viewer',
      segment: 'employee',
      onboardingComplete: true,
    });
    
    expect(ability.can('read', 'Content')).toBe(true);
    expect(ability.can('create', 'Content')).toBe(false);
  });

  it('new joiner is restricted', () => {
    const ability = buildAbility({
      role: 'viewer',
      segment: 'new_joiner',
      onboardingComplete: false,
    });
    
    expect(ability.can('read', 'Workspace')).toBe(true);
    expect(ability.can('create', 'Content')).toBe(false);
  });

  it('platform admin has full access', () => {
    const ability = buildAbility({
      role: 'admin',
      segment: 'platform_admin',
      onboardingComplete: true,
    });
    
    expect(ability.can('manage', 'all')).toBe(true);
  });

  it('hr segment can edit hr domain only', () => {
    const ability = buildAbility({
      role: 'contributor',
      segment: 'hr',
      domain: 'hr',
      onboardingComplete: true,
    });
    
    expect(ability.can('create', 'Content', { domain: 'hr' })).toBe(true);
    expect(ability.can('create', 'Content', { domain: 'ops' })).toBe(false);
  });
});
```

### Integration Tests

**Permission Enforcement Tests:**
- Verify API endpoints reject unauthorized requests
- Verify domain-scoped permissions are enforced
- Verify role hierarchy is respected

### E2E Tests

**User Flow Tests:**
- New joiner completes onboarding → permissions updated
- Employee assigned contributor role → can create content
- Lead approves content → workflow advances
- Platform admin assigns roles → permissions updated

---

## FILE STRUCTURE

```
src/
  lib/
    ability/
      defineAbility.ts          # Main ability builder function
      types.ts                  # Type definitions
      normalizeRole.ts          # Role normalization utility
  context/
    AbilityContext.tsx          # CASL ability context provider
    AuthContext.tsx             # Extended with ability integration
  hooks/
    useAuthorization.ts         # Extended with CASL integration
  components/
    authorization/
      Can.tsx                   # CASL Can component wrapper
      Forbidden.tsx             # 403 error component
api/
  lib/
    ability.ts                  # Server-side ability builder
  middleware/
    permissionMiddleware.ts     # Permission checking middleware
tests/
  ability.test.ts              # Ability builder unit tests
  permissions.test.ts          # Permission enforcement tests
docs/
  iam/
    DWS_IAM_GUIDE.md           # User-facing IAM guide
```

---

## REFERENCES

- **Source Files:**
  - `src/lib/ability/defineAbility.ts` - Ability builder implementation
  - `src/context/AuthContext.tsx` - Authentication context with ability integration
  - `src/lib/permissions.ts` - Permission utilities
  - `docs/iam/DWS_IAM_GUIDE.md` - User-facing documentation

- **Related Specifications:**
  - `FEATURE_SPEC_Authentication_Module.md` - Authentication foundation
  - `FEATURE_SPEC_IAM_Authorization.md` - Feature-level authorization rules

- **External Documentation:**
  - [CASL Documentation](https://casl.js.org/)
  - [CASL React Integration](https://casl.js.org/v6/en/package/casl-react)

---

## APPENDIX A — ROLE × SEGMENT MATRIX

| Segment | Viewer | Contributor | Approver | Admin |
|---------|--------|-------------|----------|-------|
| `employee` | ✅ Read only | ❌ Not assignable | ❌ Not assignable | ❌ Not assignable |
| `new_joiner` | ✅ Onboarding only | ❌ Restricted | ❌ Restricted | ❌ Restricted |
| `lead` | ✅ Read | ❌ Not typical | ✅ Approve + Moderate | ❌ Not typical |
| `hr` | ✅ Read | ✅ HR domain edit | ✅ HR publish | ❌ Not typical |
| `tech_support` | ✅ Read | ✅ Ops domain edit | ✅ Ops publish | ❌ Not typical |
| `platform_admin` | ❌ Not typical | ❌ Not typical | ❌ Not typical | ✅ Full access |

---

## APPENDIX B — SEGMENT × PERMISSION MATRIX

| Permission | Employee | New Joiner | Lead | HR | Tech Support | Platform Admin |
|------------|----------|------------|------|-----|--------------|----------------|
| Read all | ✅ | ✅ (onboarding) | ✅ | ✅ | ✅ | ✅ |
| Create content | ❌ | ❌ | ❌ | ✅ (HR domain) | ✅ (Ops domain) | ✅ |
| Update content | ❌ | ❌ | ❌ | ✅ (HR domain) | ✅ (Ops domain) | ✅ |
| Publish content | ❌ | ❌ | ❌ | ✅ (HR domain) | ✅ (Ops domain) | ✅ |
| Approve workflows | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Moderate community | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Manage directory | ❌ | ❌ | ❌ | ✅ (HR domain) | ❌ | ✅ |
| Manage IAM | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage system | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Status:** Draft — Ready for Implementation  
**Maintained By:** DWS Platform Team

