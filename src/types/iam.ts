/**
 * IAM Types - Unified Authorization Model
 * 
 * Based on DWS Authorization Design Specification v1.
 * Combines progressive roles, employee segments, responsibility roles,
 * and domain-scoped editing.
 */

// ============================================
// Employee Segments
// ============================================
// Segments define who the employee is

export type EmployeeSegment =
  | 'employee'      // Default DQ employees
  | 'new_joiner'    // Employees in onboarding
  | 'lead'          // Team/practice leads
  | 'hr'            // People & culture team
  | 'tech_support'  // Ops & internal IT
  | 'platform_admin'; // DWS owners

// ============================================
// Progressive Roles
// ============================================
// Roles define general capability level
// Progressive hierarchy: viewer -> contributor -> approver -> admin

export type UserRole =
  | 'viewer'      // Base: read only
  | 'contributor' // Viewer + create + update (domain-scoped)
  | 'approver'    // Contributor + approve
  | 'admin';      // Approver + publish + archive + delete + manage

// ============================================
// Responsibility Roles
// ============================================
// Specific capabilities (from CustomerApp spec)
// Users can have multiple responsibility roles

export type ResponsibilityRole =
  | 'content_publisher'    // Publish content
  | 'service_owner'       // Manage services
  | 'community_moderator' // Moderate discussions
  | 'directory_maintainer' // Maintain directory
  | 'system_admin';       // Platform control

// ============================================
// Content Domains
// ============================================
// Domain-scoped editing for contributors

export type ContentDomain =
  | 'HR'       // Human Resources domain
  | 'Services' // Services domain
  | 'Ops'      // Operations domain
  | string;    // Allow other domains for flexibility

// ============================================
// User Context
// ============================================
// Complete authorization context for a user

export interface UserContext {
  id: string;
  email: string;
  name?: string;
  progressiveRole: UserRole; // General capability level
  segment: EmployeeSegment;
  responsibilityRoles: ResponsibilityRole[]; // Specific capabilities (can have multiple)
  domain?: ContentDomain; // Only for contributors (HR, Tech Support)
}

// ============================================
// CASL Subject Types
// ============================================

export type Subject =
  | 'Content'    // Knowledge, guidelines, media
  | 'Service'    // Internal services & requests
  | 'Community'  // Discussions & events
  | 'Directory'  // People & roles
  | 'Workflow'   // Approval processes
  | 'User'       // Employee profiles
  | 'System'     // Platform configuration
  | 'Activity'   // Work & activity tracking
  | 'Notification' // Notifications
  | 'Workspace'  // Workspace access
  | 'all';       // Wildcard

// ============================================
// CASL Actions
// ============================================

export type Action =
  | 'manage'    // Full administrative control
  | 'create'    // Create new records
  | 'read'      // View content
  | 'update'    // Modify content
  | 'delete'    // Permanent removal
  | 'approve'   // Workflow approval
  | 'publish'   // Make content live
  | 'archive'   // Soft removal
  | 'flag'      // Mark for review
  | 'moderate'; // Moderate content

// ============================================
// Domain-scoped Content
// ============================================

export interface DomainScopedContent {
  domain?: ContentDomain;
}

