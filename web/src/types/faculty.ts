export type FacultyGroup = "Leadership" | "Faculty" | "Administration";

export const FACULTY_GROUPS: readonly FacultyGroup[] = [
  "Leadership",
  "Faculty",
  "Administration",
];

export const FACULTY_ROLES: readonly string[] = [
  "Principal",
  "BCSIT Coordinator",
  "BBA Coordinator (Morning)",
  "BBA Coordinator (Day)",
  "Faculty Member",
  "Administrator (Morning)",
  "Accountant",
  "Accountant Assist",
  "Executive Secretary",
  "Office Secretary",
  "Office Assistant",
  "IT Technician",
  "Driver / Store / Photocopy",
  "Sweeper",
  "Guard",
];

export const FACULTY_COLLECTION = "faculty";

export interface Faculty {
  id: string;
  name: string;
  role: string;
  group: FacultyGroup;
  order: number;
  photo: string;
  email: string;
  phone: string;
}

export interface FacultyDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  role: string;
  group: FacultyGroup;
  order: number;
  photo: string;
  email: string;
  phone: string;
}

export interface FacultyCreateInput {
  name: string;
  role: string;
  group: FacultyGroup;
  order?: number;
  photo?: string;
  email?: string;
  phone?: string;
}

export type FacultyUpdateInput = Partial<FacultyCreateInput>;
