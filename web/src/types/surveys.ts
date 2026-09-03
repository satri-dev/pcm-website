// src/types/surveys.ts
// Canonical schema mirrors the "surveys" collection validator.

export type SurveyStatus = "published" | "draft";
export type SurveyCategory = string;

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string[];
}

// --- Question Types (Google Forms-like) ---
// "number", "email", "phone", "url" cover native HTML input variants.
// "group" lets you nest fields inside a field (field-within-field).

export type QuestionType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "url"
  | "radio"
  | "checkbox"
  | "select"
  | "rating"
  | "date"
  | "time"
  | "section"
  | "description"
  | "group";

// Types that can be a "parent" for conditional visibility (they hold a discrete value).
export const VISIBLE_PARENT_TYPES: readonly QuestionType[] = [
  "radio",
  "select",
  "checkbox",
  "rating",
  "number",
  "text",
  "email",
  "phone",
  "url",
];

// Types that render option editors (add/edit/remove choices).
export const OPTION_TYPES: readonly QuestionType[] = [
  "radio",
  "select",
  "checkbox",
];

// Condition operators for conditional rendering ("show this question only if ...").
export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "in"
  | "notIn"
  | "empty"
  | "notEmpty";

export interface QuestionCondition {
  parentId: string;   // id of a previous question this one depends on
  operator: ConditionOperator;
  value?: string | string[] | number;
}

// A question. `children` makes it a nested container (a "group").
// `visibility` enables logic-based rendering tied to a previous answer.
export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  label: string;
  hint?: string;
  required?: boolean;
  options?: string[];        // for radio / checkbox / select
  maxRating?: number;        // for rating (default 5)
  placeholder?: string;      // for text/textarea/number/email/etc.
  min?: number;              // for number
  max?: number;              // for number
  defaultValue?: string | number | boolean;
  children?: SurveyQuestion[];      // nested sub-fields (grouping)
  visibility?: QuestionCondition;   // render only when parent matches
}

export const SURVEY_CATEGORIES: readonly string[] = [
  "Academic",
  "Facilities",
  "Careers",
  "General",
  "Student Life",
  "Administration",
];

export const SURVEY_STATUSES: readonly SurveyStatus[] = ["published", "draft"];
export const SURVEY_COLLECTION = "surveys";

// UI-facing shape. endsOn is "YYYY-MM-DD" string; questions are JSON.
export interface Survey {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: SurveyCategory;
  icon: string;            // emoji
  status: SurveyStatus;
  featured: boolean;
  timeToRead: number;      // auto-calculated from questions
  endsOn?: string;         // "YYYY-MM-DD" or undefined
  questions: SurveyQuestion[];
  tags?: string[];
  seo?: SeoMeta;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

// Database document shape ("surveys" collection)
export interface SurveyDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: SurveyCategory;
  icon: string;
  status: SurveyStatus;
  featured: boolean;
  timeToRead: number;
  endsOn?: Date;
  questions: SurveyQuestion[];
  tags?: string[];
  seo?: SeoMeta;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

// Payload accepted by repository when creating/updating.
export interface SurveyCreateInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: SurveyCategory;
  icon: string;
  status: SurveyStatus;
  featured?: boolean;
  endsOn?: string;         // "YYYY-MM-DD"
  questions: SurveyQuestion[];
  tags?: string[];
  seo?: SeoMeta;
  timeToRead?: number;     // auto-calculated if omitted
}

export type SurveyUpdateInput = Partial<SurveyCreateInput>;