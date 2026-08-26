// src/types/scholarships.ts
// Canonical schema for the "scholarships" collection

export type ScholarshipType =
  | "Merit"
  | "Need-based"
  | "University"
  | "Category";

export const SCHOLARSHIP_TYPES: readonly ScholarshipType[] = [
  "Merit",
  "Need-based",
  "University",
  "Category",
];

export const SCHOLARSHIP_COLLECTION = "scholarships";

export interface Scholarship {
  id: string;
  title: string;
  slug: string;
  type: ScholarshipType;
  desc: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  slug: string;
  type: ScholarshipType;
  desc: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScholarshipCreateInput {
  title: string;
  slug: string;
  type: ScholarshipType;
  desc: string;
  active: boolean;
}

export type ScholarshipUpdateInput = Partial<ScholarshipCreateInput>;
