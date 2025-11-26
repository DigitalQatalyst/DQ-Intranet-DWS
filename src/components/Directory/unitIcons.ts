import {
  BrainCircuit,
  BookOpenCheck,
  Cpu,
  Factory,
  Hexagon,
  PackageSearch,
  Puzzle,
  ShieldCheck,
  ShieldHalf,
  Truck,
  Users,
  Banknote,
} from "lucide-react";

export type UnitIconProps = {
  sector?: string | null;
  unitName: string;
};

export function getUnitIcon({ sector, unitName }: UnitIconProps) {
  const name = unitName.toLowerCase();
  const sec = (sector ?? "").toLowerCase();

  // 1) CoE / CEO Office / CoE Lead
  if (
    sec.includes("coe") ||
    sec.includes("ceo office") ||
    name.includes("coe | lead") ||
    name.includes("coë")
  ) {
    return ShieldCheck;
  }

  // 2) DBP Delivery units
  if (sec.includes("dbp delivery") || name.includes("delivery")) {
    return Truck;
  }

  // 3) DBP Platform units
  if (sec.includes("dbp platform") || name.includes("platform")) {
    return Cpu;
  }

  // 4) DCO Operations (sector + all DCO factories)
  if (sec.includes("dco operations") || name.includes("dco operations")) {
    return Factory;
  }

  // 5) Finance factory
  if (name.includes("factory – finance") || name.includes("factory - finance")) {
    return Banknote;
  }

  // 6) HRA (People) factory
  if (
    name.includes("factory – hra") ||
    name.includes("factory - hra") ||
    name.includes("people")
  ) {
    return Users;
  }

  // 7) Intelligence factory
  if (name.includes("factory – intelligence") || name.includes("intelligence")) {
    return BrainCircuit;
  }

  // 8) Products factory
  if (name.includes("factory – products") || name.includes("products")) {
    return PackageSearch;
  }

  // 9) SecDevOps factory
  if (name.includes("factory – secdevops") || name.includes("secdevops")) {
    return ShieldHalf;
  }

  // 10) Solutions factory
  if (name.includes("factory – solutions") || name.includes("solutions")) {
    return Puzzle;
  }

  // 11) Stories factory
  if (name.includes("factory – stories") || name.includes("stories")) {
    return BookOpenCheck;
  }

  // Default neutral icon
  return Hexagon;
}
