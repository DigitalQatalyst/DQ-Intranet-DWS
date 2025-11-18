import React from 'react';
import {
  Rocket,
  PenTool,
  Package,
  Server,
  Building2,
  Users,
  Wallet,
  Handshake,
  BarChart3,
  Box,
  ShieldCheck,
  Puzzle,
  FileText,
  Circle,
} from 'lucide-react';

/**
 * Returns the appropriate icon component for a given unit name
 * @param name - The unit name (e.g., "DQ Delivery – Deploys", "Factory – HRA (People)")
 * @returns A React component type for the icon
 */
export function getUnitIconForName(
  name: string
): React.ComponentType<{ className?: string }> {
  const normalized = name.toLowerCase();

  // Match patterns in order of specificity
  if (normalized.includes('deploys')) {
    return Rocket;
  }
  if (normalized.includes('designs')) {
    return PenTool;
  }
  if (normalized.includes('dbp delivery')) {
    return Package;
  }
  if (normalized.includes('dbp platform')) {
    return Server;
  }
  if (normalized.includes('dco operations')) {
    return Building2;
  }
  if (normalized.includes('hra') || normalized.includes('people')) {
    return Users;
  }
  if (normalized.includes('finance')) {
    return Wallet;
  }
  if (normalized.includes('deals')) {
    return Handshake;
  }
  if (normalized.includes('intelligence')) {
    return BarChart3;
  }
  if (normalized.includes('products')) {
    return Box;
  }
  if (normalized.includes('secdevops')) {
    return ShieldCheck;
  }
  if (normalized.includes('solutions')) {
    return Puzzle;
  }
  if (normalized.includes('stories')) {
    return FileText;
  }

  // Default fallback
  return Circle;
}

