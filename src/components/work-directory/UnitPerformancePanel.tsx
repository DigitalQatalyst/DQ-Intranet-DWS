import React from "react";
import classNames from "clsx";

type UnitPerformanceStatus = "leading" | "on_track" | "at_risk";

type Props = {
  status: UnitPerformanceStatus;
  score: number;
  lastUpdated?: string | null;
  helperText?: string;
};

const STATUS_STYLES: Record<UnitPerformanceStatus, { badge: string; dot: string; gradient: string; label: string }> = {
  leading: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    label: "Leading",
  },
  on_track: {
    badge: "bg-sky-50 text-sky-700 border border-sky-200",
    dot: "bg-sky-500",
    gradient: "from-sky-400 via-indigo-500 to-indigo-600",
    label: "On Track",
  },
  at_risk: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    label: "At Risk",
  },
};

export const UnitPerformancePanel: React.FC<Props> = ({
  status,
  score,
  lastUpdated,
  helperText = "This performance indicator reflects mandate delivery, priorities, and overall execution health.",
}) => {
  const clampedScore = Math.min(100, Math.max(0, Number.isFinite(score) ? score : 0));
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.on_track;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Unit Performance</h3>
        <span
          className={classNames(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            styles.badge
          )}
        >
          <span className={classNames("h-2 w-2 rounded-full", styles.dot)} aria-hidden />
          {styles.label}
          <span className="text-slate-500 font-medium">· {clampedScore} / 100</span>
        </span>
      </div>

      <p className="text-sm text-slate-600">{helperText}</p>

      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={classNames("h-full rounded-full bg-gradient-to-r", styles.gradient)}
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      <div className="text-xs text-slate-500">
        Last updated: {lastUpdated || "Not yet updated"}
      </div>
    </section>
  );
};
