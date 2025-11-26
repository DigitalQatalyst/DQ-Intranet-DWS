import React from "react";
import classNames from "clsx";
import { getPerformanceStyle } from "../work-directory/unitStyles";

type UnitPerformanceStatus = "leading" | "on_track" | "at_risk";

export type UnitPerformancePanelProps = {
  status: UnitPerformanceStatus;
  score: number;
  lastUpdated?: string | null;
  helperText?: string;
  showTitle?: boolean;
};

export const UnitPerformancePanel: React.FC<UnitPerformancePanelProps> = ({
  status,
  score,
  lastUpdated,
  helperText = "This performance indicator reflects the latest functional tracker status for this unit based on mandate delivery, priorities, and overall execution health.",
  showTitle = true,
}) => {
  const clampedScore = Math.min(100, Math.max(0, Number.isFinite(score) ? score : 0));
  const styles = getPerformanceStyle(status);
  const statusLabel =
    status === "leading" ? "Leading" : status === "at_risk" ? "At Risk" : status === "on_track" ? "On Track" : "On Track";

  return (
    <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {showTitle !== false && (
          <h3 className="text-lg font-semibold text-slate-900">Unit Performance</h3>
        )}
        <span
          className={classNames(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border",
            styles.pillClass
          )}
        >
          <span className={classNames("h-2 w-2 rounded-full", "bg-current")} aria-hidden />
          {statusLabel}
          <span className="text-slate-500 font-medium">· {clampedScore} / 100</span>
        </span>
      </div>

      {helperText && <p className="text-sm text-slate-600">{helperText}</p>}

      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={classNames("h-full rounded-full bg-gradient-to-r", styles.barGradient)}
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      {lastUpdated && (
        <div className="text-xs text-slate-500">
          Last updated: {lastUpdated}
        </div>
      )}
    </section>
  );
};
