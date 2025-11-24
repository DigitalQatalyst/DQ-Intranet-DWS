// TypeScript types matching Supabase schema rows
export type WorkUnitRow = {
  id: string;
  slug: string;
  sector: string;
  unit_name: string;
  unit_type: string;
  mandate: string;
  location: string;
  focus_tags: string[] | null;
  priority_level?: string | null;
  priority_scope?: string | null;
  performance_status?: string | null;
  wi_areas?: string[] | null;
  banner_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export interface WorkUnit {
  id: string;
  slug: string;
  sector: string;
  unitName: string;
  unitType: string;
  mandate: string;
  location: string;
  focusTags: string[];
  priorityLevel?: string | null;
  priorityScope?: string | null;
  performanceStatus?: string | null;
  wiAreas?: string[];
  department?: string;
  bannerImageUrl?: string | null;
}

export type WorkPositionRow = {
  id: string;
  slug: string;
  position_name: string;
  role_family: string | null;
  department: string | null;
  unit: string | null;
  unit_slug: string | null;
  location: string | null;
  sfia_rating: string | null;
  sfia_level: string | null;
  contract_type: string | null;
  summary: string | null;
  description: string | null;
  responsibilities: string[] | null;
  expectations: string[] | null;
  image_url: string | null;
  status?: string | null;
  reports_to?: string | null;
  created_at?: string;
  updated_at?: string;
};

export interface WorkPosition {
  id: string;
  slug: string;
  positionName: string;
  roleFamily?: string | null;
  department?: string | null;
  unit?: string | null;
  unitSlug?: string | null;
  location?: string | null;
  sfiaRating?: string | null;
  sfiaLevel?: string | null;
  contractType?: string | null;
  summary?: string | null;
  description?: string | null;
  responsibilities: string[];
  expectations: string[];
  imageUrl?: string | null;
  status?: string | null;
  reportsTo?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type Associate = {
  id: string; // uuid
  name: string; // text
  current_role: string; // text
  department: string; // text
  unit: string; // text
  location: string; // text
  sfia_rating: string; // text
  status: string; // text
  email: string; // text
  phone?: string | null; // text
  years_experience?: number | null;
  teams_link: string; // text
  profile_image_url?: string | null; // text
  key_skills: string[]; // jsonb
  bio: string; // text
  avatar_url?: string | null; // text
};

export type EmployeeProfile = {
  id: string | null;
  full_name: string | null;
  role_title: string | null;
  unit: string | null;
  department: string | null;
  location: string | null;
  years_experience: number | null;
  status: string | null;
  sfia_level: string | null;
  bio: string | null;
  core_skills: string[] | null;
  key_attributes: string[] | null;
  tools_and_systems: string[] | null;
  qualifications: string[] | null;
  languages: string[] | null;
  hobbies: string[] | null;
  notable_achievements: string[] | null;
  email: string | null;
  phone: string | null;
  profile_image_url: string | null;
};
