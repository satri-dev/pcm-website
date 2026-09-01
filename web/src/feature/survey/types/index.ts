export type QuestionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "select"
  | "rating";

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  label: string;
  hint?: string;
  required?: boolean;
  options?: string[];      // for radio / checkbox / select
  maxRating?: number;      // for rating (default 5)
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;        // e.g. "Academic", "Facilities", "General"
  icon: string;            // emoji
  isActive: boolean;
  deadline?: string;       // "YYYY-MM-DD" or undefined
  estimatedMinutes: number;
  questions: SurveyQuestion[];
}

export type SurveyAnswers = Record<string, string | string[] | number>;
export type SurveyStatus = "list" | "form" | "success";
