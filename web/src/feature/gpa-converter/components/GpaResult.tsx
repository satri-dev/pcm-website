"use client";

import type { GpaResult as IGpaResult } from "../types";
import { gpaStanding, gpaColor } from "../utils/gpa";
import { GRADE_COLORS } from "../data/grading";

interface Props {
  result:     IGpaResult;
  calculated: boolean;
}

export default function GpaResult({ result, calculated }: Props) {
  const { sgpa, totalCredits, totalGradePoints, subjects } = result;
  const hasData    = calculated && totalCredits > 0;
  const anyFailed  = calculated && subjects.some((s) => s.failedPassMark);

  // If any subject failed pass mark → overall result is FAIL, hide numeric GPA
  const color  = !hasData ? "var(--muted-c)" : anyFailed ? "#dc2626" : gpaColor(sgpa);
  // For fail state draw the full ring in red; otherwise fill proportionally
  const pct    = hasData && !anyFailed ? Math.min((sgpa / 4.0) * 100, 100) : anyFailed ? 100 : 0;

  const R   = 52;
  const CIR = 2 * Math.PI * R;
  const offset = CIR - (pct / 100) * CIR;

  return (
    <aside className="gpa-result-card">
      {/* Ring */}
      <div className="gpa-ring-wrap" aria-label={anyFailed ? "Overall result: FAIL" : `SGPA ${sgpa.toFixed(2)} out of 4.0`}>
        <svg viewBox="0 0 120 120" className="gpa-ring-svg" aria-hidden="true">
          <circle cx="60" cy="60" r={R} className="gpa-ring-bg" />
          <circle
            cx="60" cy="60" r={R}
            className="gpa-ring-fg"
            style={{
              stroke: color,
              strokeDasharray: CIR,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="gpa-ring-label">
          {anyFailed ? (
            <span className="gpa-ring-score" style={{ color, fontSize: "1.6rem", letterSpacing: "-.02em" }}>FAIL</span>
          ) : (
            <>
              <span className="gpa-ring-score" style={{ color }}>
                {hasData ? sgpa.toFixed(2) : "—"}
              </span>
              <span className="gpa-ring-out">/ 4.0</span>
              <span className="gpa-ring-standing" style={{ color }}>
                {!calculated ? "Click Calculate" : hasData ? gpaStanding(sgpa) : "Enter marks"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="gpa-stats">
        <div className="gpa-stat">
          <span>Total Credits</span>
          <b>{hasData ? totalCredits : "—"}</b>
        </div>
        <div className="gpa-stat">
          <span>Grade Points</span>
          <b>{hasData ? (anyFailed ? "—" : totalGradePoints.toFixed(2)) : "—"}</b>
        </div>
        <div className="gpa-stat">
          <span>Subjects</span>
          <b>{subjects.filter((s) => !isNaN(s.gradePoint)).length}</b>
        </div>
      </div>

      {/* Per-subject breakdown */}
      {subjects.some((s) => !isNaN(s.gradePoint)) && (
        <div className="gpa-breakdown">
          <h4 className="gpa-breakdown-title">Breakdown</h4>
          {subjects
            .filter((s) => !isNaN(s.gradePoint))
            .map((s) => (
              <div
                key={s.id}
                className={`gpa-breakdown-row${s.failedPassMark ? " gpa-breakdown-row--fail" : ""}`}
                title={s.failedPassMark ? s.failReason : undefined}
              >
                <span className="gpa-breakdown-name">
                  {s.name || "Subject"}
                </span>
                <span
                  className="gpa-breakdown-grade"
                  style={{ color: s.failedPassMark ? "#dc2626" : (GRADE_COLORS[s.grade] ?? "var(--muted-c)") }}
                >
                  {s.grade}
                </span>
                <span className="gpa-breakdown-gp">{s.gradePoints.toFixed(2)} GP</span>
              </div>
            ))}
        </div>
      )}
    </aside>
  );
}
