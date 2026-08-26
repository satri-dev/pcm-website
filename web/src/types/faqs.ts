// src/types/faqs.ts
// Canonical schema for the "faqs" collection

export type FaqCategory =
  | "Admission"
  | "Scholarship"
  | "Programs"
  | "Campus"
  | "General";

export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  "Admission",
  "Scholarship",
  "Programs",
  "Campus",
  "General",
];

export const FAQ_COLLECTION = "faqs";

export interface Faq {
  id: string;
  question: string;
  slug: string;
  category: FaqCategory;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqDocument {
  _id?: import("mongodb").ObjectId;
  question: string;
  slug: string;
  category: FaqCategory;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaqCreateInput {
  question: string;
  slug: string;
  category: FaqCategory;
  answer: string;
}

export type FaqUpdateInput = Partial<FaqCreateInput>;
