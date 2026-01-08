import { AbilityBuilder, PureAbility, AbilityClass } from "@casl/ability";

export type Actions = "manage" | "create" | "read" | "update" | "delete" | "publish" | "approve" | "archive" | "moderate";
export type Subjects =
  | "Workspace"
  | "Service"
  | "Content"
  | "Community"
  | "Directory"
  | "Activity"
  | "Notification"
  | "User"
  | "Workflow"
  | "System"
  | "all";

export type AppAbility = PureAbility<[Actions, Subjects]>;

export interface UserContext {
  segment?: "employee" | "new_joiner" | "lead" | "hr" | "tech_support" | "platform_admin";
  roles?: string[];
  domain?: string;
  newJoiner?: boolean;
}

/**
 * Normalize a raw role string from the database into one of our progressive roles.
 * Falls back to "viewer" when the role is not recognized.
 */
export function normalizeRole(role: string | null | undefined): "viewer" | "contributor" | "approver" | "admin" {
  const value = (role || "").toLowerCase().trim();

  if (["admin", "system_admin", "platform_admin"].includes(value)) return "admin";
  if (["approver", "lead", "manager"].includes(value)) return "approver";
  if (["contributor", "editor", "content_publisher", "service_owner"].includes(value)) return "contributor";

  return "viewer";
}

/**
 * Builds CASL ability based on user segment and roles.
 * Accepts a nullable user context and falls back to a minimal viewer ability.
 */
export function buildAbility(user: UserContext | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility as AbilityClass<AppAbility>);
  const segment = user?.segment;
  const roles = user?.roles ?? [];
  const newJoiner = user?.newJoiner ?? false;

  // New Joiners: Restricted access until onboarding complete
  if (newJoiner || segment === "new_joiner") {
    can("read", "Workspace"); // Can access onboarding only
    cannot("create", "all");
    cannot("update", "all");
    cannot("delete", "all");
    cannot("publish", "all");
    cannot("approve", "all");
    cannot("moderate", "all");
    return build();
  }

  // No segment or invalid segment: no access
  if (!segment) {
    cannot("manage", "all");
    return build();
  }

  // Base viewer permissions for all segments
  can("read", "all");

  // Check for role-based permissions (progressive hierarchy)
  const roleSet = new Set(roles.map((r) => r.toLowerCase()));

  // Admin role (highest level)
  if (
    roleSet.has("system_admin") ||
    roleSet.has("admin") ||
    segment === "platform_admin"
  ) {
    can("manage", "all");
    return build();
  }

  // Approver role
  if (roleSet.has("approver") || segment === "lead") {
    can("approve", ["Content", "Workflow"]);
    can("moderate", "Community");
  }

  // Contributor roles (domain-scoped)
  const domain = user?.domain;

  if (
    roleSet.has("content_publisher") ||
    roleSet.has("contributor") ||
    roleSet.has("editor") ||
    segment === "hr" ||
    segment === "tech_support"
  ) {
    can("create", "Content", { domain });
    can("update", "Content", { domain });
  }

  if (roleSet.has("service_owner") || segment === "tech_support") {
    can("create", "Service");
    can("update", "Service");
    can("approve", "Service");
  }

  if (roleSet.has("community_moderator") || roleSet.has("moderator")) {
    can("moderate", "Community");
    can("approve", "Content");
  }

  if (roleSet.has("directory_maintainer")) {
    can("create", "Directory");
    can("update", "Directory");
  }

  // Content publishing (requires explicit publisher role)
  if (roleSet.has("content_publisher")) {
    can("publish", "Content");
    can("update", "Content"); // Unpublish is essentially an update action
  }

  // Default: all employees are viewers (read-only)
  // Edit permissions must be explicitly granted via roles

  return build();
}