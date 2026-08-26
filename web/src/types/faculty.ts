export type FacultyGroup = "Leadership" | "Faculty" | "Administration";

export const FACULTY_GROUPS: readonly FacultyGroup[] = [
  "Leadership",
  "Faculty",
  "Administration",
];

export const FACULTY_COLLECTION = "faculty";

export interface Faculty {
  id: string;
  name: string;
  role: string;
  group: FacultyGroup;
  photo: string;
  email: string;
  phone: string;
}

export interface FacultyDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  role: string;
  group: FacultyGroup;
  photo: string;
  email: string;
  phone: string;
}

export interface FacultyCreateInput {
  name: string;
  role: string;
  group: FacultyGroup;
  photo?: string;
  email?: string;
  phone?: string;
}

export type FacultyUpdateInput = Partial<FacultyCreateInput>;
