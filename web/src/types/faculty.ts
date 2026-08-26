export type FacultyDepartment = "Management" | "Computer Science" | "Hospitality" | "Business" | "Administration";
export type FacultyStatus = "active" | "inactive" | "on_leave";

export const FACULTY_DEPARTMENTS: readonly FacultyDepartment[] = [
  "Management",
  "Computer Science",
  "Hospitality",
  "Business",
  "Administration",
];

export const FACULTY_STATUSES: readonly FacultyStatus[] = ["active", "inactive", "on_leave"];

export const FACULTY_COLLECTION = "faculty";

export interface Faculty {
  id: string;
  name: string;
  department: FacultyDepartment;
  designation: string;
  image: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  bio: string;
  status: FacultyStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FacultyDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  department: FacultyDepartment;
  designation: string;
  image: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  bio: string;
  status: FacultyStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FacultyCreateInput {
  name: string;
  department: FacultyDepartment;
  designation: string;
  image: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  bio: string;
  status: FacultyStatus;
  featured?: boolean;
}

export type FacultyUpdateInput = Partial<FacultyCreateInput>;
