export type AlumniProgram = "BBA" | "BCSIT" | "BBA-Finance";
export type AlumniSector = "Banking & Finance" | "Technology" | "Education" | "Entrepreneurship";

export const ALUMNI_PROGRAMS: readonly AlumniProgram[] = ["BBA", "BCSIT", "BBA-Finance"];
export const ALUMNI_SECTORS: readonly AlumniSector[] = ["Banking & Finance", "Technology", "Education", "Entrepreneurship"];

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
