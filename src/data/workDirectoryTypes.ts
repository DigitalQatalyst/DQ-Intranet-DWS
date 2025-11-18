// TypeScript types matching Supabase schema (snake_case column names)
export type WorkUnit = {
  id: string; // uuid
  sector: string; // text
  unit_name: string; // text
  unit_type: string; // text
  mandate: string; // text
  location: string; // text
  focus_tags: string[]; // jsonb
  banner_image_url?: string | null; // text
};

export type WorkPosition = {
  id: string; // uuid
  position_name: string; // text
  role_family: string; // text
  department: string; // text
  unit: string; // text
  location: string; // text
  sfia_rating: string; // text
  contract_type: string; // text
  status: string; // text
  description: string; // text
  responsibilities: string[]; // jsonb
  image_url?: string | null; // text
};

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
  teams_link: string; // text
  key_skills: string[]; // jsonb
  bio: string; // text
  avatar_url?: string | null; // text
};

