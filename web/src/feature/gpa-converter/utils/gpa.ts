import { PU_GRADING_SCALE } from "../data/grading";
import type { GradeEntry, Subject, GpaResult, SubjectResult } from "../types";

/** Convert a percentage score to a PU grade entry */
export function percentToGrade(percent: number): GradeEntry {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    PU_GRADING_SCALE.find(
      (g) => clamped >= g.minPercent && clamped <= g.maxPercent
    ) ?? PU_GRADING_SCALE[PU_GRADING_SCALE.length - 1]
  );
}

function parse(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) || n < 0 ? NaN : n;
}

/** Calculate full GPA result from a list of subjects */
export function calcGpa(subjects: Subject[]): GpaResult {
  let totalCredits     = 0;
  let totalGradePoints = 0;
  let hasInvalid       = false;

  const results: SubjectResult[] = subjects.map((s) => {
    const credits   = parse(s.creditHours);
    const thFull    = parse(s.theoryFullMarks);
    const prFull    = parse(s.practicalFullMarks) || 0;   // 0 = no practical
    const thObt     = parse(s.theoryObtained);
    const prObt     = parse(s.practicalObtained) || 0;    // 0 = no practical

    const totalFull = thFull + prFull;
    const totalObt  = thObt + prObt;

    const isValid =
      !isNaN(credits) && credits > 0 &&
      !isNaN(thFull)  && thFull > 0 &&
      !isNaN(thObt)   && thObt >= 0 &&
      totalObt <= totalFull;

    if (!isValid) {
      hasInvalid = true;
      return {
        id: s.id, name: s.name || "—",
        creditHours: NaN, theoryObtained: NaN, practicalObtained: NaN,
        totalObtained: NaN, totalFull: NaN,
        percentage: NaN, grade: "—", gradePoint: NaN, gradePoints: NaN,
      };
    }

    const pct    = (totalObt / totalFull) * 100;
    const entry  = percentToGrade(pct);
    const gp     = credits * entry.gradePoint;

    totalCredits     += credits;
    totalGradePoints += gp;

    return {
      id: s.id,
      name: s.name || "—",
      creditHours:      credits,
      theoryObtained:   thObt,
      practicalObtained:prObt,
      totalObtained:    Math.round(totalObt * 100) / 100,
      totalFull:        totalFull,
      percentage:       Math.round(pct * 100) / 100,
      grade:            entry.grade,
      gradePoint:       entry.gradePoint,
      gradePoints:      Math.round(gp * 100) / 100,
    };
  });

  const sgpa =
    totalCredits > 0
      ? Math.round((totalGradePoints / totalCredits) * 100) / 100
      : 0;

  return {
    sgpa,
    totalCredits,
    totalGradePoints: Math.round(totalGradePoints * 100) / 100,
    subjects: results,
    hasInvalid,
  };
}

export function gpaStanding(sgpa: number): string {
  if (sgpa >= 3.7) return "Outstanding";
  if (sgpa >= 3.3) return "Excellent";
  if (sgpa >= 3.0) return "Very Good";
  if (sgpa >= 2.7) return "Good";
  if (sgpa >= 2.0) return "Satisfactory";
  if (sgpa >= 1.0) return "Poor";
  return "Fail";
}

export function gpaColor(sgpa: number): string {
  if (sgpa >= 3.7) return "#22c55e";
  if (sgpa >= 3.0) return "#3b82f6";
  if (sgpa >= 2.0) return "#f59e0b";
  if (sgpa >= 1.0) return "#f97316";
  return "#ef4444";
}
