// src/types/results.ts
// Canonical schema for the "results" collection

export type ResultProgram = "BBA" | "BCSIT" | "BBA-Finance";
export type ResultStatus = "published" | "draft";

export const RESULT_PROGRAMS: readonly ResultProgram[] = [
  "BBA",
  "BCSIT",
  "BBA-Finance",
];

export const RESULT_STATUSES: readonly ResultStatus[] = ["published", "draft"];

export const RESULT_COLLECTION = "results";

export interface Result {
  id: string;
  title: string;
  slug: string;
  program: ResultProgram;
  date: string;
  status: ResultStatus;
  views: number;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface ResultDocument {
  _id?: import("mongodb").ObjectId;
  title: string;
  slug: string;
  program: ResultProgram;
  date: Date;
  status: ResultStatus;
  views: number;
  fileUrl?: string;
  fileName?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface ResultCreateInput {
  title: string;
  slug: string;
  program: ResultProgram;
  date: string;
  status: ResultStatus;
  fileUrl?: string;
  fileName?: string;
  views?: number;
}

export type ResultUpdateInput = Partial<ResultCreateInput>;
