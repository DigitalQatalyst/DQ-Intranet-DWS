const PRIORITY_CLASS_MAP: Record<string, string> = {
  P0: "bg-rose-50 text-rose-700 border border-rose-100",
  P1: "bg-orange-50 text-orange-700 border border-orange-100",
  P2: "bg-amber-50 text-amber-700 border border-amber-100",
  P3: "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

const PERFORMANCE_CLASS_MAP: Record<string, string> = {
  problems: "bg-rose-50 text-rose-700 border border-rose-100",
  "major gaps": "bg-orange-50 text-orange-700 border border-orange-100",
  "some gaps": "bg-amber-50 text-amber-700 border border-amber-100",
  "on track": "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "tbc": "bg-slate-100 text-slate-700 border border-slate-200",
};

const DEFAULT_BADGE_CLASSES = "bg-slate-100 text-slate-700 border border-slate-200";

export const getPriorityLevelClasses = (priority?: string | null) => {
  if (!priority) return DEFAULT_BADGE_CLASSES;
  const key = priority.trim().slice(0, 2).toUpperCase();
  return PRIORITY_CLASS_MAP[key] ?? DEFAULT_BADGE_CLASSES;
};

export const getPerformanceStatusClasses = (status?: string | null) => {
  if (!status) return DEFAULT_BADGE_CLASSES;
  const normalized = status.trim().toLowerCase();
  return PERFORMANCE_CLASS_MAP[normalized] ?? DEFAULT_BADGE_CLASSES;
};

export const getPerformanceStyle = (status?: string | null) => {
  const normalized = (status || "").trim().toLowerCase();
  switch (normalized) {
    case "leading":
      return {
        pillClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        barGradient: "from-emerald-400 via-emerald-500 to-emerald-600",
      };
    case "on track":
    case "on_track":
      return {
        pillClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        barGradient: "from-emerald-400 via-emerald-500 to-emerald-600",
      };
    case "at risk":
    case "at_risk":
    case "off track":
    case "off_track":
      return {
        pillClass: "bg-amber-50 text-amber-700 border border-amber-200",
        barGradient: "from-amber-400 via-orange-500 to-rose-500",
      };
    default:
      return {
        pillClass: "bg-slate-50 text-slate-700 border border-slate-200",
        barGradient: "from-slate-300 via-slate-400 to-slate-500",
      };
  }
};
