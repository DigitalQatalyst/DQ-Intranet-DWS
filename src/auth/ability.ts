import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import type {
  EmployeeSegment,
  ContentDomain,
  ResponsibilityRole,
  UserContext as IamUserContext,
} from '@/types/iam';

export type Actions =
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'approve'
  | 'archive'
  | 'flag'
  | 'moderate';

export type Subjects =
  | 'Workspace'
  | 'Service'
  | 'Content'
  | 'Community'
  | 'Directory'
  | 'Activity'
  | 'Notification'
  | 'User'
  | 'Workflow'
  | 'System'
  | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export interface AbilityUserContext {
  segment?: EmployeeSegment;
  roles?: string[];
  domain?: ContentDomain;
  newJoiner?: boolean;
}

/**
 * Normalize a raw role string from the database into one of our progressive roles.
 * Falls back to "viewer" when the role is not recognized.
 * 
 * Follows the progressive role hierarchy from DWS Authorization Design Spec v1:
 * viewer → contributor → approver → admin
 */
export function normalizeRole(
  role: string | null | undefined,
): 'viewer' | 'contributor' | 'approver' | 'admin' {
  const value = (role || '').toLowerCase().trim();

  // Admin (highest level)
  if (['admin', 'system_admin', 'platform_admin'].includes(value)) {
    return 'admin';
  }

  // Approver
  if (['approver', 'lead', 'manager'].includes(value)) {
    return 'approver';
  }

  // Contributor
  if (['contributor', 'editor'].includes(value)) {
    return 'contributor';
  }

  // Note: content_publisher, service_owner, etc. are responsibility roles,
  // not progressive roles. They don't map directly but may grant contributor-level access.

  // Default: viewer (base level)
  return 'viewer';
}

/**
 * Builds CASL ability based on progressive role hierarchy and employee segment.
 * Follows the DWS Authorization Design Spec v1:
 * - Progressive hierarchy: viewer → contributor → approver → admin
 * - Segment-based access control
 * - Domain-scoped editing for contributors
 */
export function buildAbility(user: AbilityUserContext | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  const segment = user?.segment;
  const roles = user?.roles ?? [];
  const newJoiner = user?.newJoiner ?? false;
  const domain = user?.domain;

  // New Joiners: Restricted access until onboarding complete
  if (newJoiner || segment === 'new_joiner') {
    can('read', 'Workspace'); // Can access onboarding only
    cannot('create', 'all');
    cannot('update', 'all');
    cannot('delete', 'all');
    cannot('publish', 'all');
    cannot('approve', 'all');
    cannot('moderate', 'all');
    cannot('archive', 'all');
    cannot('manage', 'all');
    return build();
  }

  // No segment: no access
  if (!segment) {
    cannot('manage', 'all');
    return build();
  }

  // Determine progressive role from roles array (prioritize explicit role over segment)
  // Priority: admin > approver > contributor > viewer
  const roleSet = new Set(roles.map(r => r.toLowerCase()));
  let progressiveRole: 'viewer' | 'contributor' | 'approver' | 'admin' = 'viewer';

  // First, check for explicit progressive role in roles array (from UserContext.progressiveRole)
  if (roleSet.has('admin') || roleSet.has('system_admin')) {
    progressiveRole = 'admin';
  } else if (roleSet.has('approver')) {
    progressiveRole = 'approver';
  } else if (roleSet.has('contributor') || roleSet.has('editor')) {
    progressiveRole = 'contributor';
  } else if (roleSet.has('viewer')) {
    progressiveRole = 'viewer';
  }
  // If no explicit role found, infer from segment (fallback)
  else if (segment === 'platform_admin') {
    progressiveRole = 'admin';
  } else if (segment === 'lead') {
    progressiveRole = 'approver';
  } else if (segment === 'hr' || segment === 'tech_support') {
    progressiveRole = 'contributor';
  }

  // Build permissions based on progressive role hierarchy (per spec)
  switch (progressiveRole) {
    case 'admin':
      // Admin = Approver + Publish + Archive + Delete + Manage
      // Includes all lower role permissions
      can('read', 'all');
      can('create', 'all');
      can('update', 'all');
      can('approve', 'all');
      can('publish', 'all');
      can('archive', 'all');
      can('delete', 'all');
      can('manage', 'all');
      can('moderate', 'all');
      can('flag', 'all');
      break;

    case 'approver':
      // Approver = Contributor + Approve
      // Includes all viewer and contributor permissions
      can('read', 'all');
      can('create', 'Content', { domain }); // Domain-scoped
      can('update', 'Content', { domain }); // Domain-scoped
      can('approve', ['Content', 'Workflow']);
      can('moderate', 'Community');
      break;

    case 'contributor':
      // Contributor = Viewer + Create + Update (domain-scoped)
      can('read', 'all');
      can('create', 'Content', { domain }); // Domain-scoped editing
      can('update', 'Content', { domain }); // Domain-scoped editing
      break;

    case 'viewer':
    default:
      // Viewer (base): Read only
      can('read', 'all');
      break;
  }

  // Segment-specific permissions (in addition to progressive role)
  if (segment === 'hr') {
    // HR segment: Can publish HR content
    can('publish', 'Content', { domain: 'HR' });
  }

  if (segment === 'tech_support') {
    // Tech Support: Can manage services
    can('create', 'Service');
    can('update', 'Service');
    can('approve', 'Service');
  }

  if (segment === 'lead') {
    // Leads: Already handled via approver role, but ensure moderation
    can('moderate', 'Community');
  }

  // Responsibility role-specific permissions (fine-grained capabilities)
  if (roleSet.has('content_publisher')) {
    can('publish', 'Content');
  }

  if (roleSet.has('service_owner')) {
    can('create', 'Service');
    can('update', 'Service');
    can('approve', 'Service');
  }

  if (roleSet.has('community_moderator') || roleSet.has('moderator')) {
    can('moderate', 'Community');
  }

  if (roleSet.has('directory_maintainer')) {
    can('create', 'Directory');
    can('update', 'Directory');
  }

  return build();
}

/**
 * Builds CASL ability from IAM UserContext.
 * Uses the progressiveRole directly from UserContext, following the spec.
 */
export function buildAbilityFromUserContext(user: IamUserContext | null): AppAbility {
  if (!user) {
    return buildAbility(null);
  }

  // Build roles array: progressiveRole is primary, responsibilityRoles are additional
  const roles: string[] = [user.progressiveRole];

  // Add responsibility roles for fine-grained permissions
  if (user.responsibilityRoles?.length) {
    roles.push(...user.responsibilityRoles);
  }

  return buildAbility({
    segment: user.segment,
    roles,
    domain: user.domain,
    newJoiner: user.segment === 'new_joiner',
  });
}