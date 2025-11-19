import { supabaseClient } from '../lib/supabaseClient';
import type { Associate } from '../components/associates/AssociateCard';

/**
 * Fetch all associates from Supabase
 * Returns all required fields including phone and summary (if available in DB)
 */
export async function fetchAssociates(): Promise<Associate[]> {
  const { data, error } = await supabaseClient
    .from('work_associates')
    .select(
      'id, name, current_role, department, unit, location, sfia_rating, status, email, teams_link, phone, avatar_url, key_skills, summary, bio'
    )
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching associates:', error);
    throw new Error(`Failed to fetch associates: ${error.message}`);
  }

  // Map the data to match our Associate type
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    current_role: row.current_role,
    department: row.department,
    unit: row.unit,
    location: row.location,
    sfia_rating: row.sfia_rating,
    status: row.status,
    email: row.email,
    teams_link: row.teams_link,
    phone: row.phone ?? null,
    avatar_url: row.avatar_url ?? null,
    key_skills: Array.isArray(row.key_skills) ? row.key_skills : [],
    summary: row.summary ?? null,
    bio: row.bio,
  }));
}

/**
 * Fetch a single associate by ID
 */
export async function fetchAssociateById(id: string): Promise<Associate | null> {
  const { data, error } = await supabaseClient
    .from('work_associates')
    .select(
      'id, name, current_role, department, unit, location, sfia_rating, status, email, teams_link, phone, avatar_url, key_skills, summary, bio'
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching associate:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    current_role: data.current_role,
    department: data.department,
    unit: data.unit,
    location: data.location,
    sfia_rating: data.sfia_rating,
    status: data.status,
    email: data.email,
    teams_link: data.teams_link,
    phone: data.phone ?? null,
    avatar_url: data.avatar_url ?? null,
    key_skills: Array.isArray(data.key_skills) ? data.key_skills : [],
    summary: data.summary ?? null,
    bio: data.bio,
  };
}

