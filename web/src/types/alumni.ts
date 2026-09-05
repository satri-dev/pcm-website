export type AlumniProgram = string;
export type AlumniSector = string;

export const ALUMNI_PROGRAMS: readonly AlumniProgram[] = ["BBA", "BCSIT", "BBA-Finance"];
export const ALUMNI_SECTORS: readonly AlumniSector[] = ["Banking & Finance", "Technology", "Education", "Entrepreneurship"];

export const ALUMNI_ROLES: readonly string[] = [
  "Branch Manager",
  "Bank Officer",
  "Relationship Officer",
  "Credit Analyst",
  "Investment Analyst",
  "Financial Analyst",
  "Marketing Manager",
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
  "System Administrator",
  "Lecturer / Researcher",
  "Teacher / Educator",
  "Founder / Entrepreneur",
  "HR Officer",
];

export const ALUMNI_COLLECTION = "alumni";

export interface Alumni {
  id: string;
  name: string;
  batch: string;
  program: AlumniProgram;
  sector: AlumniSector;
  role: string;
  location: string;
  photo: string;
}

export interface AlumniDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  batch: string;
  program: AlumniProgram;
  sector: AlumniSector;
  role: string;
  location: string;
  photo: string;
}

export interface AlumniCreateInput {
  name: string;
  batch: string;
  program: AlumniProgram;
  sector: AlumniSector;
  role: string;
  location?: string;
  photo?: string;
}

export type AlumniUpdateInput = Partial<AlumniCreateInput>;
