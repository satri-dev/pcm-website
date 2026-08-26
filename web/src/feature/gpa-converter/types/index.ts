export interface Subject {
  id: string;
  name: string;
  creditHours: string;        // credit hours (1–6)
  theoryFullMarks: string;    // theory exam full marks (e.g. 60, 80, 100)
  practicalFullMarks: string; // practical/internal full marks (0 if none)
  theoryObtained: string;     // marks obtained in theory
  practicalObtained: string;  // marks obtained in practical (0 if none)
}

export interface GradeEntry {
  minPercent: number;
  maxPercent: number;
  grade: string;
  gradePoint: number;
  description: string;
}

export interface SubjectResult {
  id: string;
  name: string;
  creditHours: number;
  theoryObtained: number;
  practicalObtained: number;
  totalObtained: number;
  totalFull: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  gradePoints: number;      // creditHours × gradePoint
}

export interface GpaResult {
  sgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  subjects: SubjectResult[];
  hasInvalid: boolean;
}
