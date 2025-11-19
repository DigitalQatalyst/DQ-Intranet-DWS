import { supabase } from "@/lib/supabaseClient";
import type { WorkPositionRow, WorkPosition } from "@/data/workDirectoryTypes";

export const WORK_POSITION_COLUMNS =
  "id, slug, position_name, role_family, department, unit, unit_slug, location, sfia_rating, sfia_level, contract_type, summary, description, responsibilities, expectations, image_url, status, reports_to, created_at, updated_at";

export const mapWorkPositionRow = (row: WorkPositionRow): WorkPosition => {
  // Debug logging in development only
  if (import.meta.env.DEV) {
    const missingFields: string[] = [];
    if (!row?.id) missingFields.push('id');
    if (!row?.slug) missingFields.push('slug');
    if (!row?.position_name) missingFields.push('position_name');
    if (!row?.image_url) missingFields.push('image_url');
    if (!row?.description && !row?.summary) missingFields.push('description/summary');
    
    if (missingFields.length > 0) {
      console.warn(`[WorkPosition] Missing fields for position ${row?.id || 'unknown'}:`, missingFields);
    }
  }

  return {
    id: row?.id || '',
    slug: row?.slug || '',
    positionName: row?.position_name || 'TBC',
    roleFamily: row?.role_family ?? null,
    department: row?.department ?? null,
    unit: row?.unit ?? null,
    unitSlug: row?.unit_slug ?? null,
    location: row?.location ?? null,
    sfiaRating: row?.sfia_rating ?? null,
    sfiaLevel: row?.sfia_level ?? null,
    contractType: row?.contract_type ?? null,
    summary: row?.summary ?? null,
    description: row?.description ?? null,
    responsibilities: Array.isArray(row?.responsibilities) ? row.responsibilities : [],
    expectations: Array.isArray(row?.expectations) ? row.expectations : [],
    imageUrl: row?.image_url ?? null,
    status: row?.status ?? null,
    reportsTo: row?.reports_to ?? null,
    createdAt: row?.created_at,
    updatedAt: row?.updated_at,
  };
};

export async function getWorkPositionBySlug(slug: string): Promise<WorkPosition | null> {
  try {
    if (!slug) {
      if (import.meta.env.DEV) {
        console.warn("[WorkPosition] getWorkPositionBySlug called with empty slug");
      }
      return null;
    }

    const { data, error } = await supabase
      .from("work_positions")
      .select(WORK_POSITION_COLUMNS)
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Failed to fetch work position by slug", slug, error);
      return null;
    }

    if (!data) {
      if (import.meta.env.DEV) {
        console.warn("[WorkPosition] No data returned for slug:", slug);
      }
      return null;
    }

    return mapWorkPositionRow(data as WorkPositionRow);
  } catch (err) {
    console.error("Unexpected error fetching work position by slug", slug, err);
    return null;
  }
}
