import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Associate, WorkUnitRow, WorkUnit, WorkPosition, WorkPositionRow } from "@/data/workDirectoryTypes";
import { WORK_POSITION_COLUMNS, mapWorkPositionRow } from "@/api/workDirectory";

// Helper function to derive department from unit_name
function deriveDepartmentFromUnitName(unitName: string): string {
  // "Factory – X" → "X"
  if (unitName.startsWith('Factory – ')) {
    return unitName.replace('Factory – ', '');
  }
  // "DQ Sector – X" → "X"
  if (unitName.startsWith('DQ Sector – ')) {
    return unitName.replace('DQ Sector – ', '');
  }
  // "DQ Delivery – X" → "Delivery — X" (note: long dash)
  if (unitName.startsWith('DQ Delivery – ')) {
    return 'Delivery — ' + unitName.replace('DQ Delivery – ', '');
  }
  // Fallback: return the unit name as-is
  return unitName;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const UNIT_COLUMNS =
  "id, slug, sector, unit_name, unit_type, mandate, location, focus_tags, priority_level, priority_scope, performance_status, wi_areas, banner_image_url";

// Mapper functions to convert snake_case DB fields to camelCase for UI
function mapWorkUnit(dbUnit: WorkUnitRow): WorkUnit {
  const fallbackSlug = slugify(dbUnit.unit_name);
  const focusTags = Array.isArray(dbUnit.focus_tags) ? dbUnit.focus_tags : [];
  const wiAreas = Array.isArray(dbUnit.wi_areas) ? dbUnit.wi_areas : [];
  return {
    id: dbUnit.id,
    slug: dbUnit.slug || fallbackSlug,
    sector: dbUnit.sector,
    unitName: dbUnit.unit_name,
    unitType: dbUnit.unit_type,
    mandate: dbUnit.mandate,
    location: dbUnit.location,
    focusTags,
    priorityLevel: dbUnit.priority_level,
    priorityScope: dbUnit.priority_scope,
    performanceStatus: dbUnit.performance_status,
    wiAreas,
    bannerImageUrl: dbUnit.banner_image_url ?? null,
    department: deriveDepartmentFromUnitName(dbUnit.unit_name),
  };
}

function mapAssociate(dbAssociate: Associate) {
  return {
    id: dbAssociate.id,
    name: dbAssociate.name,
    currentRole: dbAssociate.current_role,
    department: dbAssociate.department,
    unit: dbAssociate.unit,
    location: dbAssociate.location,
    sfiaRating: dbAssociate.sfia_rating,
    status: dbAssociate.status,
    email: dbAssociate.email,
    phone: dbAssociate.phone ?? null,
    teamsLink: dbAssociate.teams_link,
    keySkills: dbAssociate.key_skills || [],
    bio: dbAssociate.bio,
    avatarUrl: dbAssociate.profile_image_url ?? dbAssociate.avatar_url ?? null,
    yearsExperience: dbAssociate.years_experience ?? null,
  };
}

export function useAssociates() {
  const [associates, setAssociates] = useState<ReturnType<typeof mapAssociate>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssociates = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("work_associates")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) {
        console.error("Error fetching associates:", fetchError);
        setError(fetchError.message);
        setAssociates([]);
      } else {
        setAssociates((data || []).map(mapAssociate));
      }
      setLoading(false);
    };

    fetchAssociates();
  }, []);

  return { associates, loading, error };
}

export function useWorkUnits() {
  const [units, setUnits] = useState<ReturnType<typeof mapWorkUnit>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("work_units")
        .select(UNIT_COLUMNS)
        .order("unit_name", { ascending: true });

      if (fetchError) {
        console.error("Error fetching work units:", fetchError);
        setError(fetchError.message);
        setUnits([]);
      } else {
        setUnits((data || []).map(mapWorkUnit));
      }
      setLoading(false);
    };

    fetchUnits();
  }, []);

  return { units, loading, error };
}

export function useWorkPositions() {
  const [positions, setPositions] = useState<WorkPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await supabase
          .from("work_positions")
          .select(WORK_POSITION_COLUMNS)
          .order("position_name", { ascending: true });

        if (fetchError) {
          console.error("Error fetching work positions:", fetchError);
          setError(fetchError.message);
          setPositions([]);
        } else {
          // Defensive: handle null/empty data
          if (!data || data.length === 0) {
            if (import.meta.env.DEV) {
              console.warn("[WorkPositions] No positions returned from Supabase");
            }
            setPositions([]);
          } else {
            // Map with null-safe handling
            const mapped = (data || [])
              .filter((row) => row != null) // Filter out null rows
              .map((row) => mapWorkPositionRow(row as WorkPositionRow))
              .filter((pos) => pos.id && pos.positionName); // Filter out invalid positions
            
            setPositions(mapped);
          }
        }
      } catch (err) {
        console.error("Unexpected error in useWorkPositions:", err);
        setError("Failed to load positions");
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  return { positions, loading, error };
}
