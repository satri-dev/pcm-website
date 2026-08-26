import type { GradeEntry } from "../types";

/**
 * Pokhara University grading scale.
 * Source: PU Academic Regulations.
 */
export const PU_GRADING_SCALE: GradeEntry[] = [
  { minPercent: 90, maxPercent: 100, grade: "A",  gradePoint: 4.0, description: "Outstanding"  },
  { minPercent: 80, maxPercent: 89,  grade: "A-", gradePoint: 3.7, description: "Excellent"     },
  { minPercent: 70, maxPercent: 79,  grade: "B+", gradePoint: 3.3, description: "Very Good"     },
  { minPercent: 60, maxPercent: 69,  grade: "B",  gradePoint: 3.0, description: "Good"          },
  { minPercent: 55, maxPercent: 59,  grade: "B-", gradePoint: 2.7, description: "Fair"          },
  { minPercent: 50, maxPercent: 54,  grade: "C+", gradePoint: 2.3, description: "Satisfactory"  },
  { minPercent: 45, maxPercent: 49,  grade: "C",  gradePoint: 2.0, description: "Pass"          },
  { minPercent: 40, maxPercent: 44,  grade: "C-", gradePoint: 1.7, description: "Weak Pass"     },
  { minPercent: 35, maxPercent: 39,  grade: "D+", gradePoint: 1.3, description: "Poor"          },
  { minPercent: 30, maxPercent: 34,  grade: "D",  gradePoint: 1.0, description: "Very Poor"     },
  { minPercent: 0,  maxPercent: 29,  grade: "F",  gradePoint: 0.0, description: "Fail"          },
];

/** Grade point colours for visual feedback */
export const GRADE_COLORS: Record<string, string> = {
  "A":  "#22c55e",
  "A-": "#4ade80",
  "B+": "#86efac",
  "B":  "#3b82f6",
  "B-": "#60a5fa",
  "C+": "#a78bfa",
  "C":  "#f59e0b",
  "C-": "#fb923c",
  "D+": "#f87171",
  "D":  "#ef4444",
  "F":  "#dc2626",
};

/** Minimum credit hours & max credit hours for a single subject */
export const CREDIT_MIN = 1;
export const CREDIT_MAX = 6;
