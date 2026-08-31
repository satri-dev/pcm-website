// src/types/programs.ts
// Canonical schema for the "programs" collection

export type ProgramLevel =
  | "Bachelor"
  | "Bachelor (Finance)"
  | "Bachelor (IT)";
export type ProgramStatus = "open" | "closed";

export const PROGRAM_LEVELS: readonly ProgramLevel[] = [
  "Bachelor",
  "Bachelor (Finance)",
  "Bachelor (IT)",
];

export const PROGRAM_STATUSES: readonly ProgramStatus[] = ["open", "closed"];

export const PROGRAM_COLLECTION = "programs";

export interface Program {
  id: string;
  name: string;
  slug: string;
  code: string;
  level: ProgramLevel;
  duration: string;
  semesters: number;
  creditHours: number;
  seats: number;
  status: ProgramStatus;
  image?: string;
  intro: string;
  eligibility: string;
  affiliation: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface ProgramDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  slug: string;
  code: string;
  level: ProgramLevel;
  duration: string;
  semesters: number;
  creditHours: number;
  seats: number;
  status: ProgramStatus;
  image?: string;
  intro: string;
  eligibility: string;
  affiliation: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface ProgramCreateInput {
  name: string;
  slug: string;
  code: string;
  level: ProgramLevel;
  duration: string;
  semesters: number;
  creditHours: number;
  seats: number;
  status: ProgramStatus;
  image?: string;
  intro: string;
  eligibility: string;
  affiliation: string;
  views?: number;
}

export type ProgramUpdateInput = Partial<ProgramCreateInput>;
