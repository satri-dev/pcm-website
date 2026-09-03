// src/types/faqs.ts
// Canonical schema for the "faqs" collection

export type FaqCategory = string;

export const FAQ_CATEGORIES: readonly string[] = [
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
  category: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface FaqDocument {
  _id?: import("mongodb").ObjectId;
  question: string;
  slug: string;
  category: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface FaqCreateInput {
  question: string;
  slug: string;
  category: string;
  answer: string;
}

export type FaqUpdateInput = Partial<FaqCreateInput>;
