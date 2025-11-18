import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Associate, WorkUnit, WorkPosition } from "@/data/workDirectoryTypes";

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

// Mapper functions to convert snake_case DB fields to camelCase for UI
function mapWorkUnit(dbUnit: WorkUnit) {
  return {
    id: dbUnit.id,
    sector: dbUnit.sector,
    unitName: dbUnit.unit_name,
    unitType: dbUnit.unit_type,
    mandate: dbUnit.mandate,
    location: dbUnit.location,
    focusTags: dbUnit.focus_tags || [],
    bannerImageUrl: dbUnit.banner_image_url ?? null,
    department: deriveDepartmentFromUnitName(dbUnit.unit_name),
  };
}

function mapWorkPosition(dbPosition: WorkPosition) {
  return {
    id: dbPosition.id,
    positionName: dbPosition.position_name,
    roleFamily: dbPosition.role_family,
    department: dbPosition.department,
    unit: dbPosition.unit,
    sfiaRating: dbPosition.sfia_rating,
    contractType: dbPosition.contract_type,
    status: dbPosition.status,
    location: dbPosition.location,
    description: dbPosition.description,
    responsibilities: dbPosition.responsibilities || [],
    imageUrl: dbPosition.image_url ?? null,
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
    teamsLink: dbAssociate.teams_link,
    keySkills: dbAssociate.key_skills || [],
    bio: dbAssociate.bio,
    avatarUrl: dbAssociate.avatar_url ?? null,
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
        .select("*")
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
  const [positions, setPositions] = useState<ReturnType<typeof mapWorkPosition>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("work_positions")
        .select("*")
        .order("position_name", { ascending: true });

      if (fetchError) {
        console.error("Error fetching work positions:", fetchError);
        setError(fetchError.message);
        setPositions([]);
      } else {
        setPositions((data || []).map(mapWorkPosition));
      }
      setLoading(false);
    };

    fetchPositions();
  }, []);

  return { positions, loading, error };
}

