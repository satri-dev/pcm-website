export type AlumniStatus = "active" | "inactive";
export type AlumniBatch = string;

export const ALUMNI_STATUSES: readonly AlumniStatus[] = ["active", "inactive"];

export const ALUMNI_COLLECTION = "alumni";

export interface Alumni {
  id: string;
  name: string;
  batch: string;
  program: string;
  image: string;
  email: string;
  phone: string;
  currentCompany: string;
  designation: string;
  location: string;
  bio: string;
  linkedin: string;
  status: AlumniStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniDocument {
  _id?: import("mongodb").ObjectId;
  name: string;
  batch: string;
  program: string;
  image: string;
  email: string;
  phone: string;
  currentCompany: string;
  designation: string;
  location: string;
  bio: string;
  linkedin: string;
  status: AlumniStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlumniCreateInput {
  name: string;
  batch: string;
  program: string;
  image: string;
  email: string;
  phone: string;
  currentCompany: string;
  designation: string;
  location: string;
  bio: string;
  linkedin: string;
  status: AlumniStatus;
  featured?: boolean;
}

export type AlumniUpdateInput = Partial<AlumniCreateInput>;
